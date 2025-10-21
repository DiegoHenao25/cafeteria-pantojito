# Conectar tu Proyecto a Railway - Paso a Paso

## Paso 1: Copiar la URL de la Base de Datos

En la imagen que me mostraste, tienes estas variables. La que necesitas es:

**MYSQL_PUBLIC_URL:**
\`\`\`
mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
\`\`\`

Esta es tu URL de conexión a la base de datos.

---

## Paso 2: Configurar Variables de Entorno en Railway

1. **En Railway, ve a tu proyecto de Next.js** (no el de MySQL, sino el de tu aplicación web)

2. **Haz clic en la pestaña "Variables"**

3. **Agrega estas 4 variables:**

### Variable 1: DATABASE_URL
\`\`\`
Nombre: DATABASE_URL
Valor: mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
\`\`\`
(Copia exactamente el MYSQL_PUBLIC_URL que te aparece en tu Railway)

### Variable 2: JWT_SECRET
\`\`\`
Nombre: JWT_SECRET
Valor: tu-secreto-super-seguro-cambialo-por-algo-aleatorio-123456
\`\`\`
(Puedes usar cualquier texto largo y aleatorio)

### Variable 3: EMAIL_USER
\`\`\`
Nombre: EMAIL_USER
Valor: tu-correo@gmail.com
\`\`\`
(Tu correo de Gmail)

### Variable 4: EMAIL_PASSWORD
\`\`\`
Nombre: EMAIL_PASSWORD
Valor: tu-contraseña-de-aplicacion-16-digitos
\`\`\`
(La contraseña de aplicación de Gmail que generaste)

4. **Haz clic en "Add" o "Save" después de cada variable**

---

## Paso 3: Crear las Tablas en la Base de Datos de Railway

Ahora necesitas crear las tablas en la base de datos de Railway. Tienes 2 opciones:

### Opción A: Usar Prisma (Recomendado)

1. **En tu proyecto local (Visual Studio Code), abre el archivo `.env`**

2. **Cambia temporalmente el DATABASE_URL:**
\`\`\`env
DATABASE_URL="mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway"
\`\`\`

3. **Abre la terminal en VS Code y ejecuta:**
\`\`\`bash
npx prisma db push
\`\`\`

Esto creará todas las tablas automáticamente en Railway.

4. **Después, vuelve a cambiar el DATABASE_URL a tu XAMPP local:**
\`\`\`env
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"
\`\`\`

### Opción B: Copiar manualmente desde phpMyAdmin

1. **Abre phpMyAdmin:** http://localhost/phpmyadmin

2. **Selecciona tu base de datos:** `cafeteria_pantojito`

3. **Haz clic en "Exportar"**

4. **Selecciona:**
   - Formato: SQL
   - Método: Rápido
   - Haz clic en "Continuar"

5. **Se descargará un archivo `.sql`**

6. **Ahora ve a Railway:**
   - Haz clic en tu servicio MySQL
   - Haz clic en "Connect"
   - Copia el comando que aparece (algo como: `mysql -h interchange.proxy.rlwy.net -u root -p railway`)

7. **Abre tu terminal y ejecuta ese comando**

8. **Cuando te pida la contraseña, pega:** `PSfmsbAsvnBbAomcIHUFJbqHRHlultcz`

9. **Una vez conectado, ejecuta:**
\`\`\`sql
source ruta/al/archivo/descargado.sql
\`\`\`

---

## Paso 4: Verificar que Todo Funcione

1. **En Railway, tu proyecto debería redesplegar automáticamente**

2. **Espera 2-3 minutos**

3. **Haz clic en tu proyecto y busca la URL pública** (algo como: `https://tu-proyecto.up.railway.app`)

4. **Abre esa URL en tu navegador**

5. **Deberías ver tu página funcionando**

---

## Paso 5: Probar desde Otro Dispositivo

1. **Copia la URL de Railway** (ejemplo: `https://tu-proyecto.up.railway.app`)

2. **Abre esa URL desde tu celular, tablet, o cualquier otra computadora**

3. **Debería funcionar desde cualquier dispositivo con cualquier IP**

---

## Resumen Visual

\`\`\`
Tu PC Local (XAMPP)          Railway (Nube)
┌─────────────────┐         ┌─────────────────┐
│  localhost:3000 │         │  tu-app.railway │
│                 │         │                 │
│  Base de datos  │  ───>   │  Base de datos  │
│  XAMPP (local)  │ Migrar  │  MySQL (nube)   │
└─────────────────┘         └─────────────────┘
                                    │
                                    │ Accesible desde
                                    │ cualquier IP
                                    ▼
                            ┌─────────────────┐
                            │  Cualquier      │
                            │  dispositivo    │
                            │  en el mundo    │
                            └─────────────────┘
\`\`\`

---

## Solución de Problemas

### Error: "Can't connect to MySQL server"
- Verifica que copiaste correctamente el MYSQL_PUBLIC_URL
- Asegúrate de estar usando el URL PÚBLICO, no el interno

### Error: "Table doesn't exist"
- Necesitas crear las tablas con `npx prisma db push`
- O importar el SQL desde phpMyAdmin

### La página no carga
- Espera 2-3 minutos después de agregar las variables
- Revisa los logs en Railway (pestaña "Deployments")

### No puedo acceder desde mi celular
- Asegúrate de estar usando la URL de Railway (https://...)
- NO uses localhost:3000, eso solo funciona en tu PC

---

## Siguiente Paso

Una vez que todo funcione en Railway, puedes:
1. Seguir desarrollando en tu PC con XAMPP (localhost)
2. Cuando quieras actualizar la página pública, haces `git push`
3. Railway actualiza automáticamente en 2-3 minutos
