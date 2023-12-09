package app

import (
	"backend/api/requests"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
	"sync"
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
			log.Printf("Ошибка при записи %s", err)
			return
		}
	}

	//todo: МБ сделать ответ при некорректных значениях
	AccommodationType, ok := currentRequestBody.Accommodation.(int)
	if !ok {
		log.Printf("Некорректное значение %s", err)
		return
	}

	DealType, ok := currentRequestBody.DealType.(int)
	if !ok {
		log.Printf("Некорректное значение %s", err)
		return
	}

	wg := &sync.WaitGroup{}

	wg.Add(1)
	go func(in ...string) {
		defer wg.Done()
		for _, value := range in {
			if value == "" {
				log.Printf("Некорректное значение %s - %s", value, err)
				return
			}
		}
	}(currentRequestBody.Street, currentRequestBody.HouseNumber,
		currentRequestBody.District, currentRequestBody.Metro)

	wg.Add(1)
	go func(in ...int) {
		defer wg.Done()
		for _, value := range in {
			if value == 0 {
				log.Printf("Некорректное значение %d - %s", value, err)
				return
			}
		}
	}()

	wg.Wait()
	log.Println(AccommodationType, DealType)
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

	isDeleted := a.Database.DeleteEstateRecord(currentRequestBody.Street, currentRequestBody.HouseNumber, currentRequestBody.ApartmentNumber)
	if isDeleted {
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
			log.Printf("Ошибка при записи %s", err)
		}
	}
}
