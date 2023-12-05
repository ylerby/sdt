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
	//Cache    cache.ClientInterface
	Server *http.Server
}

// New - создание приложения
func New(port string) *App {
	return &App{
		Server:   &http.Server{Addr: fmt.Sprintf(":%s", port)},
		Database: sql.New().Connect(),
	}
}

// StartApp - запуск http-сервера
func (a *App) StartApp() {

	http.HandleFunc("/", a.MainPageHandler)
	http.HandleFunc("/update", a.UpdateHandler)
	http.HandleFunc("/create", a.CreateHandler)
	http.HandleFunc("/delete", a.DeleteHandler)

	err := a.Server.ListenAndServe()
	if err != nil {
		log.Println(err)
		return
	}
}

// StopApp - завершение работы http-сервера
func (a *App) StopApp() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := a.Server.Shutdown(ctx); err != nil {
		log.Fatalf("ошибка при завершении работы сервера %s", err)
	}
}
