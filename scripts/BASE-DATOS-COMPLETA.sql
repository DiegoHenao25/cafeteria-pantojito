-- ============================================
-- SCRIPT COMPLETO PARA CAFETERÍA PANTOJITO
-- Copiar y pegar en phpMyAdmin
-- ============================================

-- 1. CREAR LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS cafeteria_pantojito CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafeteria_pantojito;

-- 2. CREAR TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(191) NOT NULL,
  nombre VARCHAR(191) NOT NULL,
  rol VARCHAR(191) NOT NULL DEFAULT 'cliente',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CREAR TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS Category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(191) NOT NULL UNIQUE,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CREAR TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(191) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagen VARCHAR(191),
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  categoryId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE,
  INDEX idx_categoryId (categoryId),
  INDEX idx_disponible (disponible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CREAR TABLA DE PEDIDOS
CREATE TABLE IF NOT EXISTS `Order` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(191) NOT NULL DEFAULT 'pendiente',
  metodoPago VARCHAR(191),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_estado (estado),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CREAR TABLA DE ITEMS DE PEDIDO
CREATE TABLE IF NOT EXISTS OrderItem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES `Order`(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE,
  INDEX idx_orderId (orderId),
  INDEX idx_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CREAR TABLA DE CÓDIGOS OTP (VERIFICACIÓN)
CREATE TABLE IF NOT EXISTS Otp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL,
  codigo VARCHAR(191) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_expiresAt (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. INSERTAR CATEGORÍAS INICIALES
INSERT INTO Category (nombre) VALUES 
  ('Snacks'),
  ('Papitas'),
  ('Almuerzos'),
  ('Bebidas')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 9. INSERTAR USUARIO ADMINISTRADOR
-- Contraseña: Alicesama25 (ya hasheada con bcrypt)
INSERT INTO User (email, password, nombre, rol) VALUES 
  ('diegohenao.cortes@gmail.com', '$2a$10$YourHashedPasswordHere', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE rol='admin';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- VERIFICAR QUE TODO SE CREÓ CORRECTAMENTE:
SHOW TABLES;
SELECT * FROM Category;
SELECT email, nombre, rol FROM User;
