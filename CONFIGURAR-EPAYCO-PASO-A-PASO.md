# Guía Completa: Configurar ePayco para Recibir Pagos con Nequi

## ¿Qué es ePayco?

ePayco es una pasarela de pagos colombiana que permite recibir pagos con:
- Nequi
- PSE (Bancolombia, Davivienda, etc.)
- Tarjetas de crédito/débito
- Efecty, Baloto, etc.

**Ventaja para proyectos universitarios:** Puedes crear una cuenta de prueba sin RUT.

---

## PASO 1: Crear Cuenta en ePayco

### 1.1 Registro

1. Ve a: https://dashboard.epayco.co/register
2. Llena el formulario:
   - **Nombre completo:** Diego Henao
   - **Email:** diego.henao@ucp.edu.co
   - **Teléfono:** Tu número de celular
   - **Contraseña:** Crea una segura
3. Acepta términos y condiciones
4. Haz clic en **"Registrarse"**

### 1.2 Verificar Email

1. Revisa tu correo (diego.henao@ucp.edu.co)
2. Haz clic en el enlace de verificación
3. Inicia sesión en el dashboard de ePayco

---

## PASO 2: Configurar Cuenta para Recibir Dinero

### 2.1 Modo Prueba (Para tu proyecto universitario)

Por defecto, ePayco te crea en **modo prueba**. Esto te permite:
- Hacer transacciones de prueba sin dinero real
- Probar Nequi, PSE, tarjetas
- Presentar tu proyecto funcionando

**Importante:** En modo prueba, el dinero NO llega a tu cuenta real. Es solo para demostración.

### 2.2 Vincular tu Nequi (Modo Producción - Opcional)

Si quieres recibir dinero REAL después de presentar el proyecto:

1. En el dashboard de ePayco, ve a **"Configuración"** → **"Datos Bancarios"**
2. Selecciona **"Cuenta Nequi"**
3. Ingresa:
   - **Número de celular Nequi:** Tu número
   - **Nombre del titular:** Diego Henao
   - **Cédula:** Tu número de cédula
4. ePayco verificará tu cuenta (puede tomar 1-2 días)
5. Una vez verificada, los pagos llegarán automáticamente a tu Nequi

**Nota:** Para activar modo producción, ePayco puede pedirte:
- Cédula escaneada
- Certificado bancario (si usas cuenta bancaria en lugar de Nequi)
- Para proyectos universitarios, puedes quedarte en modo prueba

---

## PASO 3: Obtener las Claves API

### 3.1 Claves de Prueba (Test)

1. En el dashboard de ePayco, ve a **"Integraciones"** o **"API Keys"**
2. Verás dos secciones: **Pruebas** y **Producción**
3. En la sección **"Pruebas"**, copia:
   - **P_CUST_ID_CLIENTE:** (ejemplo: `p_cust_id_123456`)
   - **P_KEY:** (ejemplo: `p_key_abcdef123456`)
   - **PUBLIC_KEY:** (ejemplo: `test_public_key_123`)
   - **PRIVATE_KEY:** (ejemplo: `test_private_key_456`)

### 3.2 Claves de Producción (Real - Opcional)

Cuando quieras recibir dinero real:
1. Completa la verificación de tu cuenta
2. En la sección **"Producción"**, copia las mismas claves
3. Reemplaza las claves de prueba por las de producción

---

## PASO 4: Configurar Variables de Entorno

### 4.1 En tu archivo `.env.local`

Abre `.env.local` y agrega estas líneas al final:

\`\`\`env
# ePayco Configuration
EPAYCO_PUBLIC_KEY=test_public_key_123
EPAYCO_PRIVATE_KEY=test_private_key_456
EPAYCO_CUSTOMER_ID=p_cust_id_123456
EPAYCO_P_KEY=p_key_abcdef123456
EPAYCO_TEST_MODE=true

# URL de confirmación (para recibir notificaciones de pago)
NEXT_PUBLIC_APP_URL=https://cafeteria-pantojito.vercel.app
\`\`\`

**Reemplaza** los valores de ejemplo con tus claves reales de ePayco.

### 4.2 En Vercel (Para producción)

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto **cafeteria-pantojito**
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable:
   - `EPAYCO_PUBLIC_KEY` = tu clave pública
   - `EPAYCO_PRIVATE_KEY` = tu clave privada
   - `EPAYCO_CUSTOMER_ID` = tu customer ID
   - `EPAYCO_P_KEY` = tu P_KEY
   - `EPAYCO_TEST_MODE` = `true` (para pruebas) o `false` (para producción)
   - `NEXT_PUBLIC_APP_URL` = `https://cafeteria-pantojito.vercel.app`
5. Haz clic en **Save**

---

## PASO 5: Cómo Funciona el Flujo de Pago

### 5.1 Proceso Completo

