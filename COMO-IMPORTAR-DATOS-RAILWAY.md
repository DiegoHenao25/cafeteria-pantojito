# CÓMO IMPORTAR TUS DATOS A RAILWAY - PASO A PASO

## PASO 1: Abrir Railway

1. Ve a: https://railway.app
2. Inicia sesión
3. Haz clic en tu proyecto
4. Haz clic en el servicio **MySQL** (el que creaste)

---

## PASO 2: Abrir la consola de base de datos

1. En el servicio MySQL, busca las pestañas en la parte superior
2. Haz clic en la pestaña **"Data"**
3. Haz clic en el botón **"Query"** (o "Consulta")
4. Se abrirá un editor de texto donde puedes escribir SQL

---

## PASO 3: Copiar y pegar los datos

1. **Abre el archivo:** `scripts/importar-datos-railway.sql` (que acabo de crear)
2. **Selecciona TODO el contenido** (Ctrl + A)
3. **Copia** (Ctrl + C)
4. **Vuelve a Railway**
5. **Pega** en el editor de consultas (Ctrl + V)
6. **Haz clic en "Run Query"** o "Ejecutar"

---

## PASO 4: Verificar que se importó correctamente

1. En Railway, en la pestaña "Data"
2. Verás una lista de tablas a la izquierda
3. Haz clic en cada tabla para ver los datos:
   - **Category**: Debe tener 1 categoría (Bebidas)
   - **Product**: Debe tener 1 producto (Pony Malta)
   - **User**: Debe tener 3 usuarios (incluyendo tu admin)
   - **Order**: Debe tener 1 pedido
   - **OrderItem**: Debe tener 1 item

---

## ✅ LISTO

Tus datos de XAMPP ahora están en Railway.

---

## SIGUIENTE PASO: Configurar Vercel

Ahora que tienes los datos en Railway, el siguiente paso es configurar las variables de entorno en Vercel y desplegar tu aplicación.

¿Listo para continuar con Vercel?
