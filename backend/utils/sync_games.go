package utils

import (
	"fmt"
	"log"
	"time"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
)

var CHUNK_SIZE = config.APP.Steam.SyncChunkSize
var PROCESS_LOCKED bool
var LAST_SYNC time.Time
var COOLDOWN = time.Second * time.Duration(config.APP.Steam.SyncCooldown)

func setProcessLock(isLocked bool) {
	PROCESS_LOCKED = isLocked
}

func SyncGames() {
	if time.Since(LAST_SYNC) <= COOLDOWN {
		remainingCooldown := time.Until(LAST_SYNC.Add(COOLDOWN)).Round(time.Second)
		log.Println("Last sync was too recent, cannot start new sync process. Last sync was at: " + LAST_SYNC.Format(time.RFC3339))
		log.Println("Remaining time until a new sync process can be started: " + remainingCooldown.String())
		return
	}

	if PROCESS_LOCKED {
		log.Println("Can't start sync process, another sync process is already running.")
		return
	}

	setProcessLock(true)
	defer setProcessLock(false)

	log.Println("Starting sync process!")

	var users []models.User
	if err := db.ORM.Find(&users).Error; err != nil {
		log.Printf("Sync process failed: %s\n", err)
		return
	}

	games := make(map[string]string)
	userOwnedGames := make(map[string]map[string]string)
	for _, user := range users {
		if len(user.ID) <= 0 {
			continue
		}
		userGames, err := config.STEAM_API_CLIENT.GetOwnedGames(user.ID)
		if err != nil {
			log.Println(err)
			continue
		}
		userOwnedGames[user.ID] = make(map[string]string)

		for _, game := range userGames {
			gameID := string(game.GameID)
			if len(gameID) <= 0 {
				continue
			}
			userOwnedGames[user.ID][gameID] = gameID

			if _, ok := games[gameID]; !ok {
				games[gameID] = gameID
			}
		}
	}

	count := 0
	for i := range games {
		gameID := games[i]
		if err := db.ORM.First(&models.Game{}, "id = ?", gameID).Error; err == nil {
			log.Printf("Game with id %s already exists.", gameID)
			continue
		}

		if err := db.ORM.First(&models.BadGame{}, "id = ?", gameID).Error; err == nil {
			log.Printf("Game with id %s is on the blacklist. Skipping", gameID)
			continue
		}

		if count >= CHUNK_SIZE {
			log.Printf("Reached rate limit, waiting for %d seconds", COOLDOWN)
			time.Sleep(COOLDOWN)
			count = 0
		}

		count++
		gameDetails, err := config.STEAM_API_CLIENT.GetGameDetails(gameID)
		if err != nil {
			log.Println(err)
			continue
		}

		game := models.Game{
			ID:                 gameDetails.Id.String(),
			Name:               gameDetails.Name,
			IsFree:             gameDetails.IsFree,
			ShortDescription:   gameDetails.ShortDescription,
			HeaderImageUrl:     gameDetails.HeaderImageUrl,
			Website:            gameDetails.Website,
			BackgroundImageUrl: gameDetails.BackgroundImageUrl,
			StoreUrl:           fmt.Sprintf("%s/app/%s", config.STEAM_API_CLIENT.StoreBaseUrl, gameDetails.Id.String()),
			IsHidden:           false,
		}

		if len(game.ID) <= 0 || len(game.Name) <= 0 {
			log.Println("Received invalid game details for game " + gameID)
			if len(gameID) > 0 {
				log.Printf("Adding %s to list of invalid IDs\n", gameID)
				badGame := models.BadGame{
					ID: gameID,
				}
				if err := db.ORM.Create(&badGame).Error; err != nil {
					log.Println(err)
				}
			}
			continue
		}

		if err := db.ORM.First(&models.Game{}, "id = ?", game.ID).Error; err == nil {
			log.Printf("Game with id %s (sourceID: %s) already exists\n", game.ID, gameID)
			continue
		}

		if err := db.ORM.Create(&game).Error; err != nil {
			log.Printf("Error creating game %s: %s\n", game.ID, err)
			continue
		}

		if err := db.ORM.First(&game, "id = ?", game.ID).Error; err != nil {
			log.Println(err)
			continue
		}

		for _, cat := range gameDetails.Categories {
			category := models.Category{
				ID:          cat.Id.String(),
				Description: cat.Name,
				Relevance:   10,
			}
			appendSteamTagToGameAssociation(&category, "Categories", &game, gameID)
		}

		//TODO: Get rid of this duplicate block
		for _, gen := range gameDetails.Genres {
			genre := models.Genre{
				ID:          gen.Id.String(),
				Description: gen.Name,
				Relevance:   10,
			}
			appendSteamTagToGameAssociation(&genre, "Genres", &game, gameID)
		}

		log.Printf("Finished processing game: %s\n", game.ID)
	}

	for userID, games := range userOwnedGames {
		var user models.User
		if err := db.ORM.First(&user, "id = ?", userID).Error; err != nil {
			log.Println(err)
			continue
		}

		for gameID := range games {
			if len(gameID) <= 0 {
				continue
			}

			if err := db.ORM.First(&models.BadGame{}, "id = ?", gameID).Error; err == nil {
				log.Printf("Game with id %s is on the blacklist. Skipping", gameID)
				continue
			}

			var game models.Game
			if err := db.ORM.First(&game, "id=?", gameID).Error; err != nil {
				log.Printf("Error fetching game %s: %s\n", gameID, err)
				continue
			}

			if err := db.ORM.Model(&user).Association("Games").Append(&game); err != nil {
				log.Printf("Error appending game %s to user %s: %s\n", gameID, user.ID, err)
				continue
			}
		}

		log.Printf("Finished processing user: %s\n", user.ID)
	}

	LAST_SYNC = time.Now()
	log.Println("Completed sync process")
}

func appendSteamTagToGameAssociation(model interface{}, association string, game *models.Game, gameID string) {
	if err := db.ORM.Model(game).Association(association).Append(model); err != nil {
		log.Printf("Error appending %s to game %s: %s\n", association, gameID, err)
	}
}
