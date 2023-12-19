package responses

import (
	"backend/internal/model"
	"gorm.io/gorm"
	"time"
)

type GetEstateRecordsResult struct {
	model.RealEstate
	model.DealType
	model.AccommodationType
}

type GetTransactionRecordsResult struct {
	gorm.Model
	TransactionId         int       `gorm:"column:id"`
	TransactionPrice      float64   `gorm:"column:transaction_price"`
	TransactionDate       time.Time `gorm:"column:transaction_date;transaction_date"`
	ClientFullName        string    `gorm:"column:client_full_name"`
	AgentFullName         string    `gorm:"column:agent_full_name"`
	DealTypeName          string    `gorm:"column:deal_type_name;type:varchar"`
	AccommodationTypeName string    `gorm:"column:accommodation_type_name"`
}

type ConvertTransactionRecordsResult struct {
	TransactionId         int
	TransactionPrice      float64
	TransactionDate       time.Time
	ClientFullName        string
	AgentFullName         string
	DealTypeName          string
	AccommodationTypeName string
}

type GetMostProfitableSaleResult struct {
	TransactionId    int       `gorm:"column:id"`
	TransactionPrice float64   `gorm:"column:transaction_price"`
	TransactionDate  time.Time `gorm:"column:transaction_date"`
	ClientFullName   string    `gorm:"column:client_full_name"`
	AgentFullName    string    `gorm:"column:agent_full_name"`
	DealTypeName     string    `gorm:"column:deal_type_name"`
	PublicationDate  time.Time `gorm:"column:publication_date"`
	Floor            int       `gorm:"column:floor"`
	FloorsCount      int       `gorm:"column:floors_count"`
	RoomsCount       int       `gorm:"column:rooms_count"`
	TotalMeters      float64   `gorm:"column:total_meters"`
	District         string    `gorm:"column:district"`
	Street           string    `gorm:"column:street"`
	HouseNumber      string    `gorm:"column:house_number"`
	ApartmentNumber  int       `gorm:"column:apartment_number"`
	Metro            string    `gorm:"column:metro"`
}
