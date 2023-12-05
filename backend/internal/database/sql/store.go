package sql

import "gorm.io/gorm"

type Database struct {
	db *gorm.DB
}

type DbInterface interface {
	Connect() *Database
	//DbRecordInterface
}

type DbRecordInterface interface {
	GetRecord()
	UpdateRecord()
	DeleteRecord()
}
