-- Script para insertar el usuario administrador
-- IMPORTANTE: Primero ejecuta el script create-admin-user.js para generar el hash de la contraseña

-- Ejemplo (debes reemplazar el hash con el generado por el script):
-- INSERT INTO User (email, password, nombre, rol, createdAt, updatedAt) 
-- VALUES ('diegohenao.cortes@gmail.com', '$2a$10$HASH_GENERADO_AQUI', 'Diego Henao', 'admin', NOW(), NOW());

-- O si prefieres, usa este comando directo (menos seguro pero funcional para desarrollo):
INSERT INTO User (email, password, nombre, rol, createdAt, updatedAt) 
VALUES (
  'diegohenao.cortes@gmail.com', 
  '$2a$10$YourHashedPasswordHere',
  'Diego Henao', 
  'admin', 
  NOW(), 
  NOW()
);
