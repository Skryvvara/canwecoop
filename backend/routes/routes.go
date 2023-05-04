package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/controllers"
	"github.com/skryvvara/canwecoop/middleware"
)

func RegisterRoutes(r *chi.Mux) {
	r.Route("/api", func(r chi.Router) {
		r.Get("/health", controllers.GetHealth)

		r.Route("/auth", func(r chi.Router) {
			r.Get("/login", controllers.GetLogin)

			r.Group(func(r chi.Router) {
				r.Use(middleware.WithAuth)
				r.Get("/", controllers.GetAuth)
				r.Delete("/", controllers.DeleteAuth)
			})
		})

		r.Route("/games", func(r chi.Router) {
			r.Get("/", controllers.GetAllGames)
			r.Get("/{id}", controllers.GetGameById)
			r.Get("/bad-games", controllers.GetAllBadGames)
		})

		r.Route("/sync", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(middleware.WithAuth)
				r.With(middleware.WithRole(config.APP.Steam.SyncRole)).Post("/", controllers.StartSync)
			})
		})

		r.Route("/friends", func(r chi.Router) {
			r.Use(middleware.WithAuth)
			r.Get("/", controllers.GetFriends)
			r.Post("/", controllers.UpdateFriends)
		})
	})
}
