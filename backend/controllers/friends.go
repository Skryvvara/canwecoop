package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
	"github.com/skryvvara/canwecoop/middleware"
	"github.com/skryvvara/canwecoop/utils"
)

type FriendsResult struct {
	Friends  []models.User      `json:"friends"`
	MetaData PaginationMetaData `json:"meta"`
}

// GetFriends returns all friends matching the given filters. Filters can be applied using query parameters in the URL.
// Supported filters include:
// - name: a string used to filter friends by displayName
//
// It handles any errors that occur during the database query by logging them and returning an HTTP 500 error response
func GetFriends(w http.ResponseWriter, r *http.Request) {
	user, err := middleware.GetUserFromContext(r)
	if err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	var result FriendsResult
	stmt := db.ORM.Model(&models.User{})
	query := r.URL.Query()

	for key, value := range query {
		queryValue := value[len(value)-1]
		switch key {
		case "name":
			if len(queryValue) > 0 {
				stmt.Where("Lower(display_name) LIKE lower(?)", "%"+queryValue+"%")
			}
		}
	}

	pagination := db.GetPaginationFromRequestQuery(r, 12, 84, 8)
	if err := stmt.
		Table("users").
		Joins("JOIN user_user ON users.id = user_user.friend_id").
		Where("user_user.user_id = ?", user.ID).
		Group("users.id").
		Where("id != ?", user.ID).
		Order("display_name ASC").
		Count(&result.MetaData.Total).
		Scopes(db.Paginate(pagination)).
		Find(&result.Friends).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(&result)
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
