# Ejecutar Script SQL en Railway

## Opción 1: Desde tu computadora con MySQL Client

Si tienes MySQL instalado localmente:

1. **Obtén las credenciales de Railway:**
   - Ve a Railway → MySQL → Variables
   - Copia los valores de:
     - MYSQLHOST
     - MYSQLPORT
     - MYSQLUSER
     - MYSQLPASSWORD
     - MYSQLDATABASE

2. **Ejecuta el script desde terminal:**

\`\`\`bash
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < scripts/actualizar-orders-tabla.sql
\`\`\`

Ejemplo:
\`\`\`bash
mysql -h monorail.proxy.rlwy.net -P 12345 -u root -pTU_PASSWORD railway < scripts/actualizar-orders-tabla.sql
\`\`\`

## Opción 2: Copiar y pegar en Railway CLI

1. **Instala Railway CLI** (si no lo tienes):
\`\`\`bash
npm i -g @railway/cli
\`\`\`

2. **Inicia sesión:**
\`\`\`bash
railway login
\`\`\`

3. **Conecta a tu proyecto:**
\`\`\`bash
railway link
\`\`\`

4. **Ejecuta el script:**
\`\`\`bash
railway run mysql -u root -p < scripts/actualizar-orders-tabla.sql
\`\`\`

## Opción 3: Usar TablePlus o DBeaver (MÁS FÁCIL)

1. **Descarga TablePlus** (gratis): https://tableplus.com/
   - O DBeaver: https://dbeaver.io/

2. **Crea nueva conexión MySQL:**
   - Host: [MYSQLHOST de Railway]
   - Port: [MYSQLPORT de Railway]
   - User: [MYSQLUSER de Railway]
   - Password: [MYSQLPASSWORD de Railway]
   - Database: [MYSQLDATABASE de Railway]

3. **Conecta y ejecuta:**
   - Abre el archivo `actualizar-orders-tabla.sql`
   - Selecciona todo el código
   - Haz clic en "Run" o presiona Ctrl+Enter

## Verificar que funcionó

Después de ejecutar, verifica en Railway:
1. Ve a Database → Data → Tables
2. Haz clic en la tabla "Order"
3. Deberías ver las nuevas columnas

---

**¿Cuál método usaste antes para crear las tablas iniciales?** Usa el mismo método ahora.
