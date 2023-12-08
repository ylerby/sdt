package requests

type CreateEstateRequestBody struct {
	AccommodationTypeId int     `json:"accommodation_type_id"`
	DealTypeId          int     `json:"deal_type_id"`
	Floor               int     `json:"floor"`
	FloorsCount         int     `json:"floors_count"`
	RoomsCount          int     `json:"rooms_count"`
	TotalMeters         float64 `json:"total_meters"`
	District            string  `json:"district"`
	Street              string  `json:"street"`
	HouseNumber         string  `json:"house_number"`
	ApartmentNumber     int     `json:"apartment_number"`
	Metro               string  `json:"metro"`
}

type CreateTransactionBody struct {
	Price       float64 `json:"price"`
	DealTypeId  int     `json:"deal_type_id"`
	RealEstates int     `json:"real_estates"`
	Agents      int     `json:"agents"`
	Clients     int     `json:"clients"`
}
