package models

import "time"

type User struct {
	ID           string    `json:"id" gorm:"primaryKey"`
	DisplayName  string    `json:"displayName" gorm:"unique"`
	AvatarUrl    string    `json:"avatarUrl"`
	ProfileUrl   string    `json:"profileUrl"`
	Friends      []*User   `json:"friends,omitempty" gorm:"many2many:user_user"`
	Games        []Game    `json:"games,omitempty" gorm:"many2many:user_role"`
	CreatedAt    time.Time `json:"-"`
	LastLoggedIn time.Time `json:"-"`
}
