package model

import (
	"gorm.io/gorm"
	"time"
)

type Transactions struct {
	gorm.Model
	TransactionID   int       `gorm:"primary key"`
	Price           float64   `gorm:"price"`
	TransactionDate time.Time `gorm:"transaction_date"`
	DealTypeID      int       `gorm:"foreignKey:DealTypeID"`
	RealEstates     int       `gorm:"foreignKey:RealEstateID"`
	Agents          int       `gorm:"foreignKey:AgentID"`
	Clients         int       `gorm:"foreignKey:ClientID"`
}

/*
real_estate_id  |integer  |                        |foreign key|
agent_id        |integer  |                        |foreign key|
client_id       |integer  |                        |foreign key|
transaction_id  |integer  |                        |primary key|
price           |numeric  |                        |           |
transaction_date|date     |                        |           |
deal_type_id    |integer  |                        |           |
*/

/*
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
*/
