package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
)

// GetAlLBadGames returns all IDs of games that couldn't be added during a sync process.
// It handles any errors that occur during the database query by logging them and returning an HTTP 500 error response
func GetAllBadGames(w http.ResponseWriter, r *http.Request) {
	var badGames []models.BadGame

	if err := db.ORM.Find(&badGames).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(&badGames)
}

func CreateBadGame(w http.ResponseWriter, r *http.Request) {
	var badGame models.BadGame

	if err := json.NewDecoder(r.Body).Decode(&badGame); err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := db.ORM.Create(&badGame).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	msg := fmt.Sprintf("Successfully created bad-game with id %s.", badGame.ID)
	w.Write([]byte(msg))
}

func DeleteBadGameByID(w http.ResponseWriter, r *http.Request) {
	gameID := chi.URLParam(r, "id")
	if len(gameID) <= 0 {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	var badGame models.BadGame
	if err := db.ORM.Find(&badGame, "id = ?", gameID).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	if err := db.ORM.Delete(&badGame).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	msg := fmt.Sprintf("Successfully deleted bad-game with id %s.", gameID)
	w.Write([]byte(msg))
}
