package model

type DealType struct {
	DealTypeID int    `gorm:"column:deal_type_id;primary_key;auto_increment"`
	Name       string `gorm:"column:deal_type_name;type:varchar"`
}
