package middleware

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db/models"
)

type contextKey int

const (
	UserContextKey contextKey = iota
)

func GetValueFromContext[T any](r *http.Request, contextKey contextKey) (T, error) {
	var empty T
	value := r.Context().Value(contextKey)
	if value == nil {
		return empty, fmt.Errorf("value not found within given context")
	}
	return value.(T), nil
}

func GetUserFromContext(r *http.Request) (models.User, error) {
	return GetValueFromContext[models.User](r, UserContextKey)
}

func RegisterMiddleware(r *chi.Mux) {
	r.Use(WithLogger)
	if config.APP.Cors.Enabled {
		r.Use(WithCors)
	}
}
