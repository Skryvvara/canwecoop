package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
	"gorm.io/gorm"
)

// addDistinctNameQuery adds a query to filter the games by the given values
// for the specified column in a many-to-many relationship.
//
// stmt: a pointer to a gorm.DB instance representing the current database session.
// column: a string representing the name of the column to filter on.
// m2m_column: a string representing the name of the many-to-many relationship table column.
// values: a slice of strings representing the distinct values to filter on.
// strict: a boolean parameter which defines whether a game has to match every given value or at least one of them
//
// Returns: a pointer to a gorm.DB instance with the query added.
func addDistinctNameQuery(stmt *gorm.DB, column, m2m_column string, values []string) *gorm.DB {
	amount := len(values)

	if len(values) > 0 {
		stmt.Table("games").
			Joins(fmt.Sprintf("JOIN game_%s ON games.id = game_%s.game_id", m2m_column, m2m_column)).
			Joins(fmt.Sprintf("JOIN %s ON %s.id = game_%s.%s_id", column, column, m2m_column, m2m_column)).
			Where(fmt.Sprintf("%s.description IN (?)", column), values).
			Group("games.id").
			Having(fmt.Sprintf("COUNT(DISTINCT %s.description) = ?", column), amount)
	}

	return stmt
}

// GetGameById is an HTTP handler function that retrieves a game from the database by its ID.
// The function expects an ID parameter to be passed in the URL path, and it returns an HTTP 400 Bad Request error
// if the ID is not provided or is an empty string.
// If the game is found in the database, it is returned as a JSON response with an HTTP 200 OK status code.
// If the game is not found in the database, an HTTP 404 Not Found error is returned.
// If there is an error while querying the database, an HTTP 500 Internal Server Error is returned.
func GetGameById(w http.ResponseWriter, r *http.Request) {
	gameID := chi.URLParam(r, "id")
	if len(gameID) <= 0 {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	var game models.Game
	if err := db.ORM.Preload("Categories").Preload("Genres").First(&game, "id = ?", gameID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(game)
}

type PaginationMetaData struct {
	Page     int   `json:"page"`
	Size     int   `json:"size"`
	Total    int64 `json:"total"`
	LastPage int   `json:"lastPage"`
}

type GamesResult struct {
	Games    []models.Game      `json:"games"`
	MetaData PaginationMetaData `json:"meta"`
}

// GetAllGames returns all games matching the given filters. Filters can be applied using query parameters in the URL.
// Supported filters include:
// - name: a string used to filter games by name
// - is_free: a boolean value used to filter games by whether they are free or not (0 = not free, 1 = free)
// - categories: a comma-separated list of categories used to filter games by category name
// - genres: a comma-separated list of genres used to filter games by genre name
// - users: a comma-separated list of users used to filter games by user id
// - ignoreDefaultCategories: a boolean parameter to ignore the default categories
//
// It handles any errors that occur during the database query by logging them and returning an HTTP 500 error response
func GetAllGames(w http.ResponseWriter, r *http.Request) {
	var result GamesResult

	stmt := db.ORM.Model(&models.Game{}).Preload("Genres").Preload("Categories")
	query := r.URL.Query()

	for key, value := range query {
		queryValue := value[len(value)-1]
		switch key {
		case "name":
			if len(queryValue) > 0 {
				stmt.Where("Lower(name) LIKE lower(?)", "%"+queryValue+"%")
			}
		case "isFree":
			if queryValue == "true" {
				stmt.Where("is_free = ?", queryValue)
			}
		case "categories":
			if len(queryValue) > 0 {
				categories := strings.Split(queryValue, ",")
				stmt = addDistinctNameQuery(stmt, "categories", "category", categories)
			}
		case "genres":
			if len(queryValue) > 0 {
				genres := strings.Split(queryValue, ",")
				stmt = addDistinctNameQuery(stmt, "genres", "genre", genres)
			}
		case "friends":
			if len(queryValue) > 0 {
				friends := strings.Split(queryValue, ",")
				stmt.Table("games").
					Joins("JOIN user_game ON games.id = user_game.game_id").
					Where("user_game.user_id IN (?)", friends).
					Group("games.id").
					Having("COUNT(DISTINCT user_game.user_id) = ?", len(friends))
			}
		case "ignoreDefaultCategories":
			if queryValue != "true" {
				if len(config.APP.Steam.DefaultCategories) > 0 {
					stmt = stmt.Joins("JOIN game_category default_category ON games.id = default_category.game_id").
						Joins("JOIN categories default_categories ON default_categories.id = default_category.category_id").
						Where("default_categories.description IN (?)", config.APP.Steam.DefaultCategories).
						Group("games.id")
				}
			}
		}
	}

	pagination := db.GetPaginationFromRequestQuery(r, 12, 84, 8)
	if err := stmt.
		Order("name asc").
		Count(&result.MetaData.Total).
		Scopes(db.Paginate(pagination)).
		Find(&result.Games).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	result.MetaData = PaginationMetaData{
		Page:     pagination.Page,
		Size:     pagination.Size,
		Total:    result.MetaData.Total,
		LastPage: (int(result.MetaData.Total) / pagination.Size) + 1,
	}

	json.NewEncoder(w).Encode(&result)
}
