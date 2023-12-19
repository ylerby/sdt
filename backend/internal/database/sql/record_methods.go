package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"fmt"
)

func (d *Database) GetProfitableRecord(requestBody requests.ProfitableRecordRequestBody) []responses.GetProfitableRecordResult {
	var result []responses.GetProfitableRecordResult
	d.db.Raw(fmt.Sprintf("SELECT t.id, t.price AS transaction_price, t.transaction_date, "+
		"CONCAT(c.first_name, ' ', c.patronymic, ' ', c.last_name) AS client_full_name, "+
		"CONCAT(a.first_name, ' ', a.patronymic, ' ', a.last_name) AS agent_full_name, "+
		"dt.deal_type_name, rt.publication_date, "+
		"rt.floor, rt.floors_count, rt.rooms_count, rt.total_meters, rt.district, "+
		"rt.street, rt.house_number, rt.apartment_number, rt.metro "+
		"FROM transactions t JOIN deal_types dt ON t.deal_type_id = dt.deal_type_id "+
		"JOIN real_estates rt ON t.real_estate_id = rt.id JOIN clients c ON t.client_id = c.client_id "+
		"JOIN agents a ON t.agent_id = a.agent_id WHERE t.transaction_date BETWEEN '%s' AND '%s' "+
		"AND dt.deal_type_name = '%s' ORDER BY t.price %s LIMIT 1;",
		requestBody.FirstDate, requestBody.SecondDate, requestBody.DealTypeName, requestBody.SortField)).Scan(&result)
	return result
}

func (d *Database) GetAgentRecord(requestBody requests.AgentRecordRequestBody) []responses.GetAgentRecordResult {
	var result []responses.GetAgentRecordResult
	d.db.Raw(fmt.Sprintf("SELECT "+
		"CONCAT(a.first_name, ' ', a.patronymic, ' ', a.last_name) AS agent_full_name, "+
		"COUNT(t.id) AS number_of_transactions, AVG(t.price) AS average_price "+
		"FROM transactions t JOIN agents a ON t.agent_id = a.agent_id "+
		"WHERE t.transaction_date BETWEEN '%s' AND '%s' GROUP BY "+
		"agent_full_name;",
		requestBody.FirstDate, requestBody.SecondDate)).Scan(&result)
	return result
}

func (d *Database) GetDynamicsRecord() []responses.GetDynamicsRecordResult {
	var result []responses.GetDynamicsRecordResult
	d.db.Raw("SELECT " +
		"transaction_date, " +
		"COUNT(id) AS number_of_transactions " +
		"FROM transactions GROUP BY transaction_date ORDER BY transaction_date;").Scan(&result)
	return result
}

func (d *Database) GetAverageRecord() []responses.GetAverageRecordResult {
	var result []responses.GetAverageRecordResult
	d.db.Raw("SELECT district, AVG(price / total_meters) AS avg_price_per_sqm " +
		"FROM real_estates GROUP BY district ORDER BY avg_price_per_sqm DESC;").Scan(&result)
	return result
}

func (d *Database) GetRecordCount() {}

func (d *Database) GetTopAgents() {}
