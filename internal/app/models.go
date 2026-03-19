package app

import "time"

type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	Nombre    string    `json:"nombre"`
	Rol       string    `json:"rol"`
	CreatedAt time.Time `json:"createdAt"`
}

type Category struct {
	ID     int    `json:"id"`
	Nombre string `json:"nombre"`
}

type Product struct {
	ID          int     `json:"id"`
	Nombre      string  `json:"nombre"`
	Descripcion string  `json:"descripcion"`
	Precio      float64 `json:"precio"`
	Imagen      string  `json:"imagen"`
	Disponible  bool    `json:"disponible"`
	CategoryID  int     `json:"categoryId"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Order struct {
	ID              int       `json:"id"`
	UserID          int       `json:"userId"`
	Total           float64   `json:"total"`
	Estado          string    `json:"estado"`
	MetodoPago      string    `json:"metodoPago"`
	TiempoRecogida  int       `json:"tiempoRecogida"`
	ClienteNombre   string    `json:"clienteNombre"`
	ClienteCedula   string    `json:"clienteCedula"`
	ClienteTelefono string    `json:"clienteTelefono"`
	ClienteCorreo   string    `json:"clienteCorreo"`
	CreatedAt       time.Time `json:"createdAt"`
	Items           []OrderItem `json:"items,omitempty"`
}

type OrderItem struct {
	ID        int     `json:"id"`
	OrderID   int     `json:"orderId"`
	ProductID int     `json:"productId"`
	Cantidad  int     `json:"cantidad"`
	Precio    float64 `json:"precio"`
}

type CreateOrderRequest struct {
	UserID          int    `json:"userId"`
	MetodoPago      string `json:"metodoPago"`
	TiempoRecogida  int    `json:"tiempoRecogida"`
	ClienteNombre   string `json:"clienteNombre"`
	ClienteCedula   string `json:"clienteCedula"`
	ClienteTelefono string `json:"clienteTelefono"`
	ClienteCorreo   string `json:"clienteCorreo"`
	Items           []struct {
		ProductID int `json:"productId"`
		Cantidad  int `json:"cantidad"`
	} `json:"items"`
}
