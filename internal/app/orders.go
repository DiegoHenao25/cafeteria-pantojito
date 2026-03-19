package app

import (
	"encoding/json"
	"net/http"
)

func (app *App) getOrders(w http.ResponseWriter, r *http.Request) {
	rows, err := app.Database.Query(`
		SELECT id, userId, total, estado, metodoPago, tiempoRecogida, 
		       clienteNombre, clienteCedula, clienteTelefono, clienteCorreo, createdAt
		FROM Orders
		ORDER BY createdAt DESC
	`)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	orders := []Order{}
	for rows.Next() {
		var order Order
		if err := rows.Scan(
			&order.ID, &order.UserID, &order.Total, &order.Estado, &order.MetodoPago,
			&order.TiempoRecogida, &order.ClienteNombre, &order.ClienteCedula,
			&order.ClienteTelefono, &order.ClienteCorreo, &order.CreatedAt,
		); err != nil {
			app.respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		orders = append(orders, order)
	}

	app.respondJSON(w, http.StatusOK, orders)
}

func (app *App) getOrder(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)
	if err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid order ID")
		return
	}

	order := Order{}
	err = app.Database.QueryRow(`
		SELECT id, userId, total, estado, metodoPago, tiempoRecogida,
		       clienteNombre, clienteCedula, clienteTelefono, clienteCorreo, createdAt
		FROM Orders WHERE id = ?
	`, id).Scan(
		&order.ID, &order.UserID, &order.Total, &order.Estado, &order.MetodoPago,
		&order.TiempoRecogida, &order.ClienteNombre, &order.ClienteCedula,
		&order.ClienteTelefono, &order.ClienteCorreo, &order.CreatedAt,
	)

	if err != nil {
		app.respondError(w, http.StatusNotFound, "Order not found")
		return
	}

	// Get order items
	itemRows, err := app.Database.Query(`
		SELECT id, orderId, productId, cantidad, precio
		FROM OrderItem WHERE orderId = ?
	`, id)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer itemRows.Close()

	items := []OrderItem{}
	for itemRows.Next() {
		var item OrderItem
		if err := itemRows.Scan(&item.ID, &item.OrderID, &item.ProductID, &item.Cantidad, &item.Precio); err != nil {
			app.respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		items = append(items, item)
	}
	order.Items = items

	app.respondJSON(w, http.StatusOK, order)
}

func (app *App) createOrder(w http.ResponseWriter, r *http.Request) {
	var req CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	// Calculate total
	var total float64
	for _, item := range req.Items {
		var precio float64
		err := app.Database.QueryRow("SELECT precio FROM Product WHERE id = ?", item.ProductID).Scan(&precio)
		if err != nil {
			app.respondError(w, http.StatusBadRequest, "Invalid product ID")
			return
		}
		total += precio * float64(item.Cantidad)
	}

	// Insert order
	result, err := app.Database.Exec(`
		INSERT INTO Orders (userId, total, estado, metodoPago, tiempoRecogida, 
		                    clienteNombre, clienteCedula, clienteTelefono, clienteCorreo)
		VALUES (?, ?, 'pendiente', ?, ?, ?, ?, ?, ?)
	`, req.UserID, total, req.MetodoPago, req.TiempoRecogida,
		req.ClienteNombre, req.ClienteCedula, req.ClienteTelefono, req.ClienteCorreo)

	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	orderID, err := result.LastInsertId()
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Insert order items
	for _, item := range req.Items {
		var precio float64
		app.Database.QueryRow("SELECT precio FROM Product WHERE id = ?", item.ProductID).Scan(&precio)
		
		_, err := app.Database.Exec(`
			INSERT INTO OrderItem (orderId, productId, cantidad, precio)
			VALUES (?, ?, ?, ?)
		`, orderID, item.ProductID, item.Cantidad, precio)

		if err != nil {
			app.respondError(w, http.StatusInternalServerError, err.Error())
			return
		}
	}

	app.respondJSON(w, http.StatusCreated, map[string]interface{}{
		"orderId": orderID,
		"total":   total,
		"message": "Order created successfully",
	})
}

func (app *App) updateOrderStatus(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)
	if err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid order ID")
		return
	}

	var req struct {
		Estado string `json:"estado"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		app.respondError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()

	_, err = app.Database.Exec("UPDATE Orders SET estado = ? WHERE id = ?", req.Estado, id)
	if err != nil {
		app.respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	app.respondJSON(w, http.StatusOK, map[string]string{"message": "Order status updated successfully"})
}
