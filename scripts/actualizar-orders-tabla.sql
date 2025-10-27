-- Actualizar tabla Order con nuevos campos para checkout
-- Ejecutar este script en Railway

-- Agregar columnas de información del cliente
ALTER TABLE `Order` 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_lastname VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(100);

-- Agregar columna de tiempo de recogida
ALTER TABLE `Order` 
ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(20);

-- Agregar columnas de método de pago
ALTER TABLE `Order` 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

-- Agregar columna de referencia de pago
ALTER TABLE `Order` 
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);

SELECT 'Tabla Order actualizada exitosamente' AS resultado;
