package responses

import (
	"backend/internal/model"
	"gorm.io/gorm"
	"time"
)

type GetEstateRecordResult struct {
	model.RealEstate
	model.DealType
	model.AccommodationType
}

type GetTransactionRecordResult struct {
	gorm.Model
	TransactionId         int       `gorm:"column:id"`
	TransactionPrice      float64   `gorm:"column:transaction_price"`
	TransactionDate       time.Time `gorm:"column:transaction_date;transaction_date"`
	ClientFullName        string    `gorm:"column:client_full_name"`
	AgentFullName         string    `gorm:"column:agent_full_name"`
	DealTypeName          string    `gorm:"column:deal_type_name;type:varchar"`
	AccommodationTypeName string    `gorm:"column:accommodation_type_name"`
}

type ConvertTransactionRecordResult struct {
	TransactionId         int
	TransactionPrice      float64
	TransactionDate       time.Time
	ClientFullName        string
	AgentFullName         string
	DealTypeName          string
	AccommodationTypeName string
}

type GetProfitableRecordResult struct {
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

type GetAgentRecordResult struct {
	AgentFullName     string  `gorm:"column:agent_full_name"`
	TransactionNumber int     `gorm:"column:number_of_transactions"`
	AveragePrice      float64 `gorm:"column:average_price"`
}

type GetDynamicsRecordResult struct {
	NumberOfTransaction int       `gorm:"column:number_of_transactions"`
	TransactionDate     time.Time `gorm:"column:transaction_date"`
}

type GetAverageRecordResult struct {
	AveragePrice float64 `gorm:"column:avg_price_per_sqm"`
	District     string  `gorm:"column:district"`
}

type GetTopAgentsRecordResult struct {
	FullName            string `gorm:"column:agent_full_name"`
	NumberOfTransaction int    `gorm:"column:number_of_transactions"`
}
