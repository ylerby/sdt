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
	//DealTypeID      DealType   `gorm:"foreignKey:DealTypeID"`
	RealEstates RealEstate `gorm:"foreignKey:RealEstateID"`
	Agents      Agents     `gorm:"foreignKey:AgentID"`
	Clients     Clients    `gorm:"foreignKey:ClientID"`
}
