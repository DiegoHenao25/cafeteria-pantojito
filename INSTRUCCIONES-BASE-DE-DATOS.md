# Instrucciones para Configurar la Base de Datos MySQL

## Opción 1: Usando el Script SQL Directamente

### Paso 1: Acceder a MySQL
\`\`\`bash
mysql -u root -p
\`\`\`

### Paso 2: Ejecutar el script de creación
\`\`\`bash
mysql -u root -p < scripts/create-database-mysql.sql
\`\`\`

### Paso 3 (Opcional): Agregar datos de ejemplo
\`\`\`bash
mysql -u root -p cafeteria_ucp < scripts/seed-sample-data.sql
\`\`\`

## Opción 2: Usando Prisma (Recomendado)

### Paso 1: Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
\`\`\`env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/cafeteria_ucp"
JWT_SECRET="tu_clave_secreta_muy_segura_aqui"
\`\`\`

### Paso 2: Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### Paso 3: Generar el cliente de Prisma
\`\`\`bash
npx prisma generate
\`\`\`

### Paso 4: Crear las tablas automáticamente
\`\`\`bash
npx prisma db push
\`\`\`

### Paso 5: (Opcional) Abrir Prisma Studio para ver los datos
\`\`\`bash
npx prisma studio
\`\`\`

## Crear el Usuario Administrador

Después de crear las tablas, necesitas crear tu usuario administrador con la contraseña hasheada.

### Opción A: Desde MySQL
\`\`\`sql
USE cafeteria_ucp;

-- Primero, hashea tu contraseña usando bcrypt
-- Puedes usar un generador online o el siguiente código Node.js

INSERT INTO User (email, nombre, password, rol) VALUES 
('diegohenao.cortes@gmail.com', 'Diego Henao', '$2a$10$[TU_HASH_AQUI]', 'admin');
\`\`\`

### Opción B: Usando el endpoint de registro
1. Inicia el servidor: `npm run dev`
2. Usa el endpoint POST `/api/auth/register` con:
\`\`\`json
{
  "email": "diegohenao.cortes@gmail.com",
  "password": "Alicesama25",
  "nombre": "Diego Henao"
}
\`\`\`
3. Luego actualiza el rol en la base de datos:
\`\`\`sql
UPDATE User SET rol = 'admin' WHERE email = 'diegohenao.cortes@gmail.com';
\`\`\`

## Verificar la Instalación

\`\`\`sql
USE cafeteria_ucp;

-- Ver todas las tablas
SHOW TABLES;

-- Ver usuarios
SELECT * FROM User;

-- Ver categorías
SELECT * FROM Category;

-- Ver productos
SELECT * FROM Product;
\`\`\`

## Comandos Útiles de Prisma

\`\`\`bash
# Ver el estado de la base de datos
npx prisma db pull

# Resetear la base de datos (CUIDADO: borra todos los datos)
npx prisma db push --force-reset

# Abrir interfaz visual de la base de datos
npx prisma studio

# Generar migraciones
npx prisma migrate dev --name nombre_migracion
\`\`\`

## Solución de Problemas

### Error de conexión
- Verifica que MySQL esté corriendo: `sudo service mysql status`
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que el puerto 3306 esté disponible

### Error de permisos
\`\`\`sql
GRANT ALL PRIVILEGES ON cafeteria_ucp.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### Resetear contraseña de admin
\`\`\`sql
UPDATE User 
SET password = '$2a$10$[NUEVO_HASH]' 
WHERE email = 'diegohenao.cortes@gmail.com';
