package app

import (
	"backend/api/schemas"
	"encoding/json"
	"log"
	"net/http"
)

func (a *App) GetTransactionHandler(w http.ResponseWriter, r *http.Request) {
	result := a.Database.GetTransactionRecords()

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
		log.Printf("Ошибка при ответе %s", err)
		return
	}
}

func (a *App) CreateTransactionHandler(w http.ResponseWriter, r *http.Request) {

}

func (a *App) UpdateTransactionHandler(w http.ResponseWriter, r *http.Request) {

}

func (a *App) DeleteTransactionHandler(w http.ResponseWriter, r *http.Request) {

}
