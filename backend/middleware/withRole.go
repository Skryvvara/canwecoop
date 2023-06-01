package middleware

import (
	"log"
	"net/http"
)

func WithRole(roleName string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, err := GetUserFromContext(r)
			if err != nil {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}

			ok := false
			for _, role := range user.Roles {
				if roleName == role.Name || roleName == "admin" {
					ok = true
					break
				}
			}

			if !ok {
				http.Error(w, http.StatusText(http.StatusForbidden), http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
