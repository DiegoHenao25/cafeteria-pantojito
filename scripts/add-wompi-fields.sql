-- Migración para agregar campos de Wompi a la tabla Orders
-- Ejecutar en Railway MySQL

-- Agregar campo subtotal
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0;

-- Agregar campo comisionPago
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS comisionPago DECIMAL(10, 2) DEFAULT 0;

-- Agregar campo wompiReference
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS wompiReference VARCHAR(255) NULL;

-- Agregar campo wompiStatus
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS wompiStatus VARCHAR(50) NULL;

-- Actualizar registros existentes (subtotal = total, comision = 0)
UPDATE Orders SET subtotal = total, comisionPago = 0 WHERE subtotal = 0 OR subtotal IS NULL;

-- Verificar que los campos fueron agregados
DESCRIBE Orders;
