package main

import (
	"fmt"
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

	middleware.RegisterMiddleware(r)
	routes.RegisterRoutes(r)
	services.RegisterServices()

	utils.PrintStartupMessage()

	address := fmt.Sprintf(":%d", config.APP.Server.Port)
	log.Fatal(http.ListenAndServe(address, r))
}
