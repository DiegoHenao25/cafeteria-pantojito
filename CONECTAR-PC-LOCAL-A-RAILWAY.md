# 🔗 Conectar tu PC Local a la Base de Datos de Railway

Si quieres trabajar en tu PC local pero usar la misma base de datos que está en Railway (para que todos vean los mismos datos), sigue estos pasos:

---

## 📋 Pasos

### PASO 1: Obtener la URL de la base de datos de Railway

1. Ve a Railway: https://railway.app
2. Abre tu proyecto
3. Haz clic en la base de datos MySQL
4. Ve a la pestaña "Variables"
5. Copia el valor completo de `DATABASE_URL`

Se verá algo así:
\`\`\`
mysql://root:CONTRASEÑA@SERVIDOR.railway.app:3306/railway
\`\`\`

---

### PASO 2: Actualizar tu archivo .env local

1. **Abre tu proyecto en Visual Studio Code**

2. **Abre el archivo `.env`**

3. **Reemplaza el `DATABASE_URL` actual por el de Railway:**

\`\`\`env
# Base de datos Railway (en la nube)
DATABASE_URL="mysql://root:CONTRASEÑA@SERVIDOR.railway.app:3306/railway"

# JWT Secret
JWT_SECRET="tu-secreto-super-seguro-123456"

# Email
EMAIL_USER="tu-correo@gmail.com"
EMAIL_PASSWORD="tu-contraseña-de-aplicacion-16-digitos"
\`\`\`

4. **Guarda el archivo**

---

### PASO 3: Regenerar Prisma

\`\`\`bash
npx prisma generate
\`\`\`

---

### PASO 4: Iniciar tu servidor local

\`\`\`bash
npm run dev
\`\`\`

---

## ✅ ¡Listo!

Ahora tu PC local está usando la misma base de datos que Railway.

**Esto significa:**
- ✅ Los productos que agregues desde tu PC se verán en la versión en internet
- ✅ Los usuarios que se registren en internet se verán en tu PC
- ✅ Todo está sincronizado automáticamente

---

## 🔄 Trabajar con dos bases de datos

Si quieres tener una base de datos para desarrollo (local) y otra para producción (Railway):

### Opción 1: Usar dos archivos .env

1. **Crea `.env.local`** (para desarrollo):
\`\`\`env
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"
\`\`\`

2. **Crea `.env.production`** (para Railway):
\`\`\`env
DATABASE_URL="mysql://root:CONTRASEÑA@SERVIDOR.railway.app:3306/railway"
\`\`\`

3. **Cambia entre ellos según necesites**

### Opción 2: Comentar/descomentar

En tu archivo `.env`:

\`\`\`env
# Desarrollo (local con XAMPP)
# DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"

# Producción (Railway)
DATABASE_URL="mysql://root:CONTRASEÑA@SERVIDOR.railway.app:3306/railway"
\`\`\`

Comenta/descomenta según lo que necesites.

---

## 💡 Recomendación

Para evitar confusiones, te recomiendo:

1. **Usa Railway para todo** (desarrollo y producción)
2. **Deja de usar XAMPP**
3. **Todos los cambios se reflejan automáticamente**

Así no tienes que estar sincronizando bases de datos manualmente.
