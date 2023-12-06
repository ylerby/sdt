package main

import (
	application "backend/internal/app"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	app := application.New("8080")
	go app.StartApp()

	// Graceful shutdown http сервера
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	<-stop

	app.StopApp()
}
