package responses

import "backend/internal/model"

type GetAllRecordResult struct {
	model.RealEstate
	model.DealType
	model.AccommodationType
}
