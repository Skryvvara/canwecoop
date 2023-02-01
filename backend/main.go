package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/logger"
	"github.com/skryvvara/canwecoop/middleware"
)

func printStartupMessage() {
	banner := "--------------------| Starting Canwecoop |--------------------"

	log.Println(banner)
	defer log.Println(banner)

	log.Printf("| Port: %d", config.App.Server.Port)
	log.Printf("| TimeZone: %s", config.App.Server.TimeZone)
	log.Printf("| ConfigPath: %s", config.App.Server.ConfigPath)
	//log.Printf("| Sync Timing: every %d Minutes", config.App.Steam.SyncInterval/60)
}

func main() {
	config.Initialize()
	logger.Initialize()

	r := chi.NewRouter()
	r.Use(middleware.WithLogger)

	printStartupMessage()
	log.Fatal(http.ListenAndServe(":3000", r))
}