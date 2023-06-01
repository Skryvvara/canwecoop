package models

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
	ID        string `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	Relevance int    `json:"relevance"`
}

type Genre struct {
	ID        string `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	Relevance int    `json:"relevance"`
}

type BadGame struct {
	ID string `gorm:"primaryKey"`
}
