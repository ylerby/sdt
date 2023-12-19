package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"fmt"
)

func (d *Database) GetMostProfitableSale(requestBody requests.MostProfitableSaleRequestBody) []responses.GetMostProfitableSaleResult {
	var result []responses.GetMostProfitableSaleResult
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

func (d *Database) GetLeastProfitableSale() {}

func (d *Database) GetMostProfitableRental() {}

func (d *Database) GetLeastProfitableRental() {}

func (d *Database) GetRealtorsRecord() {}

func (d *Database) GetDynamics() {}

func (d *Database) GetAveragePrice() {}

func (d *Database) GetRecordCount() {}

func (d *Database) GetTopAgents() {}
