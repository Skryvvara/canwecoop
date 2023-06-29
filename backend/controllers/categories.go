package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/db/models"
)

func GetCategories(w http.ResponseWriter, r *http.Request) {
	var categories []models.Category

	if err := db.ORM.Order("relevance DESC, description").Find(&categories).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(&categories)
}

func UpdateCategory(w http.ResponseWriter, r *http.Request) {
	var category models.Category

	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if err := db.ORM.Save(&category).Error; err != nil {
		log.Println(err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
	}

	w.Write([]byte("Category updated successfully"))
}

func DeleteCategory(w http.ResponseWriter, r *http.Request) {

}
