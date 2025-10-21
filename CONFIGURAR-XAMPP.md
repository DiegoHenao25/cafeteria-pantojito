# Configurar Base de Datos con XAMPP

Esta guía te ayudará a configurar la base de datos MySQL en XAMPP para el proyecto Cafetería UCP.

## Paso 1: Instalar y Iniciar XAMPP

1. **Descarga XAMPP** desde https://www.apachefriends.org/
2. **Instala XAMPP** en tu computadora
3. **Abre el Panel de Control de XAMPP**
4. **Inicia los servicios**:
   - Haz clic en "Start" junto a **Apache**
   - Haz clic en "Start" junto a **MySQL**

Los botones deberían ponerse verdes cuando estén activos.

## Paso 2: Crear la Base de Datos

### Opción A: Usando phpMyAdmin (Interfaz Gráfica)

1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña **"SQL"** en la parte superior
3. Copia y pega el contenido del archivo `scripts/xampp-create-database.sql`
4. Haz clic en el botón **"Continuar"** o **"Go"**

### Opción B: Usando la Terminal/CMD

1. Abre la terminal o CMD
2. Navega a la carpeta de XAMPP:
   \`\`\`bash
   cd C:\xampp\mysql\bin
   \`\`\`
3. Ejecuta MySQL:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
4. Presiona Enter (la contraseña por defecto está vacía)
5. Ejecuta el script:
   \`\`\`sql
   source C:/ruta/a/tu/proyecto/scripts/xampp-create-database.sql
   \`\`\`

## Paso 3: Configurar las Variables de Entorno

1. Crea un archivo `.env` en la raíz de tu proyecto (copia de `.env.example`)
2. Configura la conexión a XAMPP:

\`\`\`env
# Base de Datos XAMPP (MySQL local)
DATABASE_URL="mysql://root@localhost:3306/cafeteria_ucp"

# Nota: El usuario por defecto de XAMPP es "root" sin contraseña
# Si configuraste una contraseña, usa: mysql://root:tucontraseña@localhost:3306/cafeteria_ucp

# JWT Secret (genera uno aleatorio)
JWT_SECRET="tu_clave_secreta_muy_segura_aqui_12345"

# Email (opcional, para verificación por correo)
EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASSWORD="tu_contraseña_de_aplicacion"
\`\`\`

## Paso 4: Verificar la Conexión

### Método 1: Usando Prisma

1. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

2. Genera el cliente de Prisma:
   \`\`\`bash
   npx prisma generate
   \`\`\`

3. Verifica la conexión:
   \`\`\`bash
   npx prisma db push
   \`\`\`

Si todo está bien, verás un mensaje de éxito.

### Método 2: Usando el Script de Verificación

Ejecuta el script de verificación:
\`\`\`bash
node scripts/verify-database-connection.js
\`\`\`

## Paso 5: Crear el Usuario Administrador

Después de verificar la conexión, crea tu usuario administrador:

\`\`\`bash
node scripts/create-admin-xampp.js
\`\`\`

O ejecuta el SQL directamente en phpMyAdmin:
\`\`\`sql
INSERT INTO User (email, password, nombre, rol, createdAt) 
VALUES (
  'diegohenao.cortes@gmail.com',
  '$2b$10$YourHashedPasswordHere',
  'Diego Henao',
  'admin',
  NOW()
);
\`\`\`

## Paso 6: Iniciar el Proyecto

\`\`\`bash
npm run dev
\`\`\`

Abre tu navegador en `http://localhost:3000`

## Solución de Problemas

### Error: "Can't connect to MySQL server"
- Verifica que MySQL esté corriendo en XAMPP (botón verde)
- Verifica que el puerto sea 3306 (el predeterminado)

### Error: "Access denied for user 'root'"
- Si configuraste una contraseña en XAMPP, actualiza el DATABASE_URL:
  \`\`\`
  DATABASE_URL="mysql://root:tucontraseña@localhost:3306/cafeteria_ucp"
  \`\`\`

### Error: "Unknown database 'cafeteria_ucp'"
- Ejecuta el script `xampp-create-database.sql` en phpMyAdmin

### Verificar que MySQL está corriendo
1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Si carga, MySQL está funcionando correctamente

## Comandos Útiles de Prisma

\`\`\`bash
# Ver el estado de la base de datos
npx prisma db push

# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Resetear la base de datos (¡cuidado! borra todos los datos)
npx prisma db push --force-reset
\`\`\`

## Estructura de la Base de Datos

La base de datos incluye las siguientes tablas:
- **User**: Usuarios del sistema (clientes y administradores)
- **Category**: Categorías de productos (Bebidas, Snacks, etc.)
- **Product**: Productos de la cafetería
- **Order**: Órdenes de compra
- **OrderItem**: Detalles de cada orden

## Credenciales de Administrador

Una vez creado el usuario administrador, podrás iniciar sesión con:
- **Email**: diegohenao.cortes@gmail.com
- **Contraseña**: Alicesama25
