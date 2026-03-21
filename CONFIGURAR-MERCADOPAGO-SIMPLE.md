# Configurar Mercado Pago - Guía Simple

## Por qué Mercado Pago es Perfecto para tu Proyecto

- **No necesitas RUT ni empresa** - Solo cuenta personal
- **Gratis para empezar** - Modo sandbox sin costo
- **Fácil de configurar** - 3 pasos y listo
- **El dinero llega a tu cuenta** - Luego lo transfieres a tu banco/Nequi
- **Acepta todo** - Nequi, PSE, tarjetas, Bancolombia, etc.

---

## PASO 1: Crear Cuenta en Mercado Pago (5 minutos)

### 1.1 Registro

1. Ve a: https://www.mercadopago.com.co
2. Haz clic en **"Crear cuenta"**
3. Completa:
   - Email: diego.henao@ucp.edu.co
   - Contraseña: (crea una segura)
   - Nombre completo: Diego Henao
   - Cédula: Tu número de cédula
4. Verifica tu email
5. Completa tu perfil

### 1.2 Activar Cuenta

1. Mercado Pago te pedirá verificar tu identidad
2. Sube foto de tu cédula (ambos lados)
3. Espera aprobación (1-24 horas)
4. Mientras tanto, puedes usar el **modo de prueba**

---

## PASO 2: Obtener las Claves API (2 minutos)

### 2.1 Ir a Credenciales

1. Inicia sesión en: https://www.mercadopago.com.co/developers
2. Ve a **"Tus integraciones"** → **"Credenciales"**
3. Verás dos modos:
   - **Modo Prueba** (para desarrollo)
   - **Modo Producción** (para dinero real)

### 2.2 Copiar Claves de Prueba

En la sección **"Credenciales de prueba"**, copia:

- **Public Key:** Empieza con `TEST-...`
- **Access Token:** Empieza con `TEST-...`

Guárdalas en un lugar seguro.

### 2.3 Copiar Claves de Producción (Opcional - para después)

Cuando tu cuenta esté verificada, en **"Credenciales de producción"**, copia:

- **Public Key:** Empieza con `APP_USR-...`
- **Access Token:** Empieza con `APP_USR-...`

---

## PASO 3: Configurar en tu Proyecto (3 minutos)

### 3.1 Agregar Variables de Entorno

Abre tu archivo `.env.local` y agrega:

\`\`\`env
# Mercado Pago - Modo Prueba
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aqui

# URL de tu app
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

**Reemplaza** `TEST-tu-public-key-aqui` y `TEST-tu-access-token-aqui` con tus claves reales.

### 3.2 Agregar en Vercel (Para producción)

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas 3 variables:

**Variable 1:**
- Key: `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- Value: Tu Public Key de Mercado Pago
- Environment: Marca las 3 opciones

**Variable 2:**
- Key: `MERCADOPAGO_ACCESS_TOKEN`
- Value: Tu Access Token de Mercado Pago
- Environment: Marca las 3 opciones

**Variable 3:**
- Key: `NEXT_PUBLIC_APP_URL`
- Value: `https://tu-proyecto.vercel.app`
- Environment: Production

5. Haz clic en **Save**

---

## PASO 4: Desplegar y Probar (5 minutos)

### 4.1 Hacer Commit y Push

