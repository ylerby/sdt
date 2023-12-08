package model

import (
	"gorm.io/gorm"
	"time"
)

type RealEstate struct {
	gorm.Model
	RealEstateID    int       `gorm:"primary key;column:id;autoIncrement"`
	PublicationDate time.Time `gorm:"publication_date"`
	DealType        int       `gorm:"column:deal_type_id;foreignKey:DealTypeID"`
	Accommodation   int       `gorm:"column:accommodation_type_id;foreignKey:AccommodationTypeID"`
	Price           float64   `gorm:"price"`
	Floor           int       `gorm:"floor"`
	FloorsCount     int       `gorm:"floors_count"`
	RoomsCount      int       `gorm:"rooms_count"`
	TotalMeters     float64   `gorm:"total_meters"`
	District        string    `gorm:"district"`
	Street          string    `gorm:"street"`
	HouseNumber     string    `gorm:"house_number"`
	ApartmentNumber int       `gorm:"apartment_number"`
	Metro           string    `gorm:"metro"`
}
