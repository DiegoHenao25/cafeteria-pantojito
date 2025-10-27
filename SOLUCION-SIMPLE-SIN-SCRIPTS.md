# Solución Simple - Actualizar Base de Datos sin Scripts

## El Problema

La tabla "Order" causa errores porque es una palabra reservada de MySQL. Railway no puede consultarla correctamente.

## Solución Fácil - Desde Railway Directamente

### Paso 1: Conectar a Railway con Query Editor

1. Ve a Railway → Tu proyecto MySQL
2. Haz clic en el botón **"Connect"** (arriba a la derecha, botón morado)
3. En el menú que aparece, busca la opción **"Query"** o haz clic en cualquier opción que diga "MySQL Client"
4. Se abrirá una terminal o editor SQL

### Paso 2: Copiar y Pegar este Código SQL

Copia TODO este código y pégalo en el editor:

\`\`\`sql
-- Agregar nuevas columnas a la tabla Order
ALTER TABLE `Order` 
ADD COLUMN customer_name VARCHAR(100) AFTER total,
ADD COLUMN customer_lastname VARCHAR(100) AFTER customer_name,
ADD COLUMN customer_id VARCHAR(50) AFTER customer_lastname,
ADD COLUMN customer_phone VARCHAR(20) AFTER customer_id,
ADD COLUMN customer_email VARCHAR(100) AFTER customer_phone,
ADD COLUMN pickup_time INT AFTER customer_email,
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'pending' AFTER pickup_time,
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' AFTER payment_method,
ADD COLUMN transaction_id VARCHAR(255) AFTER payment_status;
\`\`\`

### Paso 3: Ejecutar

1. Presiona Enter o haz clic en "Execute" / "Run"
2. Deberías ver un mensaje de éxito
3. Cierra el editor

### Paso 4: Verificar

1. Regresa a Database → Data → Tables
2. Haz clic en "Order"
3. Ahora deberías ver las nuevas columnas sin errores

## Si No Encuentras el Query Editor

**Alternativa - Usar TablePlus o MySQL Workbench:**

1. En Railway, haz clic en "Connect" → Copia las credenciales:
   - Host
   - Port
   - Username
   - Password
   - Database

2. Descarga TablePlus (gratis): https://tableplus.com/
   O MySQL Workbench: https://dev.mysql.com/downloads/workbench/

3. Crea una nueva conexión con las credenciales de Railway

4. Pega el código SQL de arriba y ejecútalo

## Siguiente Paso

Una vez actualizada la base de datos, continúa con:
**CONFIGURAR-WOMPI-PAGOS-COLOMBIA.md**
