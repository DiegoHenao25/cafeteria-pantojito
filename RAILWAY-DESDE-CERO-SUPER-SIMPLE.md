# 🚂 Guía SUPER SIMPLE: Subir tu Proyecto a Railway desde Visual Studio Code

## 📋 ¿Qué vamos a hacer?

Actualmente tu proyecto está SOLO en tu computadora (Visual Studio Code). Vamos a subirlo a Railway para que esté en internet y cualquiera pueda acceder.

---

## 🎯 PASO 1: Instalar Git en tu PC

**¿Qué es Git?** Es un programa que te permite subir tu código a internet.

### Windows:
1. Ve a: https://git-scm.com/download/win
2. Descarga el instalador
3. Ejecuta el instalador (dale "Next" a todo)
4. Reinicia Visual Studio Code

### Verificar que Git está instalado:
1. Abre Visual Studio Code
2. Abre la terminal (menú: Terminal → New Terminal)
3. Escribe: `git --version`
4. Deberías ver algo como: `git version 2.x.x`

---

## 🎯 PASO 2: Crear cuenta en GitHub

**¿Qué es GitHub?** Es como Google Drive pero para código.

1. Ve a: https://github.com
2. Haz clic en "Sign up" (Registrarse)
3. Crea tu cuenta con tu email
4. Verifica tu email

---

## 🎯 PASO 3: Subir tu proyecto a GitHub desde Visual Studio Code

### 3.1 Abrir tu proyecto en Visual Studio Code
1. Abre Visual Studio Code
2. Abre la carpeta de tu proyecto (File → Open Folder)
3. Selecciona la carpeta `CafeteriaUcp` (o como se llame tu proyecto)

### 3.2 Inicializar Git
1. Abre la terminal en VS Code (Terminal → New Terminal)
2. Copia y pega estos comandos UNO POR UNO:

\`\`\`bash
git init
\`\`\`

\`\`\`bash
git add .
\`\`\`

\`\`\`bash
git commit -m "Primer commit - Cafeteria Pantojito"
\`\`\`

### 3.3 Crear repositorio en GitHub
1. Ve a: https://github.com/new
2. **Repository name:** `cafeteria-pantojito` (o el nombre que quieras)
3. **Descripción:** "Sistema de cafetería con carrito de compras"
4. Deja todo lo demás como está
5. Haz clic en "Create repository"

### 3.4 Conectar VS Code con GitHub
Después de crear el repositorio, GitHub te mostrará unos comandos. Cópialos y pégalos en la terminal de VS Code.

Deberían verse algo así (pero con TU usuario de GitHub):

\`\`\`bash
git remote add origin https://github.com/TU-USUARIO/cafeteria-pantojito.git
\`\`\`

\`\`\`bash
git branch -M main
\`\`\`

\`\`\`bash
git push -u origin main
\`\`\`

**IMPORTANTE:** Te pedirá tu usuario y contraseña de GitHub. Ingrésalos.

---

## 🎯 PASO 4: Conectar Railway con GitHub

### 4.1 Ir a Railway
1. Ve a: https://railway.app
2. Inicia sesión (si no tienes cuenta, créala con GitHub)

### 4.2 Crear nuevo servicio para tu aplicación
1. En Railway, haz clic en tu proyecto (donde ya tienes MySQL)
2. Haz clic en "+ New" (botón morado arriba a la derecha)
3. Selecciona "GitHub Repo"
4. Busca tu repositorio: `cafeteria-pantojito`
5. Haz clic en él para seleccionarlo

**Railway automáticamente detectará que es un proyecto Next.js y empezará a desplegarlo.**

---

## 🎯 PASO 5: Configurar Variables de Entorno en Railway

### 5.1 Ir a las variables del servicio de Next.js
1. En Railway, haz clic en el servicio de tu aplicación (NO el de MySQL)
2. Ve a la pestaña "Variables"
3. Haz clic en "+ New Variable"

### 5.2 Agregar las variables una por una

**Variable 1: DATABASE_URL**
- **Name:** `DATABASE_URL`
- **Value:** Copia el `MYSQL_PUBLIC_URL` que te mostré antes. Debería verse así:
  \`\`\`
  mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
  \`\`\`

**Variable 2: JWT_SECRET**
- **Name:** `JWT_SECRET`
- **Value:** `mi-secreto-super-seguro-123456-cambialo-por-algo-aleatorio`

**Variable 3: EMAIL_USER**
- **Name:** `EMAIL_USER`
- **Value:** Tu correo de Gmail (ej: `tucorreo@gmail.com`)

**Variable 4: EMAIL_PASSWORD**
- **Name:** `EMAIL_PASSWORD`
- **Value:** Tu contraseña de aplicación de Gmail de 16 dígitos

### 5.3 Guardar
Haz clic en "Add" para cada variable.

**Railway automáticamente reiniciará tu aplicación con las nuevas variables.**

---

## 🎯 PASO 6: Crear las Tablas en la Base de Datos de Railway

### 6.1 Conectarte a la base de datos de Railway desde tu PC

1. Abre Visual Studio Code
2. Abre la terminal
3. Crea un archivo `.env.production` en la raíz de tu proyecto:

\`\`\`bash
DATABASE_URL="mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway"
\`\`\`

(Usa el MYSQL_PUBLIC_URL de Railway)

### 6.2 Ejecutar Prisma para crear las tablas

\`\`\`bash
npx prisma db push --schema=./prisma/schema.prisma
\`\`\`

Este comando creará todas las tablas en la base de datos de Railway.

---

## 🎯 PASO 7: Obtener tu URL Pública

1. En Railway, ve a tu servicio de Next.js (tu aplicación)
2. Ve a la pestaña "Settings"
3. Busca la sección "Domains"
4. Haz clic en "Generate Domain"
5. Railway te dará una URL como: `https://cafeteria-pantojito-production.up.railway.app`

