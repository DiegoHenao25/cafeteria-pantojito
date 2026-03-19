-- Script to clear all existing products from database
USE cafeteria_ucp;

-- Clear all products
DELETE FROM productos;

-- Reset auto increment counter
ALTER TABLE productos AUTO_INCREMENT = 1;

-- Verify products table is empty
SELECT COUNT(*) as total_productos FROM productos;
