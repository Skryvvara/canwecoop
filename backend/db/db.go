package db

import (
	"errors"
	"fmt"
	"log"

	"github.com/skryvvara/canwecoop/config"
	"github.com/skryvvara/canwecoop/db/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var ORM *gorm.DB

func Connect() {
	var err error

	cfg := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		config.App.DB.Host,
		config.App.DB.Username,
		config.App.DB.Password,
		config.App.DB.Name,
		config.App.DB.Port,
		config.App.DB.SSLMode,
		config.App.Server.TimeZone,
	)

	ORM, err = gorm.Open(postgres.Open(dsn), cfg)
	ORM.Session(&gorm.Session{FullSaveAssociations: true})

	if err != nil {
		log.Panic(err)
	}

	log.Println("Successfully connected to database!")
}

func Migrate() {
	log.Println("Running migrations...")

	if err := ORM.Migrator().AutoMigrate(
		&models.User{},
		&models.Role{},
		&models.Category{},
		&models.Genre{},
		&models.Game{},
		&models.BadGame{},
	); err != nil {
		log.Panic(err)
	}

	defaultRoles := []string{
		"start_sync",
		"manage_roles",
		"manage_users",
	}

	for _, v := range defaultRoles {
		role := &models.Role{}
		if err := ORM.First(&role, "name = ?", v).Error; err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				log.Println(err)
				continue
			}
			log.Printf("Role '%s' does not exist, creating Role...\n", v)
			role.Name = v
			if err := ORM.Create(&role).Error; err != nil {
				log.Println(err)
				continue
			}
			log.Printf("Role '%s' created.\n", v)
		}
	}

	log.Println("Successfully completed migrations!")
}
