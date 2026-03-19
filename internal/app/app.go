package app

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"github.com/gorilla/mux"
)

type App struct {
	Router   *mux.Router
	Database *sql.DB
}

func (app *App) SetupRouter() {
	// Users endpoints
	app.Router.Methods("GET").Path("/users").HandlerFunc(app.getUsers)
	app.Router.Methods("GET").Path("/users/{id}").HandlerFunc(app.getUser)
	app.Router.Methods("POST").Path("/users").HandlerFunc(app.createUser)
	
	// Products endpoints
	app.Router.Methods("GET").Path("/products").HandlerFunc(app.getProducts)
	app.Router.Methods("GET").Path("/products/{id}").HandlerFunc(app.getProduct)
	app.Router.Methods("POST").Path("/products").HandlerFunc(app.createProduct)
	app.Router.Methods("PUT").Path("/products/{id}").HandlerFunc(app.updateProduct)
	app.Router.Methods("DELETE").Path("/products/{id}").HandlerFunc(app.deleteProduct)
	
	// Categories endpoints
	app.Router.Methods("GET").Path("/categories").HandlerFunc(app.getCategories)
	app.Router.Methods("POST").Path("/categories").HandlerFunc(app.createCategory)
	
	// Orders endpoints
	app.Router.Methods("GET").Path("/orders").HandlerFunc(app.getOrders)
	app.Router.Methods("GET").Path("/orders/{id}").HandlerFunc(app.getOrder)
	app.Router.Methods("POST").Path("/orders").HandlerFunc(app.createOrder)
	app.Router.Methods("PUT").Path("/orders/{id}/status").HandlerFunc(app.updateOrderStatus)

	log.Println("Router setup complete")
}

// Helper function to send JSON response
func (app *App) respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(response)
}

// Helper function to send error response
func (app *App) respondError(w http.ResponseWriter, code int, message string) {
	app.respondJSON(w, code, map[string]string{"error": message})
}

// Helper function to get ID from URL
func getIDFromURL(r *http.Request) (int, error) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		return 0, err
	}
	return id, nil
}
