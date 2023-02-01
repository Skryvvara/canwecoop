package config

import (
	"log"
	"os"
	"path"

	"github.com/BurntSushi/toml"
	"github.com/caarlos0/env/v6"
	"github.com/creasty/defaults"
)

type ServerConfig struct {
	Port       int    `toml:"port" env:"SERVER_PORT" default:"8080"`
	TimeZone   string `toml:"timezone" env:"SERVER_TIMEZONE" default:"Europe/Berlin"`
	ConfigPath string `env:"SERVER_CONFIG_PATH" default:"/app/config.toml"`
}

type LogConfig struct {
	LogFile    string `toml:"log_file" env:"LOG_LOG_FILE" default:"log/app.log"`
	MaxSize    int    `toml:"max_size" env:"LOG_MAX_SIZE" default:"5"`
	MaxBackups int    `toml:"max_backups" env:"LOG_MAX_BACKUPS" default:"3"`
	MaxAge     int    `toml:"max_age" env:"LOG_MAX_AGE" default:"28"`
	Color      bool   `toml:"color" env:"LOG_COLOR" default:"false"`
}

type Config struct {
	Server ServerConfig `toml:"server"`
	Log    LogConfig    `toml:"log"`
}

var App Config

func getEnvValue(key, fallback string) string {
	value := os.Getenv(key)

	if len(value) > 0 {
		return value
	}
	return fallback
}

func Initialize() {
	log.Println("Loading configuration...")
	defer log.Println("Successfully configured application!")

	configPath := path.Clean(getEnvValue("SERVER_CONFIG_PATH", path.Join("app", "config.toml")))
	if _, err := os.Stat(configPath); err != nil {
		if _, err := os.Stat("config.toml"); err != nil {
			log.Panic(err)
		}
		configPath = "config.toml"
		os.Setenv("SERVER_CONFIG_PATH", configPath)
	}

	bytes, err := os.ReadFile(configPath)
	if err != nil {
		log.Panic(err)
	}

	if _, err := toml.Decode(string(bytes), &App); err != nil {
		log.Panic(err)
	}

	if err := env.Parse(&App); err != nil {
		log.Panic(err)
	}

	defaults.Set(&App)
}
