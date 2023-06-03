package db

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

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
		config.APP.DB.Host,
		config.APP.DB.Username,
		config.APP.DB.Password,
		config.APP.DB.Name,
		config.APP.DB.Port,
		config.APP.DB.SSLMode,
		config.APP.Server.TimeZone,
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
		config.APP.Steam.SyncRole,
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

type Pagination struct {
	Page            int `json:"page"`
	Size            int `json:"size"`
	DefaultPageSize int
	MaxPageSize     int
	MinPageSize     int
}

func GetPaginationFromRequestQuery(r *http.Request, defaultPageSize, maxPageSize, minPageSize int) Pagination {
	query := r.URL.Query()

	page, err := strconv.Atoi(query.Get("page"))
	if err != nil || page == 0 {
		page = 1
	}
	size, err := strconv.Atoi(query.Get("size"))
	if err != nil || size == 0 {
		size = defaultPageSize
	} else if size > maxPageSize && maxPageSize != 0 {
		size = maxPageSize
	} else if size < minPageSize && minPageSize != 0 {
		size = minPageSize
	}

	pagination := Pagination{
		Page:            page,
		Size:            size,
		DefaultPageSize: defaultPageSize,
		MaxPageSize:     maxPageSize,
		MinPageSize:     minPageSize,
	}

	return pagination
}

func Paginate(pagination Pagination) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		page := pagination.Page
		pageSize := pagination.Size

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}
