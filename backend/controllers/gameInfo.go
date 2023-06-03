package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
)

func GetGameInfo(w http.ResponseWriter, r *http.Request) {
	var categories []models.Category
	if err := db.ORM.Find(&categories, "relevance > 0").Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	var genres []models.Genre
	if err := db.ORM.Where("relevance > 0").Find(&genres).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	var total int64
	if err := db.ORM.Find(&models.Game{}).Count(&total).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"categories": categories,
		"genres":     genres,
		"total":      total,
	})
}
