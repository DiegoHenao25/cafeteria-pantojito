# 🚀 Guía Simple: Desplegar tu Cafetería en Internet

## ¿Cómo funciona?

1. **Subes tu código a GitHub** (desde Visual Studio Code)
2. **Conectas GitHub con Railway** (o Render, Fly.io, etc.)
3. **Railway automáticamente crea la URL pública**
4. **Cualquier persona puede entrar desde cualquier IP**

---

## 📋 Pasos Completos (30 minutos)

### PASO 1: Crear cuenta en GitHub (5 minutos)

1. Ve a: https://github.com
2. Haz clic en "Sign up"
3. Crea tu cuenta (gratis)

---

### PASO 2: Subir tu proyecto a GitHub desde VS Code (10 minutos)

1. **Abre tu proyecto en Visual Studio Code**

2. **Abre la terminal en VS Code** (Ctrl + `)

3. **Copia y pega estos comandos uno por uno:**

\`\`\`bash
git init
\`\`\`

\`\`\`bash
git add .
\`\`\`

\`\`\`bash
git commit -m "Primera versión de Cafetería Pantojito"
\`\`\`

4. **Ve a GitHub y crea un nuevo repositorio:**
   - Ve a: https://github.com/new
   - Nombre: `cafeteria-pantojito`
   - Déjalo en "Public"
   - NO marques ninguna casilla
   - Haz clic en "Create repository"

5. **GitHub te mostrará unos comandos, cópialos y pégalos en la terminal de VS Code**

   Se verán algo así:
   \`\`\`bash
   git remote add origin https://github.com/TU-USUARIO/cafeteria-pantojito.git
   git branch -M main
   git push -u origin main
   \`\`\`

✅ **Tu código ya está en GitHub**

---

### PASO 3: Crear cuenta en Railway (2 minutos)

1. Ve a: https://railway.app
2. Haz clic en "Login"
3. Selecciona "Login with GitHub"
4. Autoriza Railway

✅ **Cuenta creada**

---

### PASO 4: Crear base de datos MySQL en Railway (3 minutos)

1. En Railway, haz clic en "New Project"
2. Selecciona "Provision MySQL"
3. Espera 30 segundos
4. Haz clic en la base de datos MySQL
5. Ve a la pestaña "Variables"
6. Copia el valor de `DATABASE_URL` (lo necesitarás después)

✅ **Base de datos creada**

---

### PASO 5: Importar tus datos de XAMPP a Railway (5 minutos)

1. **Exportar datos de XAMPP:**
   - Abre phpMyAdmin: http://localhost/phpmyadmin
   - Selecciona tu base de datos `cafeteria_pantojito`
   - Haz clic en "Exportar"
   - Deja todo por defecto
   - Haz clic en "Continuar"
   - Se descargará un archivo `.sql`

2. **Importar a Railway:**
   - En Railway, haz clic en tu base de datos MySQL
   - Ve a la pestaña "Data"
   - Haz clic en "Connect"
   - Se abrirá una interfaz web
   - Haz clic en "Import"
   - Selecciona el archivo `.sql` que descargaste
   - Espera a que termine

✅ **Datos migrados**

---

### PASO 6: Desplegar tu aplicación en Railway (5 minutos)

1. **En Railway, haz clic en "New"**
2. **Selecciona "Deploy from GitHub repo"**
3. **Selecciona tu repositorio `cafeteria-pantojito`**
4. **Railway detectará automáticamente que es Next.js**
5. **Haz clic en tu proyecto desplegado**
6. **Ve a "Variables"**
7. **Agrega estas variables:**

   \`\`\`
   DATABASE_URL = (pega el DATABASE_URL que copiaste antes)
   JWT_SECRET = tu-secreto-super-seguro-123456
   EMAIL_USER = tu-correo@gmail.com
   EMAIL_PASSWORD = tu-contraseña-de-aplicacion-16-digitos
   \`\`\`

8. **Haz clic en "Deploy"**

9. **Espera 2-3 minutos**

10. **Ve a "Settings" → "Domains"**

11. **Haz clic en "Generate Domain"**

✅ **¡Tu aplicación ya está en internet!**

---

## 🎉 ¡Listo! Tu URL pública

Railway te dará una URL como:

\`\`\`
https://cafeteria-pantojito-production.up.railway.app
\`\`\`

**Copia esa URL y compártela con quien quieras.**

Cualquier persona desde cualquier dispositivo y cualquier IP puede entrar.

---

## 🔄 ¿Cómo actualizar cuando hagas cambios?

Cada vez que hagas cambios en tu código:

1. **Abre la terminal en VS Code**

2. **Copia y pega estos comandos:**

\`\`\`bash
git add .
\`\`\`

\`\`\`bash
git commit -m "Descripción de tus cambios"
\`\`\`

\`\`\`bash
git push
\`\`\`

3. **Railway detectará los cambios automáticamente y actualizará tu sitio en 2-3 minutos**

---

## 📱 Probar desde tu celular

1. Abre el navegador de tu celular
2. Escribe la URL de Railway
3. ¡Funciona!

---

## 💡 Ventajas de este método

✅ **URL pública** - Cualquiera puede entrar desde cualquier lugar
✅ **Actualización automática** - Solo haces `git push` y se actualiza
✅ **Base de datos en la nube** - Todos ven los mismos datos
✅ **Gratis** - Railway te da $5 de crédito gratis al mes
✅ **HTTPS automático** - Tu sitio es seguro
✅ **No necesitas XAMPP** - Todo está en la nube

---

## ❓ Preguntas Frecuentes

### ¿Puedo seguir trabajando en mi PC local?

Sí, puedes seguir usando XAMPP en tu PC para desarrollo. Cuando termines tus cambios, haces `git push` y se actualiza en Railway.

### ¿Los datos se sincronizan automáticamente?

No. Los datos en XAMPP (local) y Railway (nube) son independientes. Si quieres que todos vean los mismos datos, debes usar solo la base de datos de Railway.

### ¿Cómo conecto mi PC local a la base de datos de Railway?

En tu archivo `.env` local, cambia el `DATABASE_URL` por el de Railway:

\`\`\`env
DATABASE_URL="mysql://root:CONTRASEÑA@SERVIDOR:3306/railway"
\`\`\`

Así tu PC local usará la misma base de datos que la versión en internet.

### ¿Cuánto cuesta?

Railway te da **$5 de crédito gratis al mes**. Para una aplicación pequeña como esta, es suficiente. Si se acaba, puedes agregar una tarjeta y pagar solo lo que uses (aprox $5-10/mes).

### ¿Puedo usar otro servicio en lugar de Railway?

Sí, puedes usar:
- **Render** (100% gratis pero más lento)
- **Fly.io** (gratis con límites)
- **DigitalOcean** ($5/mes)

El proceso es similar.

---

## 🆘 Problemas Comunes

### Error: "git: command not found"

Instala Git:
- Windows: https://git-scm.com/download/win
- Reinicia VS Code después de instalar

### Error al hacer push a GitHub

Si te pide usuario y contraseña, usa un "Personal Access Token":
1. Ve a: https://github.com/settings/tokens
2. Genera un nuevo token
3. Usa ese token como contraseña

### La aplicación no carga en Railway

1. Revisa los logs en Railway (pestaña "Deployments")
2. Verifica que las variables de entorno estén correctas
3. Asegúrate de que el `DATABASE_URL` sea correcto

---

## 📞 Resumen

1. **Subes código a GitHub** → `git push`
2. **Railway detecta cambios** → Construye automáticamente
3. **Te da URL pública** → `https://tu-app.up.railway.app`
4. **Cualquiera puede entrar** → Desde cualquier IP

**Es así de simple.**
