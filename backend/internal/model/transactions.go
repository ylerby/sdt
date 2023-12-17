package model

import (
	"gorm.io/gorm"
	"time"
)

type Transactions struct {
	gorm.Model
	TransactionID   int       `gorm:"primary key;column:id;autoIncrement"`
	Price           float64   `gorm:"column:price"`
	TransactionDate time.Time `gorm:"column:transaction_date;transaction_date"`
	DealTypeID      int       `gorm:"column:deal_type_id;foreignKey:DealTypeID"`
	RealEstates     int       `gorm:"column:real_estate_id;foreignKey:RealEstateID"`
	AgentID         int       `gorm:"column:agent_id;foreignKey:AgentID"`
	ClientID        int       `gorm:"column:client_id;foreignKey:ClientID"`
}
