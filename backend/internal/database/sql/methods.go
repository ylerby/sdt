package sql

import (
	"backend/api/requests"
	"backend/api/responses"
	"backend/internal/model"
	"fmt"
	"time"
)

func (d *Database) CreateEstateRecord(requestBody requests.CreateEstateRequestBody) {
	currentRecordModel := model.RealEstate{
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

	d.db.Create(&currentRecordModel)
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

func (d *Database) DeleteEstateRecord(street, houseNumber string, apartmentNumber int) {
	var deletedValue model.RealEstate
	//todo: сделать проверку на существование элемента !
	d.db.Raw(fmt.Sprintf(`SELECT * FROM real_estates `+
		` LEFT JOIN deal_types ON real_estates.deal_type_id = deal_types.deal_type_id`+
		` LEFT JOIN accommodation_types ON real_estates.accommodation_type_id = accommodation_types.accommodation_type_id`+
		` WHERE real_estates.street = '%s' AND real_estates.house_number = '%s' `+
		` AND real_estates.apartment_number = %d`+
		` LIMIT 1`, street, houseNumber, apartmentNumber)).Scan(&deletedValue)
	d.db.Delete(&deletedValue)
}

func (d *Database) UpdateRecord() {

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
