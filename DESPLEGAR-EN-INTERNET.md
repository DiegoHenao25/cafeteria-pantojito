# 🌐 Desplegar Cafetería Pantojito en Internet
## Acceso desde Cualquier IP y Dispositivo

Esta guía te muestra cómo desplegar tu aplicación para que **cualquier persona desde cualquier lugar** pueda acceder con una URL pública.

---

## 🎯 ¿Qué Necesitas?

Para que tu aplicación funcione desde cualquier IP necesitas:

1. ✅ **Hosting en la nube** - Servidor que esté siempre encendido
2. ✅ **Base de datos en la nube** - Reemplazar XAMPP por una base de datos online
3. ✅ **URL pública** - Dirección web que cualquiera pueda visitar

---

## 📊 Opciones de Hosting (Alternativas a Vercel)

### 🟢 Opción 1: Railway (RECOMENDADO - Fácil y Gratis)

**Ventajas:**
- ✅ Gratis para empezar ($5 de crédito gratis al mes)
- ✅ Base de datos MySQL incluida
- ✅ Muy fácil de usar
- ✅ Deploy automático desde GitHub

**Pasos:**

1. **Crear cuenta en Railway**
   - Ve a: https://railway.app
   - Regístrate con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio de GitHub

3. **Agregar base de datos MySQL**
   - En tu proyecto, click en "New"
   - Selecciona "Database" → "MySQL"
   - Railway creará automáticamente la base de datos

4. **Configurar variables de entorno**
   - Click en tu servicio de Next.js
   - Ve a "Variables"
   - Agrega estas variables:

   \`\`\`
   DATABASE_URL=${{MySQL.DATABASE_URL}}
   JWT_SECRET=tu-secreto-super-seguro-123456
   EMAIL_USER=tu-correo@gmail.com
   EMAIL_PASSWORD=tu-contraseña-aplicacion-16-digitos
   \`\`\`

5. **Importar tu base de datos**
   - Exporta tu base de datos de XAMPP (ver sección abajo)
   - En Railway, click en tu base de datos MySQL
   - Click en "Connect" → "MySQL Client"
   - Copia el comando de conexión
   - Abre tu terminal y pega el comando
   - Ejecuta: `source ruta/a/tu/backup.sql`

6. **Deploy automático**
   - Railway detectará Next.js automáticamente
   - Click en "Deploy"
   - Espera 2-5 minutos
   - ¡Listo! Tendrás una URL como: `https://tu-app.up.railway.app`

---

### 🔵 Opción 2: Render (100% Gratis)

**Ventajas:**
- ✅ Completamente gratis
- ✅ No requiere tarjeta de crédito
- ✅ Base de datos PostgreSQL gratis

**Pasos:**

1. **Crear cuenta en Render**
   - Ve a: https://render.com
   - Regístrate con GitHub

2. **Crear base de datos PostgreSQL**
   - Click en "New +" → "PostgreSQL"
   - Nombre: `cafeteria-pantojito-db`
   - Plan: Free
   - Click en "Create Database"
   - Copia la "Internal Database URL"

3. **Actualizar Prisma para PostgreSQL**
   
   Edita `prisma/schema.prisma`:
   \`\`\`prisma
   datasource db {
     provider = "postgresql"  // Cambiar de mysql a postgresql
     url      = env("DATABASE_URL")
   }
   \`\`\`

4. **Crear Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - Name: `cafeteria-pantojito`
     - Environment: `Node`
     - Build Command: `npm install && npx prisma generate && npm run build`
     - Start Command: `npm start`

5. **Configurar variables de entorno**
   \`\`\`
   DATABASE_URL=tu-url-de-postgresql-de-render
   JWT_SECRET=tu-secreto-super-seguro-123456
   EMAIL_USER=tu-correo@gmail.com
   EMAIL_PASSWORD=tu-contraseña-aplicacion-16-digitos
   \`\`\`

6. **Deploy**
   - Click en "Create Web Service"
   - Espera 5-10 minutos
   - ¡Listo! Tendrás una URL como: `https://cafeteria-pantojito.onrender.com`

---

### 🟣 Opción 3: Fly.io (Gratis con límites generosos)

**Ventajas:**
- ✅ Gratis hasta 3 aplicaciones
- ✅ Muy rápido
- ✅ Servidores en múltiples regiones

**Pasos:**

1. **Instalar Fly CLI**
   \`\`\`bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   \`\`\`

2. **Crear cuenta y login**
   \`\`\`bash
   fly auth signup
   fly auth login
   \`\`\`

3. **Inicializar proyecto**
   \`\`\`bash
   fly launch
   \`\`\`
   
   Responde:
   - App name: `cafeteria-pantojito`
   - Region: Elige la más cercana
   - PostgreSQL: Yes
   - Redis: No

4. **Configurar variables de entorno**
   \`\`\`bash
   fly secrets set JWT_SECRET="tu-secreto-super-seguro-123456"
   fly secrets set EMAIL_USER="tu-correo@gmail.com"
   fly secrets set EMAIL_PASSWORD="tu-contraseña-aplicacion-16-digitos"
   \`\`\`

5. **Deploy**
   \`\`\`bash
   fly deploy
   \`\`\`
   
   ¡Listo! Tendrás una URL como: `https://cafeteria-pantojito.fly.dev`

---

### 🟠 Opción 4: DigitalOcean App Platform

**Ventajas:**
- ✅ $200 de crédito gratis por 60 días
- ✅ Muy confiable
- ✅ Base de datos MySQL incluida

