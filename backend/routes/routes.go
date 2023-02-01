package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/controllers"
	"github.com/skryvvara/canwecoop/middleware"
)

func RegisterRoutes(r *chi.Mux) {
	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Get("/login", controllers.GetLogin)

			r.Group(func(r chi.Router) {
				r.Use(middleware.WithAuth)
				r.Get("/", controllers.GetAuth)
				r.Delete("/", controllers.DeleteAuth)
			})
		})
	})
}
