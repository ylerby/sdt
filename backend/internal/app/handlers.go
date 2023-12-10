package app

import (
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) GetAllRecords(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetEstateRecords()

	res, err := json.Marshal(schemas.Response{
		Data:          result,
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
