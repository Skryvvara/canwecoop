package services

import (
	"log"
	"time"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/utils"
)

func syncGamesService() {
	log.Println("SyncGames-Service started")
	interval := time.Second * time.Duration(config.APP.Steam.SyncInterval)
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for range ticker.C {
		if utils.PROCESS_LOCKED {
			log.Println("Can't start sync process, another sync process is already running.")
		}

		go utils.SyncGames()
	}
}
