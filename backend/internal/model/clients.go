package model

import "gorm.io/gorm"

type Clients struct {
	gorm.Model
	ClientID   int    `gorm:"primary key; client_id"`
	FirstName  string `gorm:"first_name"`
	Patronymic string `gorm:"patronymic"`
	LastName   string `gorm:"last_name"`
}
