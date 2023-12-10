package sql

import (
	"backend/api/requests"
	"backend/internal/model"
	"time"
)

func (d *Database) GetTransactionRecords() {

}

func (d *Database) CreateTransactionRecord(requestBody requests.CreateTransactionBody) {
	currentRecordModel := model.Transactions{
		Price:           requestBody.Price,
		TransactionDate: time.Now(),
		DealTypeID:      requestBody.DealType,
		RealEstates:     requestBody.RealEstates,
		Agents:          requestBody.Agents,
		Clients:         requestBody.Clients,
	}

	d.db.Create(&currentRecordModel)
}

func (d *Database) UpdateTransactionRecord() {

}

func (d *Database) DeleteTransactionRecord() {

}
