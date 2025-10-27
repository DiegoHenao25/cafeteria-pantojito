-- Add new columns to orders table for pickup time and client information
ALTER TABLE `Order` 
ADD COLUMN `tiempoRecogida` INT DEFAULT 15 COMMENT 'Tiempo de recogida en minutos',
ADD COLUMN `clienteNombre` VARCHAR(255) COMMENT 'Nombre completo del cliente',
ADD COLUMN `clienteCedula` VARCHAR(50) COMMENT 'Cédula o documento de identidad',
ADD COLUMN `clienteTelefono` VARCHAR(20) COMMENT 'Número de teléfono',
ADD COLUMN `clienteCorreo` VARCHAR(255) COMMENT 'Correo electrónico';
