package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/middleware"
)

func GetAuth(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromContext(r)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func DeleteAuth(w http.ResponseWriter, r *http.Request) {
	_, err := r.Cookie(config.APP.AuthCookie.Name)
	if err != nil {
		println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	cookie := &http.Cookie{
		Name:     config.APP.AuthCookie.Name,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: config.APP.AuthCookie.HttpOnly,
		Path:     config.APP.AuthCookie.Path,
		Secure:   config.APP.AuthCookie.Secure,
	}
	http.SetCookie(w, cookie)
	w.Write([]byte("Successfully logged out"))
}