**¡Esa es tu URL pública!** Cualquier persona desde cualquier IP puede acceder a ella.

---

## 🎯 PASO 8: Migrar los Datos de XAMPP a Railway

### 8.1 Exportar datos de XAMPP
1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Selecciona tu base de datos `cafeteria_pantojito`
3. Haz clic en "Exportar"
4. Selecciona "Rápido" y formato "SQL"
5. Haz clic en "Continuar"
6. Se descargará un archivo `.sql`

### 8.2 Importar datos a Railway

**Opción A: Usar TablePlus (Recomendado)**
1. Descarga TablePlus: https://tableplus.com
2. Instálalo
3. Abre TablePlus
4. Haz clic en "Create a new connection"
5. Selecciona "MySQL"
6. Llena los datos de Railway:
   - **Host:** `interchange.proxy.rlwy.net`
   - **Port:** `36883`
   - **User:** `root`
   - **Password:** `PSfmsbAsvnBbAomcIHUFJbqHRHlultcz`
   - **Database:** `railway`
7. Haz clic en "Connect"
8. Haz clic derecho en la base de datos → "Import" → "From SQL Dump"
9. Selecciona el archivo `.sql` que exportaste de XAMPP
10. Haz clic en "Import"

**Opción B: Usar MySQL Workbench**
1. Descarga MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Instálalo
3. Abre MySQL Workbench
4. Crea una nueva conexión con los datos de Railway
5. Ve a "Server" → "Data Import"
6. Selecciona "Import from Self-Contained File"
7. Selecciona el archivo `.sql` de XAMPP
8. Haz clic en "Start Import"

---

## ✅ PASO 9: Verificar que Todo Funciona

1. Abre tu URL de Railway en el navegador
2. Deberías ver tu página de Cafetería Pantojito
3. Intenta registrarte con un nuevo usuario
4. Intenta iniciar sesión
5. Verifica que los productos aparezcan

---

## 🎉 ¡LISTO!

Ahora tu aplicación está en internet y cualquier persona desde cualquier IP puede acceder.

---

## 🔄 ¿Cómo Actualizar tu Aplicación?

Cada vez que hagas cambios en Visual Studio Code:

\`\`\`bash
git add .
git commit -m "Descripción de los cambios"
git push
\`\`\`

Railway automáticamente detectará los cambios y actualizará tu aplicación en 2-3 minutos.

---

## 🆘 Problemas Comunes

### Error: "git: command not found"
- Instala Git: https://git-scm.com/download/win
- Reinicia Visual Studio Code

### Error: "Permission denied (publickey)"
- Configura tu email en Git:
  \`\`\`bash
  git config --global user.email "tu-email@gmail.com"
  git config --global user.name "Tu Nombre"
  \`\`\`

### Error: "Build failed" en Railway
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Railway (pestaña "Deployments")

### La página no carga
- Espera 2-3 minutos después del despliegue
- Verifica que el dominio esté generado en Railway
- Revisa los logs en Railway

---

## 📞 Resumen Rápido

1. ✅ Instalar Git
2. ✅ Crear cuenta en GitHub
3. ✅ Subir código a GitHub desde VS Code
4. ✅ Conectar Railway con GitHub
5. ✅ Configurar variables de entorno en Railway
6. ✅ Crear tablas con Prisma
7. ✅ Generar dominio público
8. ✅ Migrar datos de XAMPP a Railway
9. ✅ ¡Disfrutar tu aplicación en internet!
