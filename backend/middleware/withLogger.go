package middleware

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/skryvvara/canwecoop/config"
)

var WithLogger func(next http.Handler) http.Handler = middleware.RequestLogger(&middleware.DefaultLogFormatter{
	Logger:  log.Default(),
	NoColor: !config.APP.Log.Color,
})
