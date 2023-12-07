package sql

import (
	"backend/internal/model"
	"log"
)

func (d *Database) CreateRecord() {

}

func (d *Database) DeleteRecord() {

}

func (d *Database) UpdateRecord() {

}

func (d *Database) GetRecord() {
	var acc []model.RealEstate
	d.db.Find(&acc)
	log.Println("res = ", acc)
}
