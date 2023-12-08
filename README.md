# Лабораторная работа по теории разработки программного обеспечения
### Для запуска необходимо:
* Выполнить команду:
  ```
  go mod tidy
  ```
* Перейти в /backend/cmd
* Выполнить команду:
  ```
  go run main.go 
  ```

## Предоставляемые методы: 

1) /get

#### Формат ответа:
```json
{
"Data":[{"RealEstateID":1,
"PublicationDate":"202305T00:00:00Z",
"DealType":0,
"Accommodation":0,
"Price":16250000,
"Floor":10,
"FloorsCount":19,
"RoomsCount":2,
"TotalMeters":58.3,
"District":"Северный",
"Street":"Дмитровское шоссе",
"HouseNumber":"169К7",
"ApartmentNumber":247,
"Metro":"Физтех",
"DealTypeID":0,
"AccommodationTypeID":0}],
"ResponseError":""}
```


2) /delete/estate

#### Формат запроса:
##### Form Value:
* street (string)
* house_number (string)
* apartment_number (int)

#### Формат ответа:
```json
{
"Data":"успешное удаление записи",
"ResponseError":""
}
```

3) /create/estate

#### Формат запроса:
```json
{
    "accommodation_type_id" : 0,
    "deal_type_id" : 1,
    "floor" : 6,
    "floors_count" : 12,
    "rooms_count" : 2,
    "total_meters" : 43.3,
    "district" : "Nahabino",
    "street" : "Yasnaya",
    "house_number" : "21k1",
    "apartment_number" : 12,
    "metro" : "MCD Nahabino"
}
```

#### Формат ответа:
```json
{
"Data":"успешное добавление записи",
"ResponseError":""
}
```
