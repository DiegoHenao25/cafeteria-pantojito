# Configurar Wompi para Pagos en Colombia

Esta guía te explica cómo configurar Wompi para aceptar pagos con Nequi, Bancolombia, PSE, tarjetas de crédito y más métodos colombianos.

## ¿Qué es Wompi?

Wompi es una pasarela de pagos colombiana que permite recibir pagos a través de:
- PSE (Pagos Seguros en Línea)
- Nequi
- Tarjetas de crédito y débito
- Bancolombia
- Daviplata
- Y más métodos de pago colombianos

## Paso 1: Crear Cuenta en Wompi

1. Ve a: https://comercios.wompi.co/registro
2. Completa el formulario de registro:
   - Nombre completo
   - Email
   - Teléfono
   - Tipo de negocio
3. Verifica tu correo electrónico
4. Completa el proceso de verificación de identidad

## Paso 2: Verificar tu Cuenta

Para recibir pagos reales, necesitas:

1. **Documentos requeridos:**
   - Cédula de ciudadanía o NIT
   - RUT (si eres persona jurídica)
   - Certificado bancario

2. **Información bancaria:**
   - Banco donde recibirás los pagos
   - Número de cuenta
   - Tipo de cuenta (ahorros o corriente)

3. **Proceso de aprobación:**
   - Wompi revisará tu información (1-3 días hábiles)
   - Te notificarán por email cuando estés aprobado

## Paso 3: Obtener las Claves API

Una vez aprobada tu cuenta:

1. Inicia sesión en: https://comercios.wompi.co
2. Ve a **Configuración** → **Claves API**
3. Verás dos tipos de claves:

### Claves de Prueba (Sandbox)
- **Public Key (Prueba):** `pub_test_xxxxx`
- **Private Key (Prueba):** `prv_test_xxxxx`
- **Integrity Secret (Prueba):** Para firmar transacciones

### Claves de Producción (Real)
- **Public Key (Producción):** `pub_prod_xxxxx`
- **Private Key (Producción):** `prv_prod_xxxxx`
- **Integrity Secret (Producción):** Para firmar transacciones

## Paso 4: Configurar Variables de Entorno

### En tu archivo `.env` local:

\`\`\`env
# Wompi - Claves de PRUEBA (para desarrollo)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY="pub_test_tu_clave_publica_aqui"
WOMPI_PRIVATE_KEY="prv_test_tu_clave_privada_aqui"
WOMPI_INTEGRITY_SECRET="tu_integrity_secret_aqui"

# URL base de tu aplicación
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
\`\`\`

### En Vercel (Producción):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega estas 3 variables:

**Variable 1:**
- Key: `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`
- Value: `pub_prod_tu_clave_publica_de_produccion`
- Environment: Production, Preview, Development

**Variable 2:**
- Key: `WOMPI_PRIVATE_KEY`
- Value: `prv_prod_tu_clave_privada_de_produccion`
- Environment: Production, Preview, Development

**Variable 3:**
- Key: `WOMPI_INTEGRITY_SECRET`
- Value: `tu_integrity_secret_de_produccion`
- Environment: Production, Preview, Development

**Variable 4:**
- Key: `NEXT_PUBLIC_BASE_URL`
- Value: `https://tu-proyecto.vercel.app`
- Environment: Production, Preview, Development

## Paso 5: Probar Pagos en Modo Sandbox

Wompi proporciona datos de prueba para simular pagos:

### Tarjetas de Prueba

**Tarjeta Aprobada:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVV: Cualquier 3 dígitos
- Resultado: Transacción aprobada

**Tarjeta Rechazada:**
- Número: `4111 1111 1111 1111`
- Resultado: Transacción rechazada

### PSE de Prueba

1. Selecciona cualquier banco
2. Tipo de persona: Natural
3. Documento: `123456789`
4. Selecciona "Pago exitoso" en el simulador

### Nequi de Prueba

1. Número de teléfono: `3001234567`
2. Sigue el flujo del simulador
3. Confirma el pago

## Paso 6: Desplegar y Probar

1. **Hacer commit y push:**
\`\`\`bash
git add .
git commit -m "Agregar integración de Wompi"
git push
\`\`\`

2. **Esperar el redespliegue en Vercel** (2-3 minutos)

3. **Probar el flujo completo:**
   - Ve a tu sitio
   - Agrega productos al carrito
   - Ve al checkout
   - Completa tus datos personales
   - Selecciona "PSE / Transferencia Bancaria" o "Tarjeta"
   - Haz clic en "Confirmar Pedido"
   - Se abrirá el widget de Wompi
   - Completa el pago con datos de prueba

## Paso 7: Ir a Producción (Pagos Reales)

Cuando estés listo para recibir pagos reales:

1. **Verifica que tu cuenta Wompi esté aprobada**
2. **Cambia las claves en Vercel:**
   - Reemplaza las claves de prueba (`pub_test_`, `prv_test_`) 
   - Por las claves de producción (`pub_prod_`, `prv_prod_`)
3. **Redespliega tu aplicación**
4. **Prueba con una transacción real pequeña**

## Comisiones de Wompi

Wompi cobra comisiones por transacción:

- **PSE:** 2.99% + $900 COP
- **Tarjetas de crédito:** 3.49% + $900 COP
- **Nequi:** 2.99% + $900 COP
- **Bancolombia:** 2.99% + $900 COP

Los pagos se depositan en tu cuenta bancaria en 1-2 días hábiles.

## Solución de Problemas

### Error: "Public key inválida"
- Verifica que copiaste la clave completa sin espacios
- Asegúrate de usar la clave correcta (prueba vs producción)

### Error: "Integrity signature inválida"
- Verifica que el `WOMPI_INTEGRITY_SECRET` sea correcto
- Asegúrate de que no tenga espacios al inicio o final

### El widget no se abre
- Verifica que el script de Wompi esté cargado: `https://checkout.wompi.co/widget.js`
- Revisa la consola del navegador para ver errores

### Pago exitoso pero no se crea la orden
- Verifica que la URL de redirección esté correcta
- Revisa los logs en Vercel para ver errores

## Recursos Adicionales

- **Documentación oficial:** https://docs.wompi.co
- **Dashboard de comercios:** https://comercios.wompi.co
- **Soporte:** soporte@wompi.co
- **WhatsApp:** +57 300 123 4567

## Notas Importantes

- Wompi requiere que tu negocio esté registrado en Colombia
- Necesitas una cuenta bancaria colombiana para recibir los pagos
- El proceso de verificación puede tomar 1-3 días hábiles
- Mantén tus claves privadas seguras y nunca las compartas