**Pasos:**

1. **Crear cuenta en DigitalOcean**
   - Ve a: https://www.digitalocean.com
   - Regístrate (requiere tarjeta pero no te cobran con el crédito gratis)

2. **Crear App**
   - Click en "Create" → "Apps"
   - Conecta tu repositorio de GitHub
   - Selecciona tu repositorio

3. **Agregar base de datos**
   - En la configuración, click en "Add Resource"
   - Selecciona "Database" → "MySQL"
   - Plan: Basic ($15/mes pero tienes $200 gratis)

4. **Configurar variables de entorno**
   \`\`\`
   DATABASE_URL=${db.DATABASE_URL}
   JWT_SECRET=tu-secreto-super-seguro-123456
   EMAIL_USER=tu-correo@gmail.com
   EMAIL_PASSWORD=tu-contraseña-aplicacion-16-digitos
   \`\`\`

5. **Deploy**
   - Click en "Create Resources"
   - Espera 5-10 minutos
   - ¡Listo! Tendrás una URL como: `https://cafeteria-pantojito-xxxxx.ondigitalocean.app`

---

## 📤 Exportar Base de Datos de XAMPP

Antes de desplegar, necesitas exportar tus datos actuales:

### Paso 1: Exportar desde phpMyAdmin

1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Selecciona la base de datos `cafeteria_pantojito`
3. Click en la pestaña "Exportar"
4. Método de exportación: "Rápido"
5. Formato: "SQL"
6. Click en "Continuar"
7. Se descargará un archivo `cafeteria_pantojito.sql`

### Paso 2: Importar a la base de datos en la nube

**Para Railway:**
\`\`\`bash
# Conectar a Railway MySQL
railway connect MySQL

# Importar el archivo
mysql -u root -p cafeteria_pantojito < cafeteria_pantojito.sql
\`\`\`

**Para Render (PostgreSQL):**
\`\`\`bash
# Primero convierte MySQL a PostgreSQL usando pgLoader o manualmente
# Luego conecta:
psql tu-url-de-postgresql < cafeteria_pantojito.sql
\`\`\`

---

## 🔄 Mantener Datos Sincronizados

Una vez desplegado en la nube, todos tus dispositivos usarán la misma base de datos:

- ✅ PC de escritorio → Misma base de datos en la nube
- ✅ Laptop → Misma base de datos en la nube
- ✅ Celular → Misma base de datos en la nube
- ✅ Cualquier dispositivo → Misma base de datos en la nube

**No necesitas XAMPP en cada dispositivo**, solo la URL de tu aplicación.

---

## 🎯 Resumen de Opciones

| Plataforma | Precio | Base de Datos | Facilidad | Recomendado Para |
|------------|--------|---------------|-----------|------------------|
| **Railway** | $5/mes gratis | MySQL incluida | ⭐⭐⭐⭐⭐ | **Mejor opción general** |
| **Render** | 100% gratis | PostgreSQL | ⭐⭐⭐⭐ | Sin tarjeta de crédito |
| **Fly.io** | Gratis (3 apps) | PostgreSQL | ⭐⭐⭐ | Desarrolladores avanzados |
| **DigitalOcean** | $200 gratis | MySQL incluida | ⭐⭐⭐⭐ | Producción seria |

---

## 🚀 Mi Recomendación

**Usa Railway** porque:
1. ✅ Es el más fácil de configurar
2. ✅ Incluye MySQL (no necesitas cambiar tu código)
3. ✅ Deploy automático desde GitHub
4. ✅ $5 gratis al mes (suficiente para empezar)
5. ✅ Puedes escalar fácilmente después

---

## 📱 Cómo Acceder Después del Deploy

Una vez desplegado, **cualquier persona** puede acceder:

\`\`\`
https://tu-app.railway.app
\`\`\`

Desde:
- ✅ Cualquier PC
- ✅ Cualquier celular
- ✅ Cualquier tablet
- ✅ Cualquier red WiFi
- ✅ Cualquier país
- ✅ Cualquier IP

**No importa dónde estés**, siempre verás los mismos datos.

---

## 🔧 Comandos Útiles para Railway

\`\`\`bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs en tiempo real
railway logs

# Abrir tu app en el navegador
railway open

# Conectar a la base de datos
railway connect MySQL
\`\`\`

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar mi dominio propio?
Sí, todas estas plataformas permiten conectar dominios personalizados como `www.cafeteriapantojito.com`

### ¿Qué pasa con XAMPP?
Ya no lo necesitas. La base de datos estará en la nube.

### ¿Puedo seguir desarrollando localmente?
Sí, puedes tener dos bases de datos:
- Una local (XAMPP) para desarrollo
- Una en la nube para producción

### ¿Los datos se sincronizan automáticamente?
Sí, porque todos los dispositivos usan la misma base de datos en la nube.

### ¿Es seguro?
Sí, todas estas plataformas usan HTTPS y encriptación.

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs de tu plataforma
2. Verifica que las variables de entorno estén correctas
3. Asegúrate de que la base de datos esté corriendo
4. Verifica que el `DATABASE_URL` sea correcto

---

## 📚 Próximos Pasos

1. ✅ Elige una plataforma (recomiendo Railway)
2. ✅ Exporta tu base de datos de XAMPP
3. ✅ Sube tu código a GitHub
4. ✅ Despliega en la plataforma elegida
5. ✅ Importa tu base de datos
6. ✅ Comparte la URL con quien quieras

¡Tu cafetería estará en internet y accesible desde cualquier lugar! 🎉
