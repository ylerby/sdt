package app

import (
	"backend/api/requests"
	"backend/api/responses"
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) GetTransactionHandler(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetTransactionRecords()

	convertResult := make([]responses.ConvertTransactionRecordsResult, len(result))

	for index := range result {
		// todo: нужен ли TransactionId на фронте?
		convertResult[index].TransactionId = result[index].TransactionId
		convertResult[index].TransactionDate = result[index].TransactionDate
		convertResult[index].TransactionPrice = result[index].TransactionPrice
		convertResult[index].AccommodationTypeName = result[index].AccommodationTypeName
		convertResult[index].AgentFullName = result[index].AgentFullName
		convertResult[index].ClientFullName = result[index].ClientFullName
		convertResult[index].DealTypeName = result[index].DealTypeName
	}

	res, err := json.Marshal(schemas.Response{
		Data:          convertResult,
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

func (a *App) CreateTransactionHandler(w http.ResponseWriter, r *http.Request) {
	var currentRequestBody requests.CreateTransactionBody
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

	a.Database.CreateTransactionRecord(currentRequestBody)
}

func (a *App) UpdateTransactionHandler(w http.ResponseWriter, r *http.Request) {

}

func (a *App) DeleteTransactionHandler(w http.ResponseWriter, r *http.Request) {

}
