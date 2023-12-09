package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"gorm.io/gorm"
)

type Database struct {
	db      *gorm.DB
	Mapping map[string]map[int]string
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
	UpdateEstateRecord(requestBody requests.UpdateEstateRequestBody)
	DeleteEstateRecord(id int) bool
	DeleteTransactionRecord()
}
