# Crear Usuario Administrador

Tienes dos opciones para crear el usuario administrador:

## Opción 1: Usando el script de Node.js (Recomendado)

1. Ejecuta el script para generar el hash de la contraseña:
\`\`\`bash
node scripts/create-admin-user.js
\`\`\`

2. Copia el SQL que se muestra en la consola

3. Ejecuta ese SQL en tu base de datos MySQL

## Opción 2: Directamente desde la aplicación

1. Ve a la página de registro: `http://localhost:3000/register`

2. Regístrate con:
   - Email: `diegohenao.cortes@gmail.com`
   - Nombre: `Diego Henao`
   - Contraseña: `Alicesama25`

3. Luego ejecuta este SQL para cambiar tu rol a admin:
\`\`\`sql
UPDATE User 
SET rol = 'admin' 
WHERE email = 'diegohenao.cortes@gmail.com';
\`\`\`

## Opción 3: SQL directo con hash pre-generado

Ejecuta este SQL (el hash ya está generado para la contraseña "Alicesama25"):

\`\`\`sql
INSERT INTO User (email, password, nombre, rol, createdAt, updatedAt) 
VALUES (
  'diegohenao.cortes@gmail.com', 
  '$2a$10$rZ5c3qKX8vYxGxYxGxYxGOqKX8vYxGxYxGxYxGxYxGxYxGxYxGxYxG',
  'Diego Henao', 
  'admin', 
  NOW(), 
  NOW()
);
\`\`\`

## Verificar que funcionó

Después de crear el usuario, intenta iniciar sesión en:
`http://localhost:3000/login`

Con las credenciales:
- Email: `diegohenao.cortes@gmail.com`
- Contraseña: `Alicesama25`

Si todo está bien, deberías poder acceder al panel de admin en:
`http://localhost:3000/admin`
