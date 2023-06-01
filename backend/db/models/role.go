package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role struct {
	RoleID string `json:"id" gorm:"type:text;primaryKey"`
	Name   string `json:"name" gorm:"unique"`
}

func (role *Role) BeforeCreate(tx *gorm.DB) (err error) {
	role.RoleID = uuid.NewString()
	return
}
