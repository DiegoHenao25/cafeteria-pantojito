-- Script para eliminar TODOS los usuarios y sus datos relacionados
-- ⚠️ ADVERTENCIA: Esta acción es PERMANENTE y NO se puede deshacer

-- Paso 1: Eliminar todos los items de pedidos
DELETE FROM OrderItem;

-- Paso 2: Eliminar todos los pedidos
DELETE FROM Orders;

-- Paso 3: Eliminar todos los códigos OTP
DELETE FROM Otp;

-- Paso 4: Eliminar todos los usuarios
DELETE FROM User;

-- Verificar que todo se eliminó
SELECT 'Usuarios restantes:' as mensaje, COUNT(*) as cantidad FROM User;
SELECT 'Pedidos restantes:' as mensaje, COUNT(*) as cantidad FROM Orders;
SELECT 'Items restantes:' as mensaje, COUNT(*) as cantidad FROM OrderItem;
SELECT 'OTPs restantes:' as mensaje, COUNT(*) as cantidad FROM Otp;
