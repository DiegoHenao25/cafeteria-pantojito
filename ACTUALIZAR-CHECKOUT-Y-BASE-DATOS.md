# Guía: Actualizar Checkout y Base de Datos

## Paso 1: Actualizar la Base de Datos

### Opción A: Desde Railway (Recomendado)

1. Ve a Railway: https://railway.app
2. Entra a tu proyecto de base de datos
3. Haz clic en la pestaña **"Query"** o **"Data"**
4. Copia y pega este SQL:

\`\`\`sql
-- Agregar nuevas columnas a la tabla orders
ALTER TABLE orders 
ADD COLUMN customer_name VARCHAR(255),
ADD COLUMN customer_lastname VARCHAR(255),
ADD COLUMN customer_document VARCHAR(50),
ADD COLUMN customer_phone VARCHAR(20),
ADD COLUMN customer_email VARCHAR(255),
ADD COLUMN pickup_time VARCHAR(20),
ADD COLUMN payment_method VARCHAR(50);
\`\`\`

5. Haz clic en **"Execute"** o **"Run"**
6. Verifica que diga "Success" o "Query executed successfully"

### Opción B: Desde el proyecto (si tienes acceso local)

1. Abre VS Code
2. Ve a la carpeta `scripts`
3. Busca el archivo `update-orders-schema.sql`
4. Copia todo el contenido
5. Ejecuta el SQL en Railway como se explicó arriba

## Paso 2: Descargar e Instalar los Nuevos Archivos

### 2.1 Descargar el ZIP

1. En v0, haz clic en los 3 puntos (...) arriba a la derecha
2. Selecciona **"Download ZIP"**
3. Guarda el archivo en tu computadora

### 2.2 Extraer y Copiar Archivos

1. Descomprime el ZIP descargado
2. Abre tu carpeta del proyecto actual en VS Code
3. Copia estos archivos del ZIP a tu proyecto:
   - `app/checkout/page.tsx` (reemplaza el existente)
   - `app/api/orders/route.ts` (reemplaza el existente)
   - `prisma/schema.prisma` (reemplaza el existente)

### 2.3 Verificar Archivos Actualizados

Asegúrate de que estos archivos tengan los nuevos campos:
- ✅ Nombre y apellido
- ✅ Cédula/documento
- ✅ Teléfono
- ✅ Correo
- ✅ Tiempo de recogida (15, 20, 30, 45 minutos)
- ✅ Método de pago

## Paso 3: Instalar Dependencias (si es necesario)

Abre la terminal en VS Code y ejecuta:

\`\`\`bash
npm install
\`\`\`

## Paso 4: Subir Cambios a GitHub

\`\`\`bash
git add .
git commit -m "feat: Mejorar checkout con datos personales y tiempo de recogida"
git push
\`\`\`

## Paso 5: Verificar en Vercel

1. Ve a Vercel: https://vercel.com
2. Espera 2-3 minutos a que termine el despliegue
3. Verás un check verde cuando esté listo

## Paso 6: Probar el Nuevo Checkout

1. Ve a tu sitio: https://cafeteria-pantojito.vercel.app
2. Agrega productos al carrito
3. Ve al checkout
4. Verifica que aparezcan todos los nuevos campos:
   - Nombre y Apellido
   - Cédula
   - Teléfono
   - Correo
   - Tiempo de recogida
   - Método de pago

## Problemas Comunes

### Error: "Column already exists"
- Significa que la columna ya existe en la base de datos
- Puedes ignorar este error o eliminar esa línea del SQL

### Error: "Table doesn't exist"
- Verifica que estés conectado a la base de datos correcta en Railway
- Asegúrate de que la tabla `orders` exista

### Los cambios no se ven en el sitio
- Espera a que Vercel termine de desplegar (2-3 minutos)
- Limpia la caché del navegador (Ctrl + Shift + R)
- Verifica que el push a GitHub fue exitoso

## Siguiente Paso

Una vez que todo funcione, continúa con la configuración de la pasarela de pago en el archivo:
**CONFIGURAR-PASARELA-PAGO-STRIPE.md**
