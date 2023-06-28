package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
	"github.com/skryvvara/canwecoop/utils"
	"gorm.io/gorm"
)

func GetAuth(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(config.APP.AuthCookie.Name)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"data":    nil,
				"success": false,
			})
			return
		}

		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	issuer, err := utils.ParseJWT(cookie.Value)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	var user models.User
	if err := db.ORM.Preload("Friends").Preload("Roles").First(&user, "id = ?", issuer).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"data":    user,
		"success": false,
	})
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
		Expires:  time.Now(),
		MaxAge:   -1,
		HttpOnly: config.APP.AuthCookie.HttpOnly,
		Path:     config.APP.AuthCookie.Path,
		Secure:   config.APP.AuthCookie.Secure,
	}
	http.SetCookie(w, cookie)
	w.Write([]byte("Successfully logged out"))
}
