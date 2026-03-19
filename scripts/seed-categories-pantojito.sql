-- Script para crear las categorías de Cafetería Pantojito
-- Ejecutar después de crear la base de datos

USE cafeteria_pantojito;

-- Limpiar categorías existentes si las hay
DELETE FROM Category;

-- Insertar las categorías específicas de Pantojito
INSERT INTO Category (nombre) VALUES
('Snacks'),
('Papitas'),
('Almuerzos'),
('Bebidas');

-- Verificar que se crearon correctamente
SELECT * FROM Category;
