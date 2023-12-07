package model

import "gorm.io/gorm"

type AccommodationType struct {
	gorm.Model
	AccommodationTypeID int    `gorm:"accommodation_type_id;primary key;autoIncrement"`
	Name                string `gorm:"column:accommodation_type_name"`
}
