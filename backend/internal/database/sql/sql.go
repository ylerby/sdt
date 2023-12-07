package sql

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func New() DbInterface {
	return &Database{}
}

// Connect - подключение к базе данных
func (d *Database) Connect() error {
	var err error

	dsn := fmt.Sprintf("host=flora.db.elephantsql.com user=tjydarki password=dY8S4ONKcpB1Ul9p8RrH4smk-yiDmUzH dbname=tjydarki port=5432 sslmode=disable")

	d.db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}
	return nil
}
