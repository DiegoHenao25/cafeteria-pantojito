# 🚀 Guía Completa de Instalación - PC Nueva
## Cafetería Pantojito

Esta guía te llevará paso a paso desde cero hasta tener el proyecto funcionando.

---

## 📋 PASO 1: Instalar Node.js

Node.js es necesario para ejecutar el proyecto Next.js.

1. Ve a: https://nodejs.org/
2. Descarga la versión **LTS** (recomendada, botón verde)
3. Ejecuta el instalador descargado
4. Sigue el asistente de instalación:
   - Acepta los términos
   - Deja las opciones por defecto
   - Click en "Next" hasta "Install"
5. Espera a que termine la instalación
6. Click en "Finish"

**Verificar instalación:**
1. Abre el **Símbolo del sistema** (CMD) o **PowerShell**
   - Presiona `Windows + R`
   - Escribe `cmd` y presiona Enter
2. Escribe: `node --version`
3. Debe mostrar algo como: `v20.x.x`
4. Escribe: `npm --version`
5. Debe mostrar algo como: `10.x.x`

✅ Si ves las versiones, Node.js está instalado correctamente.

---

## 📋 PASO 2: Instalar Visual Studio Code

1. Ve a: https://code.visualstudio.com/
2. Click en "Download for Windows"
3. Ejecuta el instalador descargado
4. Sigue el asistente:
   - Acepta los términos
   - **IMPORTANTE:** Marca estas opciones:
     - ✅ Agregar "Abrir con Code" al menú contextual
     - ✅ Agregar a PATH
   - Click en "Next" hasta "Install"
5. Click en "Finish"

---

## 📋 PASO 3: Instalar XAMPP

XAMPP incluye MySQL para la base de datos.

1. Ve a: https://www.apachefriends.org/
2. Descarga XAMPP para Windows
3. Ejecuta el instalador
4. Si aparece advertencia de antivirus, click en "Yes"
5. En componentes, asegúrate de tener marcado:
   - ✅ Apache
   - ✅ MySQL
   - ✅ phpMyAdmin
6. Deja la carpeta de instalación por defecto: `C:\xampp`
7. Click en "Next" hasta "Finish"

**Iniciar XAMPP:**
1. Abre "XAMPP Control Panel" (busca en el menú inicio)
2. Click en "Start" en **Apache**
3. Click en "Start" en **MySQL**
4. Ambos deben aparecer con fondo verde

✅ XAMPP está funcionando correctamente.

---

## 📋 PASO 4: Configurar Visual Studio Code

### Instalar Extensiones Recomendadas

1. Abre Visual Studio Code
2. Click en el ícono de extensiones (cuadrado con 4 cuadros) en la barra lateral izquierda
3. Busca e instala estas extensiones:

**Esenciales:**
- **ES7+ React/Redux/React-Native snippets** (por dsznajder)
- **Prisma** (por Prisma)
- **Tailwind CSS IntelliSense** (por Tailwind Labs)
- **ESLint** (por Microsoft)
- **Prettier - Code formatter** (por Prettier)

**Opcionales pero útiles:**
- **Auto Rename Tag** (por Jun Han)
- **Path Intellisense** (por Christian Kohler)
- **GitLens** (por GitKraken)

Para instalar cada una:
1. Busca el nombre
2. Click en "Install"
3. Espera a que termine

---

## 📋 PASO 5: Descargar y Abrir el Proyecto

1. Descarga el proyecto (ZIP) o clónalo con Git
2. Extrae el ZIP en una carpeta fácil de encontrar, por ejemplo:
   - `C:\Proyectos\CafeteriaPantojito`
3. Abre Visual Studio Code
4. Click en "File" → "Open Folder"
5. Selecciona la carpeta del proyecto
6. Click en "Select Folder"

---

## 📋 PASO 6: Instalar Dependencias del Proyecto

1. En Visual Studio Code, abre la **Terminal integrada**:
   - Menú: `Terminal` → `New Terminal`
   - O presiona: `Ctrl + Ñ` (o `Ctrl + `)
2. Verás una terminal en la parte inferior
3. Escribe este comando y presiona Enter:

\`\`\`bash
npm install
\`\`\`

4. Espera a que termine (puede tardar 2-5 minutos)
5. Verás muchas líneas de texto, es normal
6. Cuando termine, verás el cursor parpadeando de nuevo

✅ Las dependencias están instaladas.

---

## 📋 PASO 7: Configurar Variables de Entorno

1. En Visual Studio Code, busca el archivo `.env.example`
2. Click derecho sobre él → "Copy"
3. Click derecho en el espacio vacío → "Paste"
4. Renombra la copia a `.env` (sin el .example)
5. Abre el archivo `.env`
6. Edita las siguientes líneas:

\`\`\`env
# Base de datos XAMPP (sin contraseña por defecto)
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"

# Clave secreta (puedes dejar esta o cambiarla)
JWT_SECRET="tu-clave-secreta-super-segura-cambiala-123"

# Email (opcional por ahora, para verificación OTP)
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-contraseña-de-aplicacion"
\`\`\`

7. Guarda el archivo: `Ctrl + S`

---

## 📋 PASO 8: Crear la Base de Datos en XAMPP

### Opción A: Usando phpMyAdmin (Más fácil)

1. Asegúrate de que XAMPP esté corriendo (Apache y MySQL en verde)
2. Abre tu navegador
3. Ve a: `http://localhost/phpmyadmin`
4. Click en la pestaña "SQL" arriba
5. Abre el archivo `scripts/xampp-create-database.sql` en VS Code
6. Copia TODO el contenido (Ctrl + A, luego Ctrl + C)
7. Pega en el cuadro de texto de phpMyAdmin
8. Click en el botón "Go" o "Continuar"
9. Debe aparecer un mensaje de éxito en verde

