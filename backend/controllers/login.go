package controllers

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
	"github.com/skryvvara/canwecoop/utils"
	"github.com/solovev/steam_go"
	"gorm.io/gorm"
)

func GetLogin(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(config.App.Auth.AuthCookieName)
	if err != nil && !errors.Is(err, http.ErrNoCookie) {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	if cookie != nil {
		path := "/?authenticated=true"
		http.Redirect(w, r, path, http.StatusMovedPermanently)
		return
	}

	if ref := r.Referer(); len(ref) > 0 {
		http.SetCookie(w, &http.Cookie{
			Name:     config.App.Auth.OriginCookieName,
			Value:    ref,
			Path:     "/",
			HttpOnly: true,
		})
	}

	opId := steam_go.NewOpenId(r)
	switch opId.Mode() {
	case "":
		http.Redirect(w, r, opId.AuthUrl(), http.StatusMovedPermanently)
	case "cancel":
		w.Write([]byte("Authorization cancelled"))
	default:
		/* THIS CODE IS ONLY REACHED ON SUCCESSFUL AUTHENTICATION */

		steamUser, err := opId.ValidateAndGetUser(config.App.Steam.ApiKey)
		if err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		var user models.User
		if err := db.ORM.First(&user, steamUser.SteamId).Error; err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}

			user = models.User{
				ID:           steamUser.SteamId,
				DisplayName:  steamUser.PersonaName,
				AvatarUrl:    steamUser.AvatarFull,
				ProfileUrl:   steamUser.ProfileUrl,
				Friends:      []*models.User{},
				CreatedAt:    time.Now(),
				LastLoggedIn: time.Now(),
			}

			if err := db.ORM.Create(&user).Error; err != nil {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
		}

		// User when properties have changed
		if steamUser.AvatarFull != user.AvatarUrl || steamUser.PersonaName != user.DisplayName || steamUser.ProfileUrl != user.ProfileUrl {
			values := models.User{AvatarUrl: steamUser.AvatarFull, DisplayName: steamUser.PersonaName, ProfileUrl: steamUser.ProfileUrl}
			if err := db.ORM.Model(&user).Updates(values).Error; err != nil {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
		}

		// Update last Login date-time
		if err := db.ORM.Model(&user).Updates(models.User{LastLoggedIn: time.Now()}).Error; err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		// Update friend list
		if err := utils.UpdateFriendList(user); err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		destination := "/"
		originCookie, err := r.Cookie(config.App.Auth.OriginCookieName)
		if err != nil && !errors.Is(err, http.ErrNoCookie) {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}
		if originCookie != nil {
			destination = originCookie.Value
			http.SetCookie(w, &http.Cookie{
				Name:     config.App.Auth.OriginCookieName,
				Path:     "/",
				MaxAge:   -1,
				HttpOnly: true,
			})
		}

		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		expires := time.Now().Add(time.Minute * 5)
		authCookie := &http.Cookie{
			Name:     config.App.Auth.AuthCookieName,
			Value:    token,
			Expires:  expires,
			MaxAge:   86400,
			HttpOnly: true,
			Path:     "/",
			Secure:   false,
		}
		http.SetCookie(w, authCookie)
		http.Redirect(w, r, destination, http.StatusMovedPermanently)
	}
}
