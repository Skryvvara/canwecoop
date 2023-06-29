package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
)

func GetGenres(w http.ResponseWriter, r *http.Request) {
	var genres []models.Category

	if err := db.ORM.Order("relevance DESC, description").Find(&genres).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(&genres)
}

func UpdateGenre(w http.ResponseWriter, r *http.Request) {
	var genre models.Genre

	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&genre); err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := db.ORM.Save(&genre).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
	}

	w.Write([]byte("Genre updated successfully"))
}
