package app

import (
	"backend/api/requests"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) CreateEstateHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.CreateEstateRequestBody
	err := json.NewDecoder(r.Body).Decode(&currentRequestBody)
	if err != nil {
		res, err := json.Marshal(schemas.Response{
			Data:          nil,
			ResponseError: "Ошибка при получении значения",
		})
		if err != nil {
			log.Printf("Ошибка при сериализации объекта %s", err)
			return
		}

		_, err = w.Write(res)
		if err != nil {
			log.Printf("Ошибка при записи %s", err)
		}
	}

	//todo: валидация полей

	a.Database.CreateEstateRecord(currentRequestBody)
}

func (a *App) UpdateHandler(w http.ResponseWriter, r *http.Request) {

}

func (a *App) DeleteHandler(w http.ResponseWriter, r *http.Request) {

}
