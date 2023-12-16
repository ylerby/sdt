package app

import (
	"backend/api/requests"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) GetEstateHandler(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetEstateRecords()

	res, err := json.Marshal(schemas.Response{
		Data:          result,
		ResponseError: "",
	})

	if err != nil {
		log.Printf("Ошибка при сериализации %s", err)
		return
	}

	_, err = w.Write(res)
	if err != nil {
		log.Printf("Ошибка при записи %s", err)
		return
	}
}

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
			log.Printf("Ошибка при ответе %s", err)
			return
		}
	}

	a.Database.CreateEstateRecord(currentRequestBody)
}

func (a *App) UpdateEstateHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.UpdateEstateRequestBody
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
	}

	a.Database.UpdateEstateRecord(currentRequestBody)
	res, err := json.Marshal(schemas.Response{
		Data:          "Запись успешно обновлена",
		ResponseError: "",
	})

	_, err = w.Write(res)
	if err != nil {
		log.Printf("Ошибка при ответе %s", err)
	}
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
			log.Printf("Ошибка при ответе %s", err)
			return
		}
	}

	a.Database.DeleteEstateRecord(currentRequestBody.ID)
	res, err := json.Marshal(schemas.Response{
		Data:          "Запись успешно удалена",
		ResponseError: "",
	})
	if err != nil {
		log.Printf("Ошибка при сериализации %s", err)
		return
	}

	_, err = w.Write(res)
	if err != nil {
		log.Printf("Ошибка при ответе %s", err)
		return
	}
}
