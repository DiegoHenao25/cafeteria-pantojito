# Comandos Rápidos para Railway

## Conectar tu Base de Datos Local a Railway

### 1. Cambiar temporalmente a Railway en .env

Abre `.env` y cambia:
\`\`\`env
DATABASE_URL="mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway"
\`\`\`

### 2. Crear las tablas en Railway

\`\`\`bash
npx prisma db push
\`\`\`

### 3. (Opcional) Copiar datos de XAMPP a Railway

\`\`\`bash
npx prisma db seed
\`\`\`

### 4. Volver a XAMPP local

Abre `.env` y cambia de nuevo:
\`\`\`env
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"
\`\`\`

---

## Subir Cambios a Railway

### 1. Guardar cambios en Git

\`\`\`bash
git add .
git commit -m "Descripción de tus cambios"
git push
\`\`\`

### 2. Railway actualiza automáticamente

Espera 2-3 minutos y tu página estará actualizada.

---

## Ver Logs de Railway

1. Ve a Railway.app
2. Haz clic en tu proyecto
3. Haz clic en "Deployments"
4. Haz clic en el último deployment
5. Verás los logs en tiempo real

---

## Conectarse a MySQL de Railway desde Terminal

\`\`\`bash
mysql -h interchange.proxy.rlwy.net -P 36883 -u root -p railway
\`\`\`

Cuando te pida la contraseña, pega:
\`\`\`
PSfmsbAsvnBbAomcIHUFJbqHRHlultcz
\`\`\`

---

## Variables de Entorno que Necesitas en Railway

\`\`\`
DATABASE_URL=mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
JWT_SECRET=tu-secreto-super-seguro-cambialo-por-algo-aleatorio-123456
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion-16-digitos
\`\`\`

---

## Workflow Completo

\`\`\`
1. Desarrollas en tu PC (localhost con XAMPP)
   ↓
2. Pruebas que todo funcione
   ↓
3. git add . && git commit -m "mensaje" && git push
   ↓
4. Railway detecta el push y despliega automáticamente
   ↓
5. Esperas 2-3 minutos
   ↓
6. Tu página está actualizada en internet
   ↓
7. Cualquier persona puede acceder desde cualquier IP
