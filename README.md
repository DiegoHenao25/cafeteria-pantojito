# Cafetería UCP - Sistema de Gestión

Sistema completo de gestión de cafetería con autenticación, panel de administración con CRUD, catálogo de productos por categorías y sistema de pedidos.

## Características

- **Autenticación completa** con JWT y cookies seguras
- **Verificación por correo electrónico** con código OTP de 6 dígitos
- **Panel de administración** con CRUD de productos y categorías
- **Catálogo de productos** organizado por categorías
- **Carrito de compras** con persistencia en localStorage
- **Sistema de pedidos** con múltiples métodos de pago
- **Roles de usuario** (Admin y Cliente)
- **Base de datos MySQL** con Prisma ORM

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- MySQL
- TailwindCSS v4
- shadcn/ui
- JWT (jose)
- bcryptjs
- Nodemailer

## Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone <tu-repositorio>
cd CafeteriaUcp
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo `.env`:

\`\`\`env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/cafeteria_ucp"
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Configuración de correo para verificación OTP
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion_gmail
\`\`\`

**Importante:** Para configurar el correo electrónico, lee el archivo `CONFIGURAR-EMAIL.md` que contiene instrucciones detalladas sobre cómo obtener una contraseña de aplicación de Gmail.

### 4. Configurar la base de datos

Primero, asegúrate de tener MySQL instalado y corriendo.

Ejecuta el script SQL para crear la base de datos:

\`\`\`bash
mysql -u root -p < scripts/create-database-mysql.sql
\`\`\`

Luego, ejecuta las migraciones de Prisma:

\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 5. Crear categorías iniciales (opcional)

Puedes crear categorías manualmente desde el panel de admin, o ejecutar este comando SQL:

\`\`\`sql
USE cafeteria_ucp;

INSERT INTO Category (nombre) VALUES 
('Bebidas Calientes'),
('Bebidas Frías'),
('Snacks'),
('Comidas'),
('Postres');
\`\`\`

### 6. Ejecutar el proyecto

\`\`\`bash
npm run dev
\`\`\`

El proyecto estará disponible en `http://localhost:3000`

## Credenciales de Administrador

Para acceder al panel de administración, usa estas credenciales:

- **Email:** diegohenao.cortes@gmail.com
- **Contraseña:** Alicesama25

**Proceso de registro:**
1. Ve a `/register`
2. Ingresa tus datos (nombre, email, contraseña)
3. Haz clic en "Enviar código de verificación"
4. Revisa tu correo electrónico
5. Ingresa el código de 6 dígitos que recibiste
6. Completa el registro

El sistema automáticamente asignará el rol de "admin" a este correo específico.

**Si ya intentaste registrarte y no puedes iniciar sesión:**
Ejecuta el script para arreglar la contraseña:
\`\`\`bash
node scripts/fix-admin-password.js
\`\`\`

## Estructura del Proyecto

\`\`\`
CafeteriaUcp/
├── app/
│   ├── admin/              # Panel de administración
│   ├── api/                # Rutas de API
│   │   ├── auth/           # Autenticación
│   │   ├── categories/     # Gestión de categorías
│   │   ├── products/       # Gestión de productos
│   │   └── orders/         # Gestión de pedidos
│   ├── checkout/           # Página de pago
│   ├── login/              # Página de login
│   ├── menu/               # Menú de productos
│   └── register/           # Página de registro
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades y configuración
│   ├── auth.ts             # Funciones de autenticación
│   └── prisma.ts           # Cliente de Prisma
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
└── scripts/                # Scripts SQL
\`\`\`

## Uso

### Para Clientes

1. Registrarse en `/register`
2. Verificar correo con código OTP
3. Iniciar sesión en `/login`
4. Navegar el menú en `/menu`
5. Agregar productos al carrito
6. Proceder al checkout en `/checkout`
7. Seleccionar método de pago y confirmar

### Para Administradores

1. Registrarse con el correo `diegohenao.cortes@gmail.com`
2. Verificar correo con código OTP
3. Iniciar sesión
4. Acceder al panel de admin en `/admin`
5. Gestionar categorías y productos
6. Ver pedidos de clientes

## Notas Importantes

- El sistema de pago es simulado. No se procesan pagos reales.
- Los pedidos se registran en la base de datos para que el personal de la cafetería los prepare.
- Solo el correo `diegohenao.cortes@gmail.com` tiene acceso al panel de administración.
- El carrito se guarda en localStorage para persistencia entre sesiones.
- **Verificación por correo:** Todos los usuarios deben verificar su correo con un código OTP al registrarse.
- **Códigos OTP:** Los códigos expiran en 10 minutos.

## Archivos de Documentación

- `CONFIGURAR-EMAIL.md` - Guía completa para configurar Gmail y Nodemailer
- `INSTRUCCIONES-BASE-DE-DATOS.md` - Instrucciones detalladas para configurar MySQL
- `README.md` - Este archivo

## Soporte

Para problemas o preguntas, contacta al administrador del sistema.
