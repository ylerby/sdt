package model

import "gorm.io/gorm"

type Agents struct {
	gorm.Model
	AgentID    int    `gorm:"primary key; agent_id"`
	FirstName  string `gorm:"first_name"`
	Patronymic string `gorm:"patronymic"`
	LastName   string `gorm:"last_name"`
}
