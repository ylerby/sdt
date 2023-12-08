package app

import (
	"backend/api/requests"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
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
			return
		}
	}

	a.Database.CreateEstateRecord(currentRequestBody)
}

func (a *App) UpdateHandler(w http.ResponseWriter, r *http.Request) {

}

func (a *App) DeleteEstateHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.DeleteEstateRequestBody
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
			return
		}
	}

	intApartmentNumber, err := strconv.Atoi(currentRequestBody.ApartmentNumber)
	if err != nil {
		log.Printf("Ошибка при конвертации числа %s", err)
		return
	}

	a.Database.DeleteEstateRecord(currentRequestBody.Street, currentRequestBody.HouseNumber, intApartmentNumber)
}
