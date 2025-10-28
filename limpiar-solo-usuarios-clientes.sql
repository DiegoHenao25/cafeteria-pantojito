-- Script para eliminar SOLO usuarios con rol "cliente" (mantiene admins)
-- ⚠️ ADVERTENCIA: Esta acción es PERMANENTE

-- Paso 1: Eliminar items de pedidos de clientes
DELETE FROM OrderItem 
WHERE orderId IN (
  SELECT id FROM Orders 
  WHERE userId IN (SELECT id FROM User WHERE rol = 'cliente')
);

-- Paso 2: Eliminar pedidos de clientes
DELETE FROM Orders 
WHERE userId IN (SELECT id FROM User WHERE rol = 'cliente');

-- Paso 3: Eliminar OTPs de clientes
DELETE FROM Otp 
WHERE email IN (SELECT email FROM User WHERE rol = 'cliente');

-- Paso 4: Eliminar usuarios clientes
DELETE FROM User WHERE rol = 'cliente';

-- Verificar
SELECT 'Usuarios restantes:' as mensaje, COUNT(*) as cantidad, rol FROM User GROUP BY rol;
