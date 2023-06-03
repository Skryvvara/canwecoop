package models

import (
	"gorm.io/gorm"
)

type Game struct {
	ID                 string     `json:"id" gorm:"primaryKey"`
	Name               string     `json:"name"`
	IsFree             bool       `json:"isFree"`
	ShortDescription   string     `json:"shortDescription"`
	HeaderImageUrl     string     `json:"headerImageUrl"`
	Website            string     `json:"website"`
	Categories         []Category `json:"categories" gorm:"many2many:game_category"`
	Genres             []Genre    `json:"genres" gorm:"many2many:game_genre"`
	BackgroundImageUrl string     `json:"backgroundImageUrl"`
	StoreUrl           string     `json:"storeUrl"`
	IsHidden           bool       `json:"isHidden"`
}

type Category struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Description string `json:"description"`
	Relevance   int    `json:"relevance"`
}

func (category *Category) BeforeCreate(tx *gorm.DB) (err error) {
	if category.Description == "Co-op" {
		category.Relevance = 100
	} else {
		category.Relevance = 10
	}
	return
}

type Genre struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Description string `json:"description"`
	Relevance   int    `json:"relevance"`
}

func (genre *Genre) BeforeCreate(tx *gorm.DB) (err error) {
	genre.Relevance = 10
	return
}

type BadGame struct {
	ID string `gorm:"primaryKey"`
}
