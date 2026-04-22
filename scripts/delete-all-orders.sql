-- Script para eliminar todos los pedidos de la base de datos
-- ADVERTENCIA: Esta accion es irreversible

-- Primero eliminar los items de pedidos (por la relacion de clave foranea)
DELETE FROM "OrderItem";

-- Luego eliminar todos los pedidos
DELETE FROM "Order";

-- Verificar que se eliminaron
SELECT 'Pedidos eliminados' as resultado, COUNT(*) as total FROM "Order";
SELECT 'Items eliminados' as resultado, COUNT(*) as total FROM "OrderItem";
