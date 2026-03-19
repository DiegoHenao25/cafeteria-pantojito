-- ============================================
-- SCRIPT PARA LIMPIAR TODA LA BASE DE DATOS
-- ============================================
-- ADVERTENCIA: Esto eliminará TODOS los datos
-- Ejecutar en Railway Query o desde terminal
-- ============================================

-- Paso 1: Eliminar todos los items de pedidos primero
DELETE FROM OrderItem;

-- Paso 2: Eliminar todos los pedidos
DELETE FROM Orders;

-- Paso 3: Eliminar todos los usuarios
DELETE FROM User;

-- Verificar que todo se eliminó
SELECT 'OrderItems restantes:' as tabla, COUNT(*) as cantidad FROM OrderItem
UNION ALL
SELECT 'Orders restantes:' as tabla, COUNT(*) as cantidad FROM Orders
UNION ALL
SELECT 'Users restantes:' as tabla, COUNT(*) as cantidad FROM User;

-- Resultado esperado: 0 en todas las tablas
