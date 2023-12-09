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
		/// fixme : РЕШИТЬ ВОПРОС С ID
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

func (d *Database) DeleteEstateRecord(street, houseNumber string, apartmentNumber int) bool {
	var deletedValue model.RealEstate
	//todo: сделать проверку на существование элемента !
	d.db.Raw(fmt.Sprintf(`SELECT * FROM real_estates `+
		` LEFT JOIN deal_types ON real_estates.deal_type_id = deal_types.deal_type_id`+
		` LEFT JOIN accommodation_types ON real_estates.accommodation_type_id = accommodation_types.accommodation_type_id`+
		` WHERE real_estates.street = '%s' AND real_estates.house_number = '%s' `+
		` AND real_estates.apartment_number = %d`+
		` LIMIT 1`, street, houseNumber, apartmentNumber)).Scan(&deletedValue)

	d.db.Delete(&deletedValue)
	return true
}

//todo: решить, отправляем ли цену

func (d *Database) UpdateRecord(requestBody requests.UpdateEstateRequestBody) {
	d.db.Raw(fmt.Sprintf("UPDATE real_estates"+
		"SET "+
		"deal_type_id = '%d'"+
		"accommodation_type_id = '%d'"+
		"floor = '%d'"+
		"floors_count = '%d'"+
		"rooms_count = '%d'"+
		"total_meters = '%f'"+
		"district = '%s'"+
		"street = '%s'"+
		"house_number = '%s'"+
		"apartment_number = '%d'"+
		"metro = '%s'"+
		"WHERE id = '%d'",
		requestBody.DealType, requestBody.Accommodation, requestBody.Floor,
		requestBody.FloorsCount, requestBody.RoomsCount, requestBody.TotalMeters,
		requestBody.District, requestBody.Street, requestBody.HouseNumber,
		requestBody.ApartmentNumber, requestBody.Metro, requestBody.ID,
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
