# Guía: Configurar Pasarela de Pago con Stripe

## ¿Qué es Stripe?

Stripe es una plataforma de pagos que permite recibir pagos con tarjetas de crédito/débito. Aunque no tiene PSE directamente, sí acepta tarjetas colombianas de Bancolombia, Nequi, etc.

**Nota:** Para PSE específicamente, necesitarías usar **Wompi** o **PayU** (plataformas colombianas). Esta guía usa Stripe porque es más fácil de configurar para empezar.

## Paso 1: Crear Cuenta en Stripe

1. Ve a: https://stripe.com
2. Haz clic en **"Start now"** o **"Comenzar"**
3. Completa el registro:
   - Email: tu correo
   - Nombre completo
   - País: **Colombia**
   - Contraseña
4. Verifica tu email
5. Completa la información de tu negocio:
   - Nombre del negocio: "Cafetería Pantojito"
   - Tipo de negocio: "Food & Beverage"
   - Sitio web: https://cafeteria-pantojito.vercel.app

## Paso 2: Activar Modo de Prueba (Test Mode)

Stripe tiene dos modos:
- **Test Mode** (Modo de prueba): Para probar sin dinero real
- **Live Mode** (Modo en vivo): Para recibir pagos reales

Primero usaremos Test Mode:

1. En el dashboard de Stripe, verifica que esté activado **"Test mode"** (arriba a la derecha)
2. Verás un switch que dice "Viewing test data"

## Paso 3: Obtener las API Keys

### 3.1 Obtener las Claves de Prueba (Test Keys)

1. En el dashboard de Stripe, ve a **"Developers"** (arriba a la derecha)
2. Haz clic en **"API keys"**
3. Verás dos claves:
   - **Publishable key** (Clave pública): Empieza con `pk_test_...`
   - **Secret key** (Clave secreta): Empieza con `sk_test_...`
4. Haz clic en **"Reveal test key"** para ver la clave secreta
5. Copia ambas claves

### 3.2 Agregar las Claves a tu Proyecto

#### En tu archivo .env local:

Abre el archivo `.env` en VS Code y agrega:

\`\`\`env
STRIPE_SECRET_KEY="sk_test_tu_clave_secreta_aqui"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_tu_clave_publica_aqui"
\`\`\`

**IMPORTANTE:** Reemplaza con tus claves reales de Stripe.

#### En Vercel (para producción):

1. Ve a Vercel: https://vercel.com
2. Entra a tu proyecto "cafeteria-pantojito"
3. Ve a **Settings → Environment Variables**
4. Agrega estas 2 variables:

**Variable 1:**
- Key: `STRIPE_SECRET_KEY`
- Value: `sk_test_tu_clave_secreta`
- Environment: Marca las 3 opciones

**Variable 2:**
- Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_test_tu_clave_publica`
- Environment: Marca las 3 opciones

5. Haz clic en **"Save"** en cada una

## Paso 4: Instalar Stripe en tu Proyecto

Abre la terminal en VS Code y ejecuta:

\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

## Paso 5: Crear el API de Pago

