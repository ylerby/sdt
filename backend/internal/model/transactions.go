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
