package app

import (
	"backend/internal/database/sql"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
)

type App struct {
	Database sql.DbInterface
	Server   *http.Server
}

// New - создание приложения
func New(port string) *App {
	return &App{
		Server:   &http.Server{Addr: fmt.Sprintf(":%s", port)},
		Database: sql.New(),
	}
}

// StartApp - запуск http-сервера
func (a *App) StartApp() {
	log.Println("запуск приложения")

	err := a.Database.Connect()
	if err != nil {
		log.Fatalf("ошибка при подключении к бд %s", err)
	}

	log.Println("успешное подключение к БД")

	http.HandleFunc("/get/estate", a.GetEstateHandler)
	http.HandleFunc("/create/estate", a.CreateEstateHandler)
	http.HandleFunc("/update/estate", a.UpdateEstateHandler)
	http.HandleFunc("/delete/estate", a.DeleteEstateHandler)

	http.HandleFunc("/get/transaction", a.GetTransactionHandler)
	http.HandleFunc("/create/transaction", a.CreateTransactionHandler)

	http.HandleFunc("/record/profitable", a.ProfitableRecordHandler)
	http.HandleFunc("/record/agent_record", a.AgentRecordHandler)
	http.HandleFunc("/record/dynamics", a.DynamicsHandler)
	//http.HandleFunc("/record")

	err = a.Server.ListenAndServe()
}

// StopApp - завершение работы http-сервера
func (a *App) StopApp() {
	log.Printf("Gracefull shutdown")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := a.Server.Shutdown(ctx); err != nil {
		log.Fatalf("ошибка при завершении работы сервера %s", err)
	}
}