Crea el archivo `app/api/create-payment-intent/route.ts` con este código:

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe usa centavos
      currency: 'cop', // Pesos colombianos
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
\`\`\`

## Paso 6: Probar Pagos en Modo de Prueba

### 6.1 Tarjetas de Prueba de Stripe

Usa estas tarjetas para probar (NO son reales):

**Pago Exitoso:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura (ej: 12/25)
- CVC: Cualquier 3 dígitos (ej: 123)
- Código postal: Cualquiera (ej: 12345)

**Pago Rechazado:**
- Número: `4000 0000 0000 0002`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

**Requiere Autenticación 3D Secure:**
- Número: `4000 0027 6000 3184`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos

### 6.2 Hacer una Prueba de Pago

1. Ve a tu sitio: https://cafeteria-pantojito.vercel.app
2. Agrega productos al carrito
3. Ve al checkout
4. Llena todos los campos
5. Selecciona "Tarjeta de crédito/débito"
6. Usa la tarjeta de prueba: `4242 4242 4242 4242`
7. Completa el pago

### 6.3 Verificar el Pago en Stripe

1. Ve al dashboard de Stripe
2. Haz clic en **"Payments"** en el menú lateral
3. Deberías ver tu pago de prueba
4. Haz clic en el pago para ver los detalles

## Paso 7: Activar Pagos Reales (Cuando Estés Listo)

### 7.1 Completar la Verificación de Cuenta

Stripe te pedirá:
- Información personal (nombre, dirección, fecha de nacimiento)
- Documento de identidad (cédula)
- Información bancaria (cuenta donde recibirás el dinero)
- Información del negocio

### 7.2 Obtener las Claves en Vivo (Live Keys)

1. En Stripe, desactiva el **"Test mode"**
2. Ve a **Developers → API keys**
3. Copia las claves que empiezan con:
   - `pk_live_...` (Publishable key)
   - `sk_live_...` (Secret key)

### 7.3 Actualizar las Variables de Entorno

**En Vercel:**
1. Ve a Settings → Environment Variables
2. Edita las 2 variables de Stripe
3. Reemplaza las claves `sk_test_...` y `pk_test_...` con las claves `sk_live_...` y `pk_live_...`
4. Guarda los cambios
5. Redeploy tu proyecto

## Paso 8: Configurar Webhooks (Opcional pero Recomendado)

Los webhooks te notifican cuando un pago es exitoso:

1. En Stripe, ve a **Developers → Webhooks**
2. Haz clic en **"Add endpoint"**
3. URL del endpoint: `https://cafeteria-pantojito.vercel.app/api/webhooks/stripe`
4. Selecciona estos eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copia el **"Signing secret"** (empieza con `whsec_...`)
6. Agrégalo a Vercel como variable de entorno:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_tu_signing_secret`

## Alternativa: Usar Wompi para PSE/Nequi

Si necesitas PSE, Nequi, y otros métodos colombianos:

### Wompi (Recomendado para Colombia)

1. Ve a: https://wompi.com
2. Crea una cuenta
3. Completa la verificación
4. Obtén tus API keys
5. Wompi soporta:
   - PSE (transferencias bancarias)
   - Nequi
   - Tarjetas de crédito/débito
   - Bancolombia
   - Daviplata

**Documentación de Wompi:** https://docs.wompi.co

## Costos y Comisiones

### Stripe Colombia:
- 3.95% + $900 COP por transacción exitosa
- Sin costos mensuales
- Sin costos de configuración

### Wompi Colombia:
- 3.49% + IVA por transacción
- Sin costos mensuales
- Soporta más métodos de pago colombianos

## Problemas Comunes

### Error: "No such API key"
- Verifica que copiaste las claves correctamente
- Asegúrate de que no haya espacios al inicio o final
- Verifica que estés usando las claves correctas (test o live)

### Error: "Invalid currency"
- Asegúrate de usar `currency: 'cop'` para pesos colombianos

### Los pagos no aparecen en Stripe
- Verifica que estés en el modo correcto (Test o Live)
- Revisa la consola del navegador para ver errores

### Error: "Stripe is not defined"
- Ejecuta `npm install stripe @stripe/stripe-js`
- Reinicia el servidor de desarrollo

## Siguiente Paso

Una vez configurado Stripe:
1. Haz pruebas con las tarjetas de prueba
2. Verifica que las órdenes se guarden en la base de datos
3. Cuando estés listo, activa el modo en vivo
4. Completa la verificación de tu cuenta
5. ¡Empieza a recibir pagos reales!

## Soporte

- **Stripe:** https://support.stripe.com
- **Wompi:** https://wompi.com/soporte
- **Documentación Stripe:** https://stripe.com/docs
