package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
)

type Result struct {
	Categories []models.Category `json:"categories,omitempty"`
	Genres     []models.Genre    `json:"genres,omitempty"`
	Total      int64             `json:"total"`
}

func GetGameInfo(w http.ResponseWriter, r *http.Request) {
	var result Result

	if err := db.ORM.
		Table("(SELECT DISTINCT ON (description) * FROM categories WHERE relevance > 0) AS query").
		Order("relevance DESC, description").
		Find(&result.Categories).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if err := db.ORM.
		Table("(SELECT DISTINCT ON (description) * FROM genres WHERE relevance > 0) AS query").
		Order("relevance DESC, description").
		Find(&result.Genres).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
