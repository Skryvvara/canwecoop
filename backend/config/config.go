package config

import (
	"log"
	"os"
	"path"
	"time"

	"github.com/BurntSushi/toml"
	"github.com/caarlos0/env/v6"
	"github.com/creasty/defaults"
	"github.com/skryvvara/go-steam"
)

type ServerConfig struct {
	Port       int    `toml:"port" env:"SERVER_PORT" default:"8080"`
	TimeZone   string `toml:"timezone" env:"SERVER_TIMEZONE" default:"Europe/Berlin"`
	ConfigPath string `env:"SERVER_CONFIG_PATH" default:"/app/config.toml"`
}

type SteamConfig struct {
	ApiKey       string        `toml:"api_key" env:"STEAM_API_KEY"`
	SyncInterval time.Duration `toml:"sync_interval_seconds" env:"STEAM_SYNC_INTERVAL_SECONDS" default:"3600"`
	SyncCooldown time.Duration `toml:"sync_cooldown_seconds" env:"STEAM_COOLDOWN_SECONDS" default:"300"`
	SyncRole     string        `toml:"sync_role" env:"STEAM_SYNC_ROLE" default:"sync_role"`
}

type DatabaseConfig struct {
	Host     string `toml:"host" env:"DB_HOST" default:"localhost"`
	Username string `toml:"username" env:"DB_USER" default:"postgres"`
	Password string `toml:"password" env:"DB_PASS"`
	Name     string `toml:"name" env:"DB_NAME" default:"canwecoop"`
	Port     int    `toml:"port" env:"DB_PORT" default:"5432"`
	SSLMode  string `string:"ssl_mode" env:"DB_SSL_MODE" default:"disable"`
}

type AuthConfig struct {
	Secret           string        `toml:"secret" env:"AUTH_SECRET"`
	AuthCookieName   string        `toml:"auth_cookie_name" env:"AUTH_AUTH_COOKIE_NAME" default:"session"`
	OriginCookieName string        `toml:"origin_cookie_name" env:"AUTH_ORIGIN_COOKIE_NAME" default:"origin"`
	JWTExpiresAt     time.Duration `toml:"jwt_expires" env:"AUTH_JWT_EXPIRES" default:"86400"`
}

type LogConfig struct {
	LogFile    string `toml:"log_file" env:"LOG_LOG_FILE" default:"log/app.log"`
	MaxSize    int    `toml:"max_size" env:"LOG_MAX_SIZE" default:"5"`
	MaxBackups int    `toml:"max_backups" env:"LOG_MAX_BACKUPS" default:"3"`
	MaxAge     int    `toml:"max_age" env:"LOG_MAX_AGE" default:"28"`
	Color      bool   `toml:"color" env:"LOG_COLOR" default:"false"`
}

type Config struct {
	Server ServerConfig   `toml:"server"`
	Steam  SteamConfig    `toml:"steam"`
	DB     DatabaseConfig `toml:"database"`
	Auth   AuthConfig     `toml:"auth"`
	Log    LogConfig      `toml:"log"`
}

var APP Config
var STEAM_API_CLIENT steam.SteamApiClient

func getEnvValue(key, fallback string) string {
	value := os.Getenv(key)

	if len(value) > 0 {
		return value
	}
	return fallback
}

func Initialize() {
	log.Println("Loading configuration...")

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

	if _, err := toml.Decode(string(bytes), &APP); err != nil {
		log.Panic(err)
	}

	if err := env.Parse(&APP); err != nil {
		log.Panic(err)
	}

	defaults.Set(&APP)
	STEAM_API_CLIENT = steam.NewApiClient(APP.Steam.ApiKey)
	log.Println("Successfully configured application!")
}
