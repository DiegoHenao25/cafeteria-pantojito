package app

import (
	"encoding/json"
	"net/http"
)

func (app *App) getProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := app.Database.Query(`
		SELECT id, nombre, descripcion, precio, imagen, disponible, categoryId, createdAt 
		FROM Product
	`)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	products := []Product{}
	for rows.Next() {
		var product Product
		if err := rows.Scan(
			&product.ID, &product.Nombre, &product.Descripcion, 
			&product.Precio, &product.Imagen, &product.Disponible, 
			&product.CategoryID, &product.CreatedAt,
		); err != nil {
			app.respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		products = append(products, product)
	}

	app.respondJSON(w, http.StatusOK, products)
}

func (app *App) getProduct(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)
	if err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	product := Product{}
	err = app.Database.QueryRow(`
		SELECT id, nombre, descripcion, precio, imagen, disponible, categoryId, createdAt 
		FROM Product WHERE id = ?
	`, id).Scan(
		&product.ID, &product.Nombre, &product.Descripcion,
		&product.Precio, &product.Imagen, &product.Disponible,
		&product.CategoryID, &product.CreatedAt,
	)

	if err != nil {
		app.respondError(w, http.StatusNotFound, "Product not found")
		return
	}

	app.respondJSON(w, http.StatusOK, product)
}

func (app *App) createProduct(w http.ResponseWriter, r *http.Request) {
	var product Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	result, err := app.Database.Exec(`
		INSERT INTO Product (nombre, descripcion, precio, imagen, disponible, categoryId) 
		VALUES (?, ?, ?, ?, ?, ?)
	`, product.Nombre, product.Descripcion, product.Precio, product.Imagen, product.Disponible, product.CategoryID)
	
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	product.ID = int(id)
	app.respondJSON(w, http.StatusCreated, product)
}

func (app *App) updateProduct(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)
	if err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var product Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	_, err = app.Database.Exec(`
		UPDATE Product 
		SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, disponible = ?, categoryId = ?
		WHERE id = ?
	`, product.Nombre, product.Descripcion, product.Precio, product.Imagen, product.Disponible, product.CategoryID, id)

	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	product.ID = id
	app.respondJSON(w, http.StatusOK, product)
}

func (app *App) deleteProduct(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)
	if err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	_, err = app.Database.Exec("DELETE FROM Product WHERE id = ?", id)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	app.respondJSON(w, http.StatusOK, map[string]string{"message": "Product deleted successfully"})
}
