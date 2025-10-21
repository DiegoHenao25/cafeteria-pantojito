-- Script to clear sample data from products table
DELETE FROM productos;
ALTER TABLE productos AUTO_INCREMENT = 1;
