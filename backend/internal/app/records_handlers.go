package app

import (
	"backend/api/requests"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) ProfitableRecordHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.ProfitableRecordRequestBody

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

	result := a.Database.GetProfitableRecord(currentRequestBody)

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

func (a *App) AgentRecordHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.AgentRecordRequestBody

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

	result := a.Database.GetAgentRecord(currentRequestBody)

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

func (a *App) DynamicsHandler(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetDynamicsRecord()

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

func (a *App) AverageHandler(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetAverageRecord()

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
