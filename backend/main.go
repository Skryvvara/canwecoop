package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db"
	"github.com/skryvvara/canwecoop/logger"
	"github.com/skryvvara/canwecoop/middleware"
	"github.com/skryvvara/canwecoop/routes"
	"github.com/skryvvara/canwecoop/services"
	"github.com/skryvvara/canwecoop/utils"
)

func main() {
	config.Initialize()
	logger.Initialize()
	db.Connect()
	db.Migrate()

	r := chi.NewRouter()
	r.Use(middleware.WithLogger)

	routes.RegisterRoutes(r)
	services.RegisterServices()

	utils.PrintStartupMessage()
	log.Fatal(http.ListenAndServe(":3000", r))
}
