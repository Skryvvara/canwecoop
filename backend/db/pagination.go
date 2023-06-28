package db

import (
	"net/http"
	"strconv"

	"gorm.io/gorm"
)

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
