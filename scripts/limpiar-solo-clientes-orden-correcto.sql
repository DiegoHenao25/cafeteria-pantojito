-- ============================================
-- SCRIPT PARA LIMPIAR SOLO USUARIOS CLIENTES
-- (Mantiene administradores)
-- ============================================

-- Paso 1: Eliminar items de pedidos de clientes
DELETE FROM OrderItem 
WHERE orderId IN (
  SELECT id FROM Orders 
  WHERE userId IN (
    SELECT id FROM User WHERE role = 'customer'
  )
);

-- Paso 2: Eliminar pedidos de clientes
DELETE FROM Orders 
WHERE userId IN (
  SELECT id FROM User WHERE role = 'customer'
);

-- Paso 3: Eliminar usuarios clientes
DELETE FROM User WHERE role = 'customer';

-- Verificar resultados
SELECT 
  'Usuarios restantes:' as info,
  role,
  COUNT(*) as cantidad 
FROM User 
GROUP BY role;
