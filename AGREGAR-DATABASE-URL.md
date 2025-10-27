# Agregar DATABASE_URL a .env.local

## Paso 1: Crear o editar .env.local

En la raíz de tu proyecto, crea o edita el archivo `.env.local` y agrega:

\`\`\`env
DATABASE_URL=mysql://root:P$fmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
\`\`\`

**Importante:** Usa el valor de `MYSQL_PUBLIC_URL` que viste en Railway.

## Paso 2: Ejecutar el script

\`\`\`bash
node scripts/actualizar-db.js
\`\`\`

## Alternativa: Copiar todas las variables

Si prefieres, copia todas las variables de Railway a tu `.env.local`:

\`\`\`env
DATABASE_URL=mysql://root:P$fmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
MYSQL_PUBLIC_URL=mysql://root:P$fmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway
MYSQL_URL=mysql://root:P$fmsbAsvnBbAomcIHUFJbqHRHlultcz@mysql.railway.internal:3306/railway
MYSQL_DATABASE=railway
MYSQL_ROOT_PASSWORD=P$fmsbAsvnBbAomcIHUFJbqHRHlultcz
MYSQLHOST=mysql.railway.internal
MYSQLPASSWORD=P$fmsbAsvnBbAomcIHUFJbqHRHlultcz
MYSQLPORT=3306
MYSQLUSER=root
\`\`\`

Luego ejecuta:
\`\`\`bash
node scripts/actualizar-db.js
