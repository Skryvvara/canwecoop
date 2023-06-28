package routes

import (
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/httprate"
	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/controllers"
	"github.com/skryvvara/canwecoop/middleware"
)

func RegisterRoutes(r *chi.Mux) {
	r.Route("/api", func(r chi.Router) {
		r.Get("/health", controllers.GetHealth)

		r.Route("/auth", func(r chi.Router) {
			r.Get("/login", controllers.GetLogin)
			r.Get("/", controllers.GetAuth)

			r.Group(func(r chi.Router) {
				r.Use(middleware.WithAuth)
				r.Delete("/", controllers.DeleteAuth)
			})
		})

		r.Route("/games", func(r chi.Router) {
			r.Get("/", controllers.GetAllGames)
			r.Get("/{id}", controllers.GetGameById)
		})

		r.Get("/game-info", controllers.GetGameInfo)

		r.Route("/bad-games", func(r chi.Router) {
			r.Get("/", controllers.GetAllBadGames)
			r.Group(func(r chi.Router) {
				r.Use(middleware.WithAuth)
				r.With(middleware.WithRole("manage-bad-games")).Post("/", controllers.CreateBadGame)
				r.With(middleware.WithRole("manage-bad-games")).Delete("/{id}", controllers.DeleteBadGameByID)
			})
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
			r.With(httprate.LimitByIP(5, 10*time.Minute)).Post("/", controllers.UpdateFriends)
		})

		r.Route("/mail", func(r chi.Router) {
			r.Post("/", controllers.SendMail)
		})
	})
}
