# 🍽️ Configuración Cafetería Pantojito

## 📋 Pasos de Instalación

### 1. Configurar XAMPP

1. Abre XAMPP Control Panel
2. Inicia **Apache** y **MySQL**
3. Abre phpMyAdmin: `http://localhost/phpmyadmin`

### 2. Crear Base de Datos

En phpMyAdmin, ejecuta este SQL:

\`\`\`sql
CREATE DATABASE cafeteria_pantojito CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

\`\`\`env
# Base de datos XAMPP
DATABASE_URL="mysql://root:@localhost:3306/cafeteria_pantojito"

# JWT Secret (genera uno aleatorio)
JWT_SECRET="tu_clave_secreta_super_segura_aqui"

# Email (opcional, para verificación futura)
EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASSWORD="tu_contraseña_de_aplicacion"
\`\`\`

### 4. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 5. Configurar Prisma

\`\`\`bash
# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma db push

# O usar migraciones
npx prisma migrate dev --name init
\`\`\`

### 6. Crear Categorías

Ejecuta el script SQL en phpMyAdmin:

\`\`\`bash
# Copia el contenido de scripts/seed-categories-pantojito.sql
# Y ejecútalo en phpMyAdmin
\`\`\`

O usa Prisma Studio:

\`\`\`bash
npx prisma studio
\`\`\`

### 7. Crear Usuario Administrador

**Opción A: Desde phpMyAdmin**

\`\`\`sql
INSERT INTO User (email, password, nombre, rol, createdAt)
VALUES ('diegohenao.cortes@gmail.com', 'Alicesama25', 'Diego Henao', 'admin', NOW());
\`\`\`

**Opción B: Registrarse y cambiar rol**

1. Regístrate normalmente en la web
2. En phpMyAdmin, ejecuta:

\`\`\`sql
UPDATE User 
SET rol = 'admin' 
WHERE email = 'diegohenao.cortes@gmail.com';
\`\`\`

### 8. Iniciar el Servidor

\`\`\`bash
npm run dev
\`\`\`

Abre: `http://localhost:3000`

## 🎨 Características del Diseño

- **Colores**: Beige claro (#f5f0e6), marrón, dorado
- **Estilo**: Cafetería moderna y minimalista
- **Componentes**: shadcn/ui con bordes redondeados
- **Responsive**: Funciona en móvil y desktop

## 👥 Roles de Usuario

### Cliente (por defecto)
- Ver productos por categoría
- Agregar al carrito
- Realizar pedidos
- Ver historial de pedidos

### Administrador
- Todo lo del cliente +
- Acceso al Panel Admin
- Crear/Editar/Eliminar productos
- Gestionar categorías
- Ver todos los pedidos

## 📂 Categorías de Productos

1. **Snacks** - Galletas, chocolates, dulces
2. **Papitas** - Papas fritas, snacks salados
3. **Almuerzos** - Comidas completas
4. **Bebidas** - Jugos, gaseosas, café

## 🔐 Credenciales de Administrador

\`\`\`
Email: diegohenao.cortes@gmail.com
Contraseña: Alicesama25
\`\`\`

## 🛠️ Comandos Útiles

\`\`\`bash
# Ver la base de datos en interfaz visual
npx prisma studio

# Verificar conexión a la base de datos
npm run db:verify

# Crear admin automáticamente
npm run db:create-admin

# Reiniciar base de datos (¡CUIDADO! Borra todo)
npx prisma migrate reset
\`\`\`

## 📱 Flujo de Usuario

1. **Registro/Login** → Usuario entra al sistema
2. **Ver Productos** → Navega por categorías
3. **Agregar al Carrito** → Selecciona productos
4. **Realizar Pedido** → Confirma compra
5. **Pago** → Interfaz de pago (simulada)

## 🚀 Próximas Funcionalidades

- [ ] Integración real con Mercado Pago
- [ ] Verificación por correo electrónico
- [ ] Notificaciones de pedidos
- [ ] Panel de estadísticas para admin
- [ ] Sistema de calificaciones

## ❓ Solución de Problemas

### No puedo conectar a MySQL
- Verifica que XAMPP esté corriendo
- Revisa que el puerto 3306 esté libre
- Confirma que la base de datos existe

### No puedo iniciar sesión como admin
- Verifica en phpMyAdmin que el rol sea "admin"
- Confirma que el correo sea exactamente: diegohenao.cortes@gmail.com

### Los productos no aparecen
- Verifica que las categorías estén creadas
- Agrega productos desde el Panel Admin
- Revisa la consola del navegador para errores
