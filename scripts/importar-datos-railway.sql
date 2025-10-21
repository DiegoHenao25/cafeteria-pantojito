-- DATOS DE XAMPP PARA IMPORTAR A RAILWAY
-- Copia y pega este archivo completo en Railway

-- Categorías
INSERT INTO Category (id, nombre) VALUES (1, 'Bebidas');

-- Productos
INSERT INTO Product (id, nombre, descripcion, precio, imagen, disponible, categoryId, createdAt) VALUES 
(1, 'Pony Malta', '', 3500.00, '/uploads/product-1761032210916.png', 1, 1, '2025-10-21 07:13:32.365');

-- Usuarios (incluye tu admin)
INSERT INTO User (id, email, password, nombre, rol, createdAt) VALUES 
(3, 'diegohenao.cortes@gmail.com', '$2b$10$sw3Mtq3a4Y5lFeOEHJ4XCu9PqQF0b91Kb1OnxqyrWNbtU2oOktrc.', 'Diego Henao', 'admin', '2025-10-21 07:11:20.292'),
(4, 'master.yuu25@gmail.com', '$2b$10$V5XuSz8mjas.aztioIqIzuN/e9VdmePWgq1NXc2Q.JYNU9Hk0N.mG', 'Maximo ', 'cliente', '2025-10-21 07:33:28.251'),
(5, 'yuukurogane25@gmail.com', '$2b$10$ta0ubtCWeDx2a2l6wwRtXOPcLMFzAryfFNcyBZgnuPvIHaIduh/du', 'yuukurogane', 'cliente', '2025-10-21 07:59:27.672');

-- Pedidos
INSERT INTO `Order` (id, userId, total, estado, metodoPago, createdAt) VALUES 
(1, 4, 7000.00, 'pendiente', 'efectivo', '2025-10-21 07:34:07.457');

-- Items de pedidos
INSERT INTO OrderItem (id, orderId, productId, cantidad, precio) VALUES 
(1, 1, 1, 2, 3500.00);
