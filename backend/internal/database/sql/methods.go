package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"backend/internal/model"
	"fmt"
	"time"
)

func (d *Database) CreateEstateRecord(requestBody requests.CreateEstateRequestBody) {
	currentEstateModel := model.RealEstate{
		RealEstateID:    len(d.GetAllRecords()) + 1,
		Accommodation:   requestBody.Accommodation,
		DealType:        requestBody.DealType,
		Floor:           requestBody.Floor,
		FloorsCount:     requestBody.FloorsCount,
		RoomsCount:      requestBody.RoomsCount,
		TotalMeters:     requestBody.TotalMeters,
		District:        requestBody.District,
		Street:          requestBody.Street,
		HouseNumber:     requestBody.HouseNumber,
		ApartmentNumber: requestBody.ApartmentNumber,
		Metro:           requestBody.Metro,
		PublicationDate: time.Now(),
	}

	d.db.Create(&currentEstateModel)

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

func (d *Database) DeleteEstateRecord(id int) bool {
	//todo: сделать проверку на существование элемента

	d.db.Exec(fmt.Sprintf("WITH deleted_transactions AS "+
		" (DELETE FROM transactions    WHERE real_estate_id = %d    RETURNING * ) DELETE FROM real_estates WHERE id = %d", id, id))
	return true
}

func (d *Database) UpdateEstateRecord(requestBody requests.UpdateEstateRequestBody) {
	d.db.Exec(fmt.Sprintf(`UPDATE real_estates`+
		" SET "+
		" deal_type_id = %d,"+
		" accommodation_type_id = %d,"+
		" floor = %d,"+
		" floors_count = %d,"+
		" rooms_count = %d,"+
		" total_meters = %f,"+
		" district = '%s',"+
		" street = '%s',"+
		" house_number = '%s',"+
		" apartment_number = %d,"+
		" metro = '%s',"+
		" price = %f"+
		" WHERE id = %d",
		requestBody.DealType, requestBody.Accommodation, requestBody.Floor,
		requestBody.FloorsCount, requestBody.RoomsCount, requestBody.TotalMeters,
		requestBody.District, requestBody.Street, requestBody.HouseNumber,
		requestBody.ApartmentNumber, requestBody.Metro, requestBody.Price,
		requestBody.ID,
	))
}

func (d *Database) GetRecord() {

}

func (d *Database) GetAllRecords() []responses.GetAllRecordResult {
	var result []responses.GetAllRecordResult
	d.db.Raw(`SELECT * FROM real_estates ` +
		`LEFT JOIN deal_types ON real_estates.deal_type_id = deal_types.deal_type_id ` +
		`LEFT JOIN accommodation_types ON ` +
		`real_estates.accommodation_type_id = accommodation_types.accommodation_type_id`).Scan(&result)
	return result
}

func (d *Database) DeleteTransactionRecord() {

}
