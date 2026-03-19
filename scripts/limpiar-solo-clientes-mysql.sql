-- ============================================
-- SCRIPT PARA ELIMINAR SOLO CLIENTES
-- Mantiene usuarios admin
-- Compatible con MySQL/Railway
-- ============================================

-- Paso 1: Desactivar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Paso 2: Eliminar OrderItems de pedidos de clientes
DELETE FROM OrderItem 
WHERE orderId IN (
  SELECT id FROM Orders 
  WHERE userId IN (
    SELECT id FROM User WHERE role != 'admin'
  )
);

-- Paso 3: Eliminar Orders de clientes
DELETE FROM Orders 
WHERE userId IN (
  SELECT id FROM User WHERE role != 'admin'
);

-- Paso 4: Eliminar solo usuarios que NO son admin
DELETE FROM User WHERE role != 'admin';

-- Paso 5: Reactivar verificación de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar resultados
SELECT 'Users restantes:' as info, COUNT(*) as cantidad FROM User
UNION ALL
SELECT 'Orders restantes:' as info, COUNT(*) as cantidad FROM Orders
UNION ALL
SELECT 'OrderItems restantes:' as info, COUNT(*) as cantidad FROM OrderItem;
