-- Script completo para crear la base de datos de Cafetería UCP en MySQL
-- Ejecuta este script en tu servidor MySQL

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS cafeteria_ucp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cafeteria_ucp;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'cliente',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(500),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    categoryId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE,
    INDEX idx_category (categoryId),
    INDEX idx_disponible (disponible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS `Order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    metodoPago VARCHAR(100),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    INDEX idx_user (userId),
    INDEX idx_estado (estado),
    INDEX idx_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de items de orden
CREATE TABLE IF NOT EXISTS OrderItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES `Order`(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
    INDEX idx_order (orderId),
    INDEX idx_product (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador
-- Contraseña: Alicesama25 (ya hasheada con bcrypt)
INSERT INTO User (email, nombre, password, rol) VALUES 
('diegohenao.cortes@gmail.com', 'Diego Henao', '$2a$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Insertar categorías por defecto
INSERT INTO Category (nombre) VALUES 
('Bebidas Calientes'),
('Bebidas Frías'),
('Snacks'),
('Comidas'),
('Postres')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Mostrar las tablas creadas
SHOW TABLES;

-- Verificar la estructura
DESCRIBE User;
DESCRIBE Category;
DESCRIBE Product;
DESCRIBE `Order`;
DESCRIBE OrderItem;
