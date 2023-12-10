package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"backend/internal/model"
	"time"
)

func (d *Database) GetTransactionRecords() []responses.GetTransactionRecordsResult {
	var result []responses.GetTransactionRecordsResult
	d.db.Raw("SELECT " +
		"t.price AS transaction_price, t.transaction_date, " +
		"CONCAT(c.first_name, ' ', c.patronymic, ' ', c.last_name) AS client_full_name, " +
		"CONCAT(a.first_name, ' ', a.patronymic, ' ', a.last_name) AS agent_full_name, " +
		"dt.deal_type_name, at2.accommodation_type_name, t.transaction_date " +
		"FROM transactions t " +
		"JOIN deal_types dt ON t.deal_type_id = dt.deal_type_id " +
		"JOIN real_estates rt ON t.real_estate_id = rt.id " +
		"JOIN clients c ON t.client_id = c.client_id " +
		"JOIN agents a ON t.agent_id = a.agent_id " +
		"JOIN accommodation_types at2 on rt.accommodation_type_id = at2.accommodation_type_id").Scan(&result)
	return result
}

func (d *Database) CreateTransactionRecord(requestBody requests.CreateTransactionBody) {
	currentRecordModel := model.Transactions{
		TransactionID:   len(d.GetTransactionRecords()) + 1,
		Price:           requestBody.Price,
		TransactionDate: time.Now(),
		DealTypeID:      requestBody.DealType,
		RealEstates:     requestBody.RealEstates,
		AgentID:         requestBody.Agent,
		ClientID:        requestBody.Client,
	}

	d.db.Create(&currentRecordModel)
}

func (d *Database) UpdateTransactionRecord() {

}

func (d *Database) DeleteTransactionRecord() {

}
