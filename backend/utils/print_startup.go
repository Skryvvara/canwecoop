package utils

import (
	"log"

	"github.com/skryvvara/canwecoop/config"
)

func PrintStartupMessage() {
	banner := "--------------------| Starting Canwecoop |--------------------"

	log.Println(banner)
	defer log.Println(banner)

	log.Printf("| Port: %d", config.APP.Server.Port)
	log.Printf("| TimeZone: %s", config.APP.Server.TimeZone)
	log.Printf("| ConfigPath: %s", config.APP.Server.ConfigPath)
	log.Printf("| Sync Timing: every %d Minutes", config.APP.Steam.SyncInterval/60)
}
