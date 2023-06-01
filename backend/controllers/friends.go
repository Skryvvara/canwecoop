package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/middleware"
	"github.com/skryvvara/canwecoop/utils"
)

func GetFriends(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromContext(r)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(user.Friends)
}

func UpdateFriends(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromContext(r)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	if err := utils.UpdateFriendList(user); err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Synced friends"))
}
