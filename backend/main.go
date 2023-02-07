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
)

func printStartupMessage() {
	banner := "--------------------| Starting Canwecoop |--------------------"

	log.Println(banner)
	defer log.Println(banner)

	log.Printf("| Port: %d", config.APP.Server.Port)
	log.Printf("| TimeZone: %s", config.APP.Server.TimeZone)
	log.Printf("| ConfigPath: %s", config.APP.Server.ConfigPath)
	log.Printf("| Sync Timing: every %d Minutes", config.APP.Steam.SyncInterval/60)
}

func main() {
	config.Initialize()
	logger.Initialize()
	db.Connect()
	db.Migrate()

	r := chi.NewRouter()
	r.Use(middleware.WithLogger)

	routes.RegisterRoutes(r)
	services.RegisterServices()

	printStartupMessage()
	log.Fatal(http.ListenAndServe(":3000", r))
}
