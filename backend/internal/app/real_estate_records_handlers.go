package app

import (
	"backend/api/requests"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) MostProfitableSaleHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.MostProfitableSaleRequestBody

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
			log.Printf("Ошибка при ответе %s", err)
			return
		}
		return
	}

	result := a.Database.GetMostProfitableSale(currentRequestBody)

	res, err := json.Marshal(schemas.Response{
		Data:          result,
		ResponseError: "",
	})

	if err != nil {
		log.Printf("Ошибка при сериализации объекта %s", err)
		return
	}

	_, err = w.Write(res)
	if err != nil {
		log.Printf("Ошибка при ответе %s", err)
		return
	}
}
