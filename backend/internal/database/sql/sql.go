package sql

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

func New() DbInterface {
	return &Database{}
}

// Connect - подключение к базе данных
func (d *Database) Connect() *Database {

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("host"),
		os.Getenv("user"),
		os.Getenv("password"),
		os.Getenv("name"),
		os.Getenv("port"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil //, fmt.Errorf("ошибка при подключении к БД PostgreSQL %s", err)
	}

	return &Database{db: db}
}
