package middleware

import (
	"net/http"

	"github.com/go-chi/cors"
	"github.com/skryvvara/canwecoop/config"
)

func WithCors() func(next http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   config.APP.Cors.AllowedOrigins,
		AllowedMethods:   config.APP.Cors.AllowedMethods,
		AllowedHeaders:   config.APP.Cors.AllowedHeaders,
		ExposedHeaders:   config.APP.Cors.ExposedHeaders,
		AllowCredentials: config.APP.Cors.AllowCredentials,
	})
}
