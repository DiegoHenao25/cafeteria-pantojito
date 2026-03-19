package app

import (
	"encoding/json"
	"net/http"
)

func (app *App) getUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := app.Database.Query("SELECT id, email, nombre, rol, createdAt FROM User")
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	users := []User{}
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Email, &user.Nombre, &user.Rol, &user.CreatedAt); err != nil {
			app.respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		users = append(users, user)
	}

	app.respondJSON(w, http.StatusOK, users)
}

func (app *App) getUser(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)
	if err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user := User{}
	err = app.Database.QueryRow("SELECT id, email, nombre, rol, createdAt FROM User WHERE id = ?", id).
		Scan(&user.ID, &user.Email, &user.Nombre, &user.Rol, &user.CreatedAt)
	
	if err != nil {
		app.respondError(w, http.StatusNotFound, "User not found")
		return
	}

	app.respondJSON(w, http.StatusOK, user)
}

func (app *App) createUser(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	result, err := app.Database.Exec(
		"INSERT INTO User (email, password, nombre, rol) VALUES (?, ?, ?, ?)",
		user.Email, user.Password, user.Nombre, user.Rol,
	)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	user.ID = int(id)
	user.Password = "" // Don't return password
	app.respondJSON(w, http.StatusCreated, user)
}
