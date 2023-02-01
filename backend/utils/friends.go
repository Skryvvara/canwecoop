package utils

import (
	"errors"
	"log"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
	"gorm.io/gorm"
)

func UpdateFriendList(user models.User) error {
	friends, err := config.SteamApiClient.GetFriendsList(user.ID)
	if err != nil {
		return err
	}

	for _, v := range friends {
		var friend models.User
		if err := db.ORM.First(&friend, "id = ?", v.UserID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				continue
			}

			log.Println(err)
			continue
		}

		if err := db.ORM.Model(&user).Association("Friends").Append(&friend); err != nil {
			log.Println(err)
			continue
		}
	}

	if err := db.ORM.First(&user, "id = ?", user.ID).Error; err != nil {
		return err
	}

	for _, friend := range user.Friends {
		for _, v := range friends {
			if friend.ID == v.UserID {
				if err := db.ORM.Model(&user).Association("Friends").Delete(&friend); err != nil {
					log.Println(err)
				}
				break
			}
		}
	}

	return nil
}
