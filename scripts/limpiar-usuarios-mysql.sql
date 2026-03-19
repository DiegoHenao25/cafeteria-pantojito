-- ============================================
-- SCRIPT PARA ELIMINAR TODOS LOS USUARIOS
-- Compatible con MySQL/Railway
-- ============================================

-- Paso 1: Desactivar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Paso 2: Eliminar OrderItems (items de pedidos)
DELETE FROM OrderItem;

-- Paso 3: Eliminar Orders (pedidos)
DELETE FROM Orders;

-- Paso 4: Eliminar Users (usuarios)
DELETE FROM User;

-- Paso 5: Reactivar verificación de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar que todo se eliminó
SELECT 'OrderItems restantes:' as tabla, COUNT(*) as cantidad FROM OrderItem
UNION ALL
SELECT 'Orders restantes:' as tabla, COUNT(*) as cantidad FROM Orders
UNION ALL
SELECT 'Users restantes:' as tabla, COUNT(*) as cantidad FROM User;
