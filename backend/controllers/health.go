package controllers

import (
	"encoding/json"
	"net/http"
)

func GetHealth(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"status": "UP",
	}

	json.NewEncoder(w).Encode(data)
}
