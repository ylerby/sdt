# Лабораторная работа по теории разработки программного обеспечения

### Для запуска frontend`a необходимо:

```
cd frontend
npm i
npm start

link: http://localhost:3000
```

### Для запуска backend`a необходимо:

- Выполнить команду:
  ```
  go mod tidy
  ```
- Перейти в /backend/cmd
- Выполнить команду:
  ```
  go run main.go
  ```

## Предоставляемые методы:

1. /get

#### Формат ответа:

```json
{
  "Data": [
    {
      "RealEstateID": 1,
      "PublicationDate": "202305T00:00:00Z",
      "DealType": 0,
      "Accommodation": 0,
      "Price": 16250000,
      "Floor": 10,
      "FloorsCount": 19,
      "RoomsCount": 2,
      "TotalMeters": 58.3,
      "District": "Северный",
      "Street": "Дмитровское шоссе",
      "HouseNumber": "169К7",
      "ApartmentNumber": 247,
      "Metro": "Физтех",
      "DealTypeID": 0,
      "AccommodationTypeID": 0
    }
  ],
  "ResponseError": ""
}
```

2. /delete/estate

#### Формат запроса:

```json
{
    "Street":"Ленинградский проспект",
    "HouseNumber":"вл8",
    "ApartmentNumber":433
}
```

#### Формат ответа:

```json
{
  "Data": "Запись успешно удалена",
  "ResponseError": ""
}
```

3. /create/estate

#### Формат запроса:

```json
{
  "AccommodationTypeId": 0,
  "DealTypeId": 1,
  "Floor": 6,
  "FloorsCount": 12,
  "RoomsCount": 2,
  "TotalMeters": 43.3,
  "District": "Nahabino",
  "Street": "Yasnaya",
  "HouseNumber": "21k1",
  "ApartmentNumber": 12,
  "Metro": "MCD Nahabino"
}
```

#### Формат ответа:

```json
{
  "Data": "успешное добавление записи",
  "ResponseError": ""
}
```
