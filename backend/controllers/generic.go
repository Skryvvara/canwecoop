package controllers

import (
	"net/http"
)

func OptionsHandler(methods string) http.HandlerFunc {
	allowedMethods := "OPTIONS, " + methods

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Allow", allowedMethods)
		w.WriteHeader(http.StatusNoContent)
	}
}
