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
		Order("relevance desc, description").
		Find(&result.Categories, "relevance > 0").Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if err := db.ORM.
		Order("relevance desc, description").
		Find(&result.Genres, "relevance > 0").Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if err := db.ORM.
		Find(&models.Game{}).
		Count(&result.Total).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
