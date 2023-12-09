package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"gorm.io/gorm"
)

type Database struct {
	db *gorm.DB
}

type DbInterface interface {
	Connect() error
	DbRecordInterface
}

type DbRecordInterface interface {
	GetRecord()
	GetAllRecords() []responses.GetAllRecordResult
	CreateEstateRecord(requestBody requests.CreateEstateRequestBody)
	CreateTransactionRecord(requestBody requests.CreateTransactionBody)
	UpdateRecord(requestBody requests.UpdateEstateRequestBody)
	DeleteEstateRecord(street, houseNumber string, apartmentNumber int) bool
	DeleteTransactionRecord()
}
