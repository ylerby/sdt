package responses

import "backend/internal/model"

type GetEstateRecordsResult struct {
	model.RealEstate
	model.DealType
	model.AccommodationType
}

type GetTransactionRecordsResult struct {
	model.TransactionResponse
}
