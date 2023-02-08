package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
	"gorm.io/gorm"
)

func GetGameById(w http.ResponseWriter, r *http.Request) {
	gameID := chi.URLParam(r, "id")
	if len(gameID) <= 0 {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	var game models.Game
	if err := db.ORM.First(&game, "id = ?", gameID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(game)
}

func GetAllGames(w http.ResponseWriter, r *http.Request) {
	var games []models.Game

	if err := db.ORM.Find(&games).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(games)
}
