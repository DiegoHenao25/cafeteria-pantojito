# Ejecutar Migración de Base de Datos - Forma Fácil

## Opción 1: Desde VS Code (Recomendada)

1. Abre la terminal en VS Code (Ctrl + `)

2. Ejecuta este comando:
\`\`\`bash
npx tsx scripts/migrate-orders.ts
\`\`\`

3. Verás un mensaje: "Migración completada exitosamente"

4. Listo! La base de datos está actualizada

## Opción 2: Desde Railway (Si la Opción 1 no funciona)

1. Ve a Railway → Tu base de datos MySQL
2. Haz clic en el botón **"Connect"** (arriba a la derecha)
3. Selecciona **"Query"** o busca el editor SQL
4. Copia y pega este código:

\`\`\`sql
ALTER TABLE `Order` 
ADD COLUMN IF NOT EXISTS customerName VARCHAR(255),
ADD COLUMN IF NOT EXISTS customerLastName VARCHAR(255),
ADD COLUMN IF NOT EXISTS customerDocument VARCHAR(50),
ADD COLUMN IF NOT EXISTS customerPhone VARCHAR(20),
ADD COLUMN IF NOT EXISTS customerEmail VARCHAR(255),
ADD COLUMN IF NOT EXISTS pickupTime VARCHAR(20),
ADD COLUMN IF NOT EXISTS paymentMethod VARCHAR(50),
ADD COLUMN IF NOT EXISTS paymentStatus VARCHAR(50) DEFAULT 'pending';
\`\`\`

5. Haz clic en "Execute" o "Run"

## Verificar que funcionó

1. En Railway, ve a Database → Data
2. Haz clic en la tabla "Order"
3. Deberías ver las nuevas columnas: customerName, customerLastName, etc.

## Siguiente Paso

Después de completar la migración, continúa con:
**CONFIGURAR-WOMPI-PAGOS-COLOMBIA.md**
