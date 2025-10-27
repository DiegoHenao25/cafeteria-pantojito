-- Script para eliminar datos de prueba
-- ADVERTENCIA: Este script eliminará datos de la base de datos

-- Eliminar pedidos de prueba (opcional: ajusta la fecha según necesites)
DELETE FROM "OrderItem" WHERE "orderId" IN (
  SELECT id FROM "Order" WHERE "createdAt" < NOW() - INTERVAL '1 day'
);

DELETE FROM "Order" WHERE "createdAt" < NOW() - INTERVAL '1 day';

-- O si quieres eliminar TODOS los pedidos:
-- DELETE FROM "OrderItem";
-- DELETE FROM "Order";

-- Eliminar usuarios de prueba (mantén solo el admin principal)
-- CUIDADO: Ajusta el email del admin que quieres mantener
DELETE FROM "User" WHERE email != 'admin@cafeteria.com';

-- O eliminar usuarios específicos por email:
-- DELETE FROM "User" WHERE email IN ('test@test.com', 'prueba@prueba.com');

-- Verificar cuántos registros quedan
SELECT 'Usuarios restantes:' as info, COUNT(*) as total FROM "User"
UNION ALL
SELECT 'Pedidos restantes:', COUNT(*) FROM "Order"
UNION ALL
SELECT 'Items de pedidos restantes:', COUNT(*) FROM "OrderItem";
