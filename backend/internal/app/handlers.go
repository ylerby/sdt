package app

import (
	"backend/api/schemas"
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

	res, err := json.Marshal(schemas.Response{
		Data:          response,
		ResponseError: "",
	})

	if err != nil {
		log.Printf("Ошибка при сериализации %s", err)
	}

	_, err = w.Write(res)
	if err != nil {
		log.Printf("Ошибка при записи %s", err)
	}
}