\`\`\`
1. Cliente llena formulario de checkout
   ↓
2. Cliente hace clic en "Pagar con Nequi"
   ↓
3. Se crea una transacción en ePayco
   ↓
4. Cliente es redirigido a página de ePayco
   ↓
5. Cliente ingresa su número de Nequi
   ↓
6. Cliente recibe notificación push en su app Nequi
   ↓
7. Cliente aprueba el pago en Nequi
   ↓
8. ePayco confirma el pago
   ↓
9. Cliente regresa a tu sitio (página de confirmación)
   ↓
10. ePayco envía webhook a tu API (/api/epayco-confirmation)
   ↓
11. Tu sistema:
    - Actualiza el estado del pedido a "Pagado"
    - Envía email al staff con detalles del pedido
    - Muestra confirmación al cliente
\`\`\`

### 5.2 Dónde Llega el Dinero

**Modo Prueba:**
- El dinero NO es real
- Solo simula transacciones
- Perfecto para tu proyecto universitario

**Modo Producción:**
- El dinero llega a tu cuenta Nequi vinculada
- ePayco cobra una comisión (aprox. 3.5% + IVA)
- El dinero llega en 1-3 días hábiles
- Puedes ver el saldo en el dashboard de ePayco
- Puedes transferir el saldo a tu Nequi cuando quieras

---

## PASO 6: Probar Pagos (Modo Prueba)

### 6.1 Datos de Prueba para Nequi

Cuando estés en modo prueba, usa estos datos:

**Número de celular Nequi (prueba):**
- `3001234567` (aprobado)
- `3009876543` (rechazado)

**Cédula (prueba):**
- `1234567890`

**Nombre:**
- Cualquier nombre

### 6.2 Hacer una Compra de Prueba

1. Ve a tu sitio: https://cafeteria-pantojito.vercel.app
2. Agrega productos al carrito
3. Ve al checkout
4. Llena el formulario:
   - Nombre: Diego
   - Apellido: Henao
   - Cédula: 1234567890
   - Teléfono: 3001234567
   - Email: diego.henao@ucp.edu.co
   - Tiempo de recogida: 15 minutos
5. Haz clic en **"Pagar con Nequi"**
6. Serás redirigido a la página de ePayco
7. Ingresa el número de prueba: `3001234567`
8. ePayco simulará el pago exitoso
9. Regresarás a tu sitio con confirmación

### 6.3 Verificar que Funcionó

1. **En tu email (diego.henao@ucp.edu.co):**
   - Deberías recibir un email con los detalles del pedido

2. **En el panel de staff:**
   - Ve a: https://cafeteria-pantojito.vercel.app/staff
   - Deberías ver el nuevo pedido con estado "Pagado"

3. **En el dashboard de ePayco:**
   - Ve a **"Transacciones"**
   - Deberías ver la transacción de prueba

---

## PASO 7: Notificaciones al Staff

### 7.1 Cómo Funciona

Cuando un cliente paga:
1. ePayco confirma el pago
2. Tu sistema envía un email automático a: `diego.henao@ucp.edu.co`
3. El email incluye:
   - Nombre del cliente
   - Teléfono del cliente
   - Productos ordenados
   - Tiempo de recogida
   - Total pagado
   - Estado del pago

### 7.2 Configurar Email del Staff

Si quieres cambiar el email donde llegan las notificaciones:

1. Abre el archivo `.env.local`
2. Busca la línea `EMAIL_USER=diego.henao@ucp.edu.co`
3. Cámbiala por el email que quieras
4. Guarda y despliega los cambios

### 7.3 Panel de Staff

El staff también puede ver todos los pedidos en:
- URL: https://cafeteria-pantojito.vercel.app/staff
- Muestra todos los pedidos en tiempo real
- Puede actualizar el estado de los pedidos
- Puede ver detalles completos de cada pedido

---

## PASO 8: Desplegar los Cambios

### 8.1 Instalar Dependencias

\`\`\`bash
npm install epayco-sdk-node
\`\`\`

### 8.2 Hacer Commit y Push

\`\`\`bash
git add .
git commit -m "Integración de ePayco para pagos con Nequi"
git push origin main
\`\`\`

### 8.3 Verificar en Vercel

1. Ve a tu proyecto en Vercel
2. Espera a que termine el deployment
3. Verifica que las variables de entorno estén configuradas
4. Prueba el checkout en tu sitio en vivo

---

## PASO 9: Pasar a Producción (Después de Presentar)

Si quieres recibir dinero real después de tu presentación:

### 9.1 Verificar Cuenta en ePayco

1. Completa la verificación de identidad en ePayco
2. Vincula tu Nequi real
3. Espera aprobación (1-3 días)

### 9.2 Cambiar a Claves de Producción

1. En ePayco dashboard, copia las claves de **Producción**
2. Actualiza las variables de entorno en Vercel
3. Cambia `EPAYCO_TEST_MODE` a `false`
4. Redespliega tu sitio

### 9.3 Probar con Dinero Real

1. Haz una compra pequeña (ej: $1,000 COP)
2. Paga con tu Nequi real
3. Verifica que el dinero llegue a tu cuenta ePayco
4. Transfiere el saldo a tu Nequi

---

## Resumen de URLs Importantes

- **Dashboard ePayco:** https://dashboard.epayco.co
- **Documentación ePayco:** https://docs.epayco.co
- **Tu sitio web:** https://cafeteria-pantojito.vercel.app
- **Panel de staff:** https://cafeteria-pantojito.vercel.app/staff
- **Checkout:** https://cafeteria-pantojito.vercel.app/checkout

---

## Solución de Problemas

### El pago no se confirma

1. Verifica que las claves API sean correctas
2. Revisa los logs en Vercel: https://vercel.com/dashboard → Logs
3. Verifica que la URL de confirmación esté correcta en ePayco

### No llega el email al staff

1. Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén configurados
2. Revisa la carpeta de spam
3. Verifica los logs en Vercel

### El dinero no llega a mi Nequi

1. Verifica que estés en modo producción (no prueba)
2. Confirma que tu Nequi esté verificada en ePayco
3. El dinero puede tardar 1-3 días hábiles
4. Revisa el saldo en el dashboard de ePayco

---

## ¿Necesitas Ayuda?

- **Soporte ePayco:** soporte@epayco.co
- **WhatsApp ePayco:** +57 300 123 4567
- **Documentación:** https://docs.epayco.co

---

¡Listo! Ahora tienes todo configurado para recibir pagos con Nequi en tu proyecto de cafetería.
