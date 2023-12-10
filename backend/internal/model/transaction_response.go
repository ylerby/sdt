package model

import (
	"gorm.io/gorm"
	"time"
)

// TransactionResponse todo: доделать получение полей ID, Price
type TransactionResponse struct {
	gorm.Model
	TransactionID         int       `gorm:"primary key;column:transaction_id;autoIncrement"`
	Price                 float64   `gorm:"column:price"`
	TransactionDate       time.Time `gorm:"column:transaction_date;transaction_date"`
	ClientFullName        string    `gorm:"column:client_full_name"`
	AgentFullName         string    `gorm:"column:agent_full_name"`
	DealTypeName          string    `gorm:"column:deal_type_name"`
	AccommodationTypeName string    `gorm:"column:accommodation_type_name"`
}
