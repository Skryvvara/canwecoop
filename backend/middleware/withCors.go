package middleware

import (
	"net/http"

	"github.com/skryvvara/canwecoop/config"
)

func WithCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", config.APP.Cors.AllowedOrigins)
		w.Header().Set("Access-Control-Allow-Headers", config.APP.Cors.AllowedHeaders)
		next.ServeHTTP(w, r)
	})
}
