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
```
1.	 /get/estate
2.	 /create/estate
3.	 /update/estate
4.	 /delete/estate
5.       /get/transaction
6.       /create/transaction
7.       /record/profitable
8.       /record/agent_record
9.       /record/dynamics
10.      /record/average
11.      /record/top_agents
12.      /record/sales_count
```

```bash         
├── api
│   ├── requests
│   │   └── requests.go                    <- структуры запросов
│   ├── responses
│   │   └── responses.go                   <- структуры ответов sql-запросов
│   └── schemas     
│       └── schemas.go                     <- структура ответа
│
│
├── cmd       
│   └── main.go                            <- запуск приложения          
│
├── internal
│   ├── app
│   │   ├── app.go                         <- запуск/завершение работы сервера, роутинг
│   │   ├── estate_handlers.go             <- хендлеры 
│   │   ├── records_handlers.go
│   │   └── transaction_handlers.go
│   │
│   │
│   ├── database
│   │   └── sql
│   │       ├── sql.go                     <- подключение к базе данных 
│   │       ├── store.go                   <- "storage" с необходимыми интерфейсами и структурами 
│   │       ├── record_methods.go          <- методы взаимодействия с бд 
│   │       ├── estate_methods.go
│   │       └── transaction_methods.go    
│   │
│   │
│   │
│   └── model
│       ├── accomodation.go                <- gorm-модели
│       ├── agents.go
│       ├── clients.go
│       ├── deal.go
│       ├── estate.go
│       └── transactions.go
│
└── go.mod                                 <- файл с зависимостями 
```
