package sql

import "gorm.io/gorm"

type Database struct {
	db *gorm.DB
}

type DbInterface interface {
	Connect() error
	DbRecordInterface
}

type DbRecordInterface interface {
	GetRecord()
	CreateRecord()
	UpdateRecord()
	DeleteRecord()
}
