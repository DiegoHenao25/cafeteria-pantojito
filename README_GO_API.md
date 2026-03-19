# Cafetería UCP - API REST en Go

API REST desarrollada en Go para el sistema de pedidos de la Cafetería Pantojito de la Universidad Católica de Pereira.

## Tecnologías

- **Go 1.21+** - Lenguaje de programación
- **Gorilla Mux** - Router HTTP
- **MySQL** - Base de datos
- **golang-migrate** - Migraciones de base de datos

## Estructura del Proyecto

\`\`\`
cafeteria-api/
├── main.go                          # Punto de entrada de la aplicación
├── go.mod                           # Dependencias de Go
├── .env.go.example                  # Ejemplo de variables de entorno
├── internal/
│   ├── app/
│   │   ├── app.go                   # Configuración de la aplicación
│   │   ├── models.go                # Modelos de datos
│   │   ├── users.go                 # Endpoints de usuarios
│   │   ├── products.go              # Endpoints de productos
│   │   ├── categories.go            # Endpoints de categorías
│   │   └── orders.go                # Endpoints de pedidos
│   └── db/
│       ├── database.go              # Conexión a la base de datos
│       ├── migration_logger.go      # Logger para migraciones
│       └── migrations/
│           ├── 000001_init_schema.up.sql    # Migración inicial
│           └── 000001_init_schema.down.sql  # Rollback de migración
└── README_GO_API.md                 # Este archivo
\`\`\`

## Instalación

### 1. Instalar Go

Descarga e instala Go desde [https://golang.org/dl/](https://golang.org/dl/)

Verifica la instalación:
\`\`\`bash
go version
\`\`\`

### 2. Clonar el proyecto

\`\`\`bash
git clone <tu-repositorio>
cd cafeteria-api
\`\`\`

### 3. Instalar dependencias

\`\`\`bash
go mod download
\`\`\`

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

\`\`\`bash
cp .env.go.example .env
\`\`\`

Edita `.env` con tus datos de MySQL:

\`\`\`env
DB_HOST=localhost:3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=cafeteria_ucp
PORT=8080
\`\`\`

### 5. Iniciar MySQL

Asegúrate de que MySQL esté corriendo. Si usas XAMPP:
- Inicia Apache y MySQL desde el panel de control de XAMPP
- La base de datos se creará automáticamente con las migraciones

### 6. Ejecutar la aplicación

\`\`\`bash
go run main.go
\`\`\`

La API estará disponible en `http://localhost:8080`

## Endpoints de la API

### Usuarios

- `GET /users` - Obtener todos los usuarios
- `GET /users/{id}` - Obtener un usuario por ID
- `POST /users` - Crear un nuevo usuario

**Ejemplo POST /users:**
\`\`\`json
{
  "email": "estudiante@ucp.edu.co",
  "password": "password123",
  "nombre": "Juan Pérez",
  "rol": "cliente"
}
\`\`\`

### Categorías

- `GET /categories` - Obtener todas las categorías
- `POST /categories` - Crear una nueva categoría

**Ejemplo POST /categories:**
\`\`\`json
{
  "nombre": "Bebidas"
}
\`\`\`

### Productos

- `GET /products` - Obtener todos los productos
- `GET /products/{id}` - Obtener un producto por ID
- `POST /products` - Crear un nuevo producto
- `PUT /products/{id}` - Actualizar un producto
- `DELETE /products/{id}` - Eliminar un producto

**Ejemplo POST /products:**
\`\`\`json
{
  "nombre": "Café Americano",
  "descripcion": "Café negro recién preparado",
  "precio": 2500,
  "imagen": "https://example.com/cafe.jpg",
  "disponible": true,
  "categoryId": 1
}
\`\`\`

### Pedidos

- `GET /orders` - Obtener todos los pedidos
- `GET /orders/{id}` - Obtener un pedido por ID (incluye items)
- `POST /orders` - Crear un nuevo pedido
- `PUT /orders/{id}/status` - Actualizar estado de un pedido

**Ejemplo POST /orders:**
\`\`\`json
{
  "userId": 1,
  "metodoPago": "efectivo",
  "tiempoRecogida": 15,
  "clienteNombre": "Juan Pérez",
  "clienteCedula": "1234567890",
  "clienteTelefono": "3001234567",
  "clienteCorreo": "juan@example.com",
  "items": [
    {
      "productId": 1,
      "cantidad": 2
    },
    {
      "productId": 3,
      "cantidad": 1
    }
  ]
}
\`\`\`

**Ejemplo PUT /orders/{id}/status:**
\`\`\`json
{
  "estado": "listo"
}
\`\`\`

Estados válidos: `pendiente`, `en_preparacion`, `listo`, `completado`, `cancelado`

## Probar la API

### Con cURL

\`\`\`bash
# Obtener todos los productos
curl http://localhost:8080/products

# Crear una categoría
curl -X POST http://localhost:8080/categories \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Bebidas"}'

# Crear un producto
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Café",
    "descripcion":"Café negro",
    "precio":2500,
    "disponible":true,
    "categoryId":1
  }'
\`\`\`

### Con Postman

1. Importa la colección de endpoints
2. Configura la URL base: `http://localhost:8080`
3. Prueba cada endpoint

## Migraciones de Base de Datos

Las migraciones se ejecutan automáticamente al iniciar la aplicación.

Para crear una nueva migración:

\`\`\`bash
# Instalar migrate CLI
go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Crear nueva migración
migrate create -ext sql -dir internal/db/migrations -seq nombre_migracion
\`\`\`

## Desarrollo

### Compilar la aplicación

\`\`\`bash
go build -o cafeteria-api main.go
\`\`\`

### Ejecutar el binario

\`\`\`bash
./cafeteria-api
\`\`\`

### Hot reload (desarrollo)

Instala `air` para hot reload:

\`\`\`bash
go install github.com/cosmtrek/air@latest
air
\`\`\`

## Despliegue

### Compilar para producción

\`\`\`bash
# Linux
GOOS=linux GOARCH=amd64 go build -o cafeteria-api main.go

# Windows
GOOS=windows GOARCH=amd64 go build -o cafeteria-api.exe main.go
\`\`\`

### Variables de entorno en producción

Configura las variables de entorno en tu servidor:

\`\`\`bash
export DB_HOST=tu-servidor-mysql:3306
export DB_USER=usuario
export DB_PASSWORD=password_seguro
export DB_NAME=cafeteria_ucp
export PORT=8080
\`\`\`

## Seguridad

- Las contraseñas deben hashearse antes de guardarlas (implementar bcrypt)
- Agregar autenticación JWT para endpoints protegidos
- Validar todos los inputs del usuario
- Usar HTTPS en producción
- Configurar CORS apropiadamente

## Mejoras Futuras

- [ ] Autenticación JWT
- [ ] Middleware de autorización
- [ ] Validación de datos con validator
- [ ] Paginación en endpoints GET
- [ ] Filtros y búsqueda
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Tests unitarios
- [ ] Documentación con Swagger/OpenAPI
- [ ] Docker y docker-compose

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

## Licencia

Universidad Católica de Pereira - Proyecto de Grado 2024
