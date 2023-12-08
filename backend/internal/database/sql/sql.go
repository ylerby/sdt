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

	dsn := fmt.Sprintf("host=cornelius.db.elephantsql.com  user=tvplkqak password=6eY_RjM2kmekbKsq7bXfOQKO0v1cZO-5  dbname=tvplkqak port=5432 sslmode=disable")

	d.db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}
	return nil
}
