package app

import (
	"encoding/json"
	"net/http"
)

func (app *App) getCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := app.Database.Query("SELECT id, nombre FROM Category")
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	categories := []Category{}
	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Nombre); err != nil {
			app.respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		categories = append(categories, category)
	}

	app.respondJSON(w, http.StatusOK, categories)
}

func (app *App) createCategory(w http.ResponseWriter, r *http.Request) {
	var category Category
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	result, err := app.Database.Exec("INSERT INTO Category (nombre) VALUES (?)", category.Nombre)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	category.ID = int(id)
	app.respondJSON(w, http.StatusCreated, category)
}
