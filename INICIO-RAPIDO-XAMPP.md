# Inicio Rápido - Cafetería UCP con XAMPP

Guía rápida para poner en marcha el proyecto con XAMPP.

## Requisitos Previos

- Node.js instalado (v18 o superior)
- XAMPP instalado
- Git (opcional)

## Pasos de Instalación

### 1. Iniciar XAMPP

Abre el Panel de Control de XAMPP y inicia:
- ✅ Apache
- ✅ MySQL

Ambos deben estar en verde.

### 2. Crear la Base de Datos

**Opción A - phpMyAdmin (Recomendado):**
1. Abre http://localhost/phpmyadmin
2. Clic en "SQL" en el menú superior
3. Copia y pega el contenido de `scripts/xampp-create-database.sql`
4. Clic en "Continuar"

**Opción B - Línea de comandos:**
\`\`\`bash
cd C:\xampp\mysql\bin
mysql -u root -p
# Presiona Enter (sin contraseña por defecto)
source C:/ruta/a/tu/proyecto/scripts/xampp-create-database.sql
\`\`\`

### 3. Configurar el Proyecto

\`\`\`bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env y configurar:
# DATABASE_URL="mysql://root@localhost:3306/cafeteria_ucp"
# JWT_SECRET="tu_clave_secreta_aqui"
\`\`\`

### 4. Generar Prisma Client

\`\`\`bash
npm run prisma:generate
\`\`\`

### 5. Verificar Conexión

\`\`\`bash
npm run db:verify
\`\`\`

Deberías ver:
\`\`\`
✅ Conexión exitosa a MySQL!
📋 Tablas encontradas:
   - User
   - Category
   - Product
   - Order
   - OrderItem
\`\`\`

### 6. Crear Usuario Administrador

\`\`\`bash
npm run db:create-admin
\`\`\`

Esto creará el usuario:
- Email: diegohenao.cortes@gmail.com
- Contraseña: Alicesama25
- Rol: admin

### 7. Iniciar el Proyecto

\`\`\`bash
npm run dev
\`\`\`

Abre tu navegador en: http://localhost:3000

## 🔐 Gestión de Roles de Usuario

### Ver usuarios registrados en XAMPP

1. Abre http://localhost/phpmyadmin
2. Selecciona la base de datos `cafeteria_ucp`
3. Haz clic en la tabla `User`
4. Verás todos los usuarios registrados con sus roles

### Cambiar rol de usuario a administrador

Cuando un amigo se registre y quieras darle permisos de administrador:

**Opción A - Interfaz phpMyAdmin:**
1. En la tabla `User`, busca el usuario por su email
2. Haz clic en "Editar" (ícono de lápiz)
3. Cambia el campo `rol` de `user` a `admin`
4. Guarda los cambios

**Opción B - SQL:**
\`\`\`sql
UPDATE User 
SET rol = 'admin' 
WHERE email = 'correo@ejemplo.com';
\`\`\`

### Resultado en la página web

Cuando el usuario recargue la página (F5), verá automáticamente:
- ✅ Badge "Admin" junto a su nombre
- ✅ Botón "Panel Admin" en el header (color morado)
- ✅ Acceso completo al CRUD de productos y categorías

Los usuarios con rol `user` solo verán el menú y podrán comprar.

Para más detalles, consulta: `CAMBIAR-ROL-XAMPP.md`

## Verificación Rápida

### ¿XAMPP está corriendo?
- Abre http://localhost/phpmyadmin
- Si carga, MySQL está funcionando ✅

### ¿La base de datos existe?
- En phpMyAdmin, busca "cafeteria_ucp" en la lista de bases de datos

### ¿El proyecto se conecta?
\`\`\`bash
npm run db:verify
\`\`\`

## Comandos Útiles

\`\`\`bash
# Verificar base de datos
npm run db:verify

# Crear/actualizar admin
npm run db:create-admin

# Ver base de datos visualmente
npm run prisma:studio

# Sincronizar schema con BD
npm run prisma:push

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

## Solución de Problemas Comunes

### Error: "Can't connect to MySQL server"
**Solución:** Verifica que MySQL esté corriendo en XAMPP (botón verde)

### Error: "Unknown database 'cafeteria_ucp'"
**Solución:** Ejecuta el script `xampp-create-database.sql` en phpMyAdmin

### Error: "Credenciales inválidas" al iniciar sesión
**Solución:** Ejecuta `npm run db:create-admin` para crear/actualizar el usuario

### El puerto 3000 está ocupado
**Solución:** Usa otro puerto:
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Prisma no se conecta
**Solución:** Verifica tu archivo .env:
\`\`\`env
DATABASE_URL="mysql://root@localhost:3306/cafeteria_ucp"
\`\`\`

## Estructura del Proyecto

\`\`\`
cafeteria-ucp/
├── app/                    # Páginas Next.js
│   ├── api/               # API Routes
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── menu/              # Menú de productos
│   ├── admin/             # Panel de administración
│   └── checkout/          # Proceso de pago
├── components/            # Componentes React
├── lib/                   # Utilidades
├── prisma/               # Schema de base de datos
├── scripts/              # Scripts de configuración
│   ├── xampp-create-database.sql
│   ├── verify-database-connection.js
│   └── create-admin-xampp.js
└── public/               # Archivos estáticos
\`\`\`

## Próximos Pasos

1. Inicia sesión como administrador
2. Crea categorías de productos
3. Agrega productos con precios e imágenes
4. Prueba el flujo de compra como cliente
5. Registra otros usuarios y asígnales roles desde phpMyAdmin

## Soporte

Si tienes problemas:
1. Verifica que XAMPP esté corriendo
2. Ejecuta `npm run db:verify`
3. Revisa el archivo `.env`
4. Consulta `CONFIGURAR-XAMPP.md` para más detalles
5. Revisa `CAMBIAR-ROL-XAMPP.md` para gestión de roles
