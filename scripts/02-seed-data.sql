-- Insertar datos de ejemplo
USE cafeteria_ucp;

-- Usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@ucp.edu.co', '$2b$10$rQZ8kZKjKjKjKjKjKjKjKOeKjKjKjKjKjKjKjKjKjKjKjKjKjKjKj', 'admin'),
('Cliente Demo', 'cliente@ucp.edu.co', '$2b$10$rQZ8kZKjKjKjKjKjKjKjKOeKjKjKjKjKjKjKjKjKjKjKjKjKjKjKj', 'cliente');

-- Productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen_url, disponible) VALUES 
('Café Americano', 'Café negro tradicional', 3500.00, '/img/cafe-americano.jpg', TRUE),
('Cappuccino', 'Café con leche espumosa', 4500.00, '/img/cappuccino.jpg', TRUE),
('Croissant', 'Croissant francés recién horneado', 2800.00, '/img/croissant.jpg', TRUE),
('Sandwich Mixto', 'Pan integral con jamón y queso', 6500.00, '/img/sandwich.jpg', TRUE),
('Jugo Natural', 'Jugo de frutas frescas', 4000.00, '/img/jugo.jpg', TRUE),
('Torta de Chocolate', 'Porción de torta casera', 5500.00, '/img/torta.jpg', TRUE);