\`\`\`bash
git add .
git commit -m "Integración de Mercado Pago"
git push
\`\`\`

### 4.2 Probar con Datos de Prueba

Mercado Pago te da tarjetas de prueba:

**Tarjeta Aprobada:**
- Número: `5031 7557 3453 0604`
- Vencimiento: Cualquier fecha futura (ej: 11/25)
- CVV: `123`
- Nombre: `APRO` (importante)
- DNI: `12345678`

**Tarjeta Rechazada:**
- Número: `5031 7557 3453 0604`
- Nombre: `OTROC` (importante)

**Nequi/PSE de Prueba:**
- Selecciona el método
- Mercado Pago simulará el pago

### 4.3 Hacer una Compra de Prueba

1. Ve a tu sitio
2. Agrega productos al carrito
3. Ve al checkout
4. Completa el formulario
5. Selecciona "Nequi" o "Tarjeta"
6. Haz clic en "Confirmar Pedido"
7. Serás redirigido a Mercado Pago
8. Usa los datos de prueba
9. Completa el pago
10. Regresarás a tu sitio con confirmación

---

## PASO 5: Cómo Funciona el Dinero

### En Modo Prueba (Ahora)
- El dinero NO es real
- Solo simula transacciones
- Perfecto para tu proyecto universitario

### En Modo Producción (Después)

1. **Cliente paga:**
   - Nequi, PSE, tarjeta, etc.
   - El dinero va a tu cuenta de Mercado Pago

2. **Mercado Pago cobra comisión:**
   - Aprox. 3.99% + IVA por transacción
   - Se descuenta automáticamente

3. **Recibes el dinero:**
   - El dinero queda en tu cuenta de Mercado Pago
   - Puedes verlo en: https://www.mercadopago.com.co/balance

4. **Transferir a tu banco/Nequi:**
   - Ve a "Dinero disponible"
   - Haz clic en "Transferir"
   - Selecciona tu banco o Nequi
   - El dinero llega en 1-2 días hábiles
   - **Gratis** si transfieres a Bancolombia
   - Pequeña comisión para otros bancos

---

## PASO 6: Notificaciones al Staff

Cuando un cliente paga:

1. Mercado Pago confirma el pago
2. Tu sistema envía email automático al staff
3. El pedido aparece en `/staff` con estado "Pagado"
4. El staff puede ver todos los detalles

El email del staff se configura en la variable `EMAIL_USER`.

---

## PASO 7: Pasar a Producción (Cuando estés listo)

### 7.1 Verificar tu Cuenta

1. Sube foto de tu cédula en Mercado Pago
2. Espera aprobación (1-24 horas)
3. Vincula tu cuenta bancaria o Nequi

### 7.2 Cambiar a Claves de Producción

1. En Mercado Pago, copia las claves de **Producción**
2. Actualiza las variables en Vercel:
   - Reemplaza `TEST-...` por `APP_USR-...`
3. Redespliega tu sitio

### 7.3 Probar con Dinero Real

1. Haz una compra pequeña (ej: $1,000 COP)
2. Paga con tu Nequi o tarjeta real
3. Verifica que el dinero llegue a tu cuenta de Mercado Pago
4. Transfiere a tu banco/Nequi

---

## Resumen de URLs

- **Mercado Pago:** https://www.mercadopago.com.co
- **Developers:** https://www.mercadopago.com.co/developers
- **Tu dinero:** https://www.mercadopago.com.co/balance
- **Tu sitio:** https://cafeteria-pantojito.vercel.app
- **Panel staff:** https://cafeteria-pantojito.vercel.app/staff

---

## Solución de Problemas

### No puedo crear cuenta
- Usa un email válido
- Verifica tu bandeja de spam
- Intenta con otro navegador

### Las claves no funcionan
- Verifica que copiaste las claves completas
- Asegúrate de usar las claves de **Prueba** primero
- No debe haber espacios al inicio o final

### El pago no se confirma
- Verifica que las variables estén en Vercel
- Revisa los logs en Vercel → Logs
- Asegúrate de usar los datos de prueba correctos

### No llega el email al staff
- Verifica `EMAIL_USER` y `EMAIL_PASSWORD`
- Revisa la carpeta de spam
- Verifica los logs en Vercel

---

## ¿Necesitas Ayuda?

- **Soporte Mercado Pago:** https://www.mercadopago.com.co/ayuda
- **Chat en vivo:** Disponible en el sitio
- **Documentación:** https://www.mercadopago.com.co/developers/es/docs

---

¡Listo! Ahora tienes Mercado Pago configurado. Es la forma más fácil de recibir pagos en Colombia para tu proyecto universitario.
