package app

import (
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) GetAllRecords(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetAllRecords()

	response, err := json.Marshal(result)
	if err != nil {
		log.Printf("Ошибка при сериализации %s", err)
	}

	_, err = w.Write(response)
	if err != nil {
		log.Printf("Ошибка при записи %s", err)
	}
}
