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
	Price           float64 `json:"Price"`
}

type CreateTransactionBody struct {
	Price       float64 `json:"Price"`
	DealType    int     `json:"DealType"`
	RealEstates int     `json:"RealEstates"`
	Agent       int     `json:"Agent"`
	Client      int     `json:"Client"`
}

type DeleteEstateRequestBody struct {
	ID int `json:"id"`
}

type UpdateEstateRequestBody struct {
	ID              int     `json:"ID"`
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
	Price           float64 `json:"Price"`
}
