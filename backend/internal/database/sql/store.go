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
	DbEstateInterface
	DbTransactionInterface
	DbRecordInterface
}

type DbEstateInterface interface {
	GetEstateRecords() []responses.GetEstateRecordResult
	CreateEstateRecord(requestBody requests.CreateEstateRequestBody)
	UpdateEstateRecord(requestBody requests.UpdateEstateRequestBody)
	DeleteEstateRecord(id int)
}

type DbTransactionInterface interface {
	GetTransactionRecords() []responses.GetTransactionRecordResult
	CreateTransactionRecord(requestBody requests.CreateTransactionBody)
}

type DbRecordInterface interface {
	GetProfitableRecord(body requests.ProfitableRecordRequestBody) []responses.GetProfitableRecordResult
	GetAgentRecord(body requests.AgentRecordRequestBody) []responses.GetAgentRecordResult
	GetDynamicsRecord() []responses.GetDynamicsRecordResult
	GetAverageRecord() []responses.GetAverageRecordResult
	GetRecordCount()
	GetTopAgentsRecord() []responses.GetTopAgentsRecordResult
}