### Opción B: Usando la Terminal (Alternativa)

1. En la terminal de VS Code, escribe:

\`\`\`bash
npm run db:verify
\`\`\`

2. Si la conexión es exitosa, ejecuta:

\`\`\`bash
npx prisma db push
\`\`\`

3. Esto creará todas las tablas automáticamente

✅ La base de datos está creada.

---

## 📋 PASO 9: Crear el Usuario Administrador

Tienes dos opciones:

### Opción A: Usando el script automático

1. En la terminal de VS Code, escribe:

\`\`\`bash
npm run db:create-admin
\`\`\`

2. Esto creará el usuario administrador con:
   - Email: diegohenao.cortes@gmail.com
   - Contraseña: Alicesama25

### Opción B: Registrarte y cambiar rol manualmente

1. Ejecuta el proyecto (ver siguiente paso)
2. Regístrate normalmente con tu email
3. Ve a phpMyAdmin: `http://localhost/phpmyadmin`
4. Click en la base de datos `cafeteria_pantojito`
5. Click en la tabla `User`
6. Click en "Edit" (lápiz) en tu usuario
7. Cambia el campo `role` de `user` a `admin`
8. Click en "Go"

✅ Usuario administrador creado.

---

## 📋 PASO 10: Ejecutar el Proyecto

1. En la terminal de VS Code, escribe:

\`\`\`bash
npm run dev
\`\`\`

2. Espera unos segundos
3. Verás un mensaje como:
   \`\`\`
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in 2.5s
   \`\`\`

4. Abre tu navegador
5. Ve a: `http://localhost:3000`

✅ **El proyecto está funcionando!**

---

## 🎉 PASO 11: Probar el Sistema

### Iniciar Sesión como Administrador

1. Ve a: `http://localhost:3000/login`
2. Ingresa:
   - Email: `diegohenao.cortes@gmail.com`
   - Contraseña: `Alicesama25`
3. Click en "Iniciar Sesión"
4. Deberías ver el menú con un badge "Admin"
5. Click en "Panel Admin" para acceder al CRUD

### Agregar Productos

1. En el Panel Admin, ve a la pestaña "Productos"
2. Click en "Agregar Producto"
3. Llena los datos:
   - Nombre del producto
   - Descripción
   - Precio
   - Categoría (Snacks, Papitas, Almuerzos, Bebidas)
   - URL de imagen
4. Click en "Guardar"

### Ver como Cliente

1. Cierra sesión
2. Regístrate con otro email
3. Verás el menú de productos que agregaste
4. Puedes agregar al carrito y hacer pedidos

---

## 🔧 Comandos Útiles

\`\`\`bash
# Iniciar el proyecto
npm run dev

# Verificar conexión a base de datos
npm run db:verify

# Crear usuario administrador
npm run db:create-admin

# Ver la base de datos con Prisma Studio
npx prisma studio

# Reinstalar dependencias (si hay problemas)
npm install

# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## ❓ Solución de Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que XAMPP esté corriendo (MySQL en verde)
- Verifica que el archivo `.env` tenga la URL correcta
- Ejecuta: `npm run db:verify`

### Error: "Port 3000 is already in use"
- Cierra otras aplicaciones que usen el puerto 3000
- O cambia el puerto: `npm run dev -- -p 3001`

### Error: "Module not found"
- Ejecuta: `npm install`
- Reinicia VS Code

### No aparece el botón "Panel Admin"
- Verifica en phpMyAdmin que tu usuario tenga `role = 'admin'`
- Cierra sesión y vuelve a iniciar sesión
- Recarga la página (F5)

### Las imágenes no se ven
- Usa URLs completas de imágenes (https://...)
- O sube las imágenes a un servicio como Imgur o Cloudinary

---

## 📞 Checklist Final

Antes de empezar a usar el sistema, verifica:

- ✅ Node.js instalado (verificar con `node --version`)
- ✅ Visual Studio Code instalado
- ✅ XAMPP instalado y corriendo (Apache y MySQL en verde)
- ✅ Dependencias instaladas (`npm install` completado)
- ✅ Archivo `.env` configurado
- ✅ Base de datos creada en phpMyAdmin
- ✅ Usuario administrador creado
- ✅ Proyecto corriendo (`npm run dev`)
- ✅ Puedes acceder a `http://localhost:3000`
- ✅ Puedes iniciar sesión como administrador

---

## 🎓 Próximos Pasos

1. **Agregar categorías**: En el Panel Admin, crea las categorías (Snacks, Papitas, Almuerzos, Bebidas)
2. **Agregar productos**: Agrega productos con sus precios e imágenes
3. **Probar pedidos**: Regístrate como cliente y haz un pedido de prueba
4. **Personalizar**: Cambia colores, textos, y diseño según tus necesidades

---

## 📚 Recursos Adicionales

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **XAMPP Docs**: https://www.apachefriends.org/docs/

---

¡Listo! Ahora tienes todo configurado para trabajar en la Cafetería Pantojito. 🎉
