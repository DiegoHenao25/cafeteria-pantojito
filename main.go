package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"cafeteria-api/internal/app"
	"cafeteria-api/internal/db"
)

func main() {
	database, err := db.CreateDatabase()
	if err != nil {
		log.Fatalf("Database connection failed: %s", err.Error())
	}

	app := &app.App{
		Router:   mux.NewRouter().StrictSlash(true),
		Database: database,
	}

	app.SetupRouter()

	log.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", app.Router))
}
