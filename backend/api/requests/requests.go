package requests

type CreateEstateRequestBody struct {
	Accommodation   int     `json:"Accommodation"`
	DealType        int     `json:"DealType"`
	Floor           int     `json:"Floor"`
	FloorsCount     int     `json:"FloorsCount"`
	RoomsCount      int     `json:"RoomsCount"`
	TotalMeters     float64 `json:"TotalMeters"`
	District        string  `json:"District"`
	Street          string  `json:"Street"`
	HouseNumber     string  `json:"HouseNumber"`
	ApartmentNumber int     `json:"ApartmentNumber"`
	Metro           string  `json:"Metro"`
}

type CreateTransactionBody struct {
	Price       float64 `json:"Price"`
	DealType    int     `json:"DealTypeId"`
	RealEstates int     `json:"RealEstates"`
	Agents      int     `json:"Agents"`
	Clients     int     `json:"Clients"`
}

type DeleteEstateRequestBody struct {
	Street          string `json:"Street"`
	HouseNumber     string `json:"HouseNumber"`
	ApartmentNumber int    `json:"ApartmentNumber"`
}

type UpdateEstateRequestBody struct {
	Accommodation   int 		`json:"Accommodation"`
	DealType        int 		`json:"DealType"`
	Floor           int         `json:"Floor"`
	FloorsCount     int         `json:"FloorsCount"`
	RoomsCount      int         `json:"RoomsCount"`
	TotalMeters     float64     `json:"TotalMeters"`
	District        string      `json:"District"`
	Street          string      `json:"Street"`
	HouseNumber     string      `json:"HouseNumber"`
	ApartmentNumber int         `json:"ApartmentNumber"`
	Metro           string      `json:"Metro"`
}