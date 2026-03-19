# Guia de Configuracion de Wompi - Cafeteria Pantojito

## Paso 1: Crear cuenta en Wompi

1. Ve a https://comercios.wompi.co/
2. Click en "Registrarse"
3. Completa el formulario con los datos del negocio:
   - Nombre del negocio: Cafeteria Pantojito
   - NIT o Cedula del representante legal
   - Correo electronico
   - Telefono
4. Verifica tu correo electronico
5. Completa el proceso de verificacion de identidad

## Paso 2: Obtener las credenciales

Una vez aprobada tu cuenta:

1. Inicia sesion en https://comercios.wompi.co/
2. Ve a "Configuracion" > "Credenciales"
3. Encontraras:
   - **Public Key (Llave publica)**: Empieza con `pub_`
   - **Private Key (Llave privada)**: Empieza con `prv_`
   - **Integrity Secret**: Para firmar transacciones
   - **Events Secret**: Para verificar webhooks

**IMPORTANTE**: Para pruebas, usa las credenciales de SANDBOX (pruebas).
Para produccion, usa las credenciales de PRODUCCION.

## Paso 3: Configurar variables de entorno

Agrega las siguientes variables de entorno en tu proyecto (Settings > Vars en v0):

```
WOMPI_PUBLIC_KEY=pub_test_XXXXXXXXXX
WOMPI_PRIVATE_KEY=prv_test_XXXXXXXXXX
WOMPI_INTEGRITY_SECRET=test_integrity_XXXXXXXXXX
WOMPI_EVENTS_SECRET=test_events_XXXXXXXXXX
```

## Paso 4: Configurar webhook en Wompi

1. En el panel de Wompi, ve a "Configuracion" > "Webhooks"
2. Agrega un nuevo webhook:
   - **URL**: `https://tu-dominio.vercel.app/api/wompi-webhook`
   - **Eventos**: Selecciona `transaction.updated`
3. Guarda la configuracion

## Paso 5: Ejecutar migracion de base de datos

En Railway, ejecuta el siguiente SQL para agregar los campos necesarios:

```sql
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS comisionPago DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS wompiReference VARCHAR(255) NULL;
ALTER TABLE Orders ADD COLUMN IF NOT EXISTS wompiStatus VARCHAR(50) NULL;
UPDATE Orders SET subtotal = total, comisionPago = 0 WHERE subtotal = 0 OR subtotal IS NULL;
```

## Paso 6: Probar el pago

### Tarjetas de prueba (Sandbox):

**Tarjeta VISA aprobada:**
- Numero: 4242 4242 4242 4242
- Fecha: Cualquier fecha futura (ej: 12/28)
- CVC: 123
- Nombre: Cualquier nombre

**Tarjeta VISA rechazada:**
- Numero: 4111 1111 1111 1111
- Fecha: Cualquier fecha futura
- CVC: 123

**Nequi de prueba:**
- Numero: 3991111111
- Codigo OTP: 111111

## Paso 7: Pasar a produccion

1. Completa la verificacion de tu negocio en Wompi
2. Cambia las credenciales de SANDBOX por las de PRODUCCION
3. Actualiza la URL del webhook con tu dominio de produccion
4. Realiza una transaccion de prueba real con un monto pequeño

## Flujo de pago

1. Usuario agrega productos al carrito
2. En checkout se muestra:
   - Subtotal (precio de productos)
   - Comision Wompi (1.98%)
   - Total a pagar
3. Usuario completa sus datos y da click en "Pagar con Wompi"
4. Se abre el widget de Wompi con metodos de pago:
   - Nequi
   - Bancolombia
   - PSE
   - Tarjetas de credito/debito
   - Daviplata
   - Y mas...
5. Usuario completa el pago
6. Wompi envia webhook con el resultado
7. Sistema actualiza el estado de la orden
8. Usuario es redirigido a pagina de exito o error

## Comision de Wompi

- La comision de Wompi es del **1.98%** sobre el subtotal
- Esta comision se calcula en el backend para seguridad
- El usuario ve el desglose completo antes de pagar:
  - Subtotal: $10,000
  - Comision Wompi (1.98%): $198
  - Total: $10,198

## Manejo de errores

| Estado Wompi | Estado Orden | Accion |
|--------------|--------------|--------|
| APPROVED | pagado | Enviar notificacion al staff |
| DECLINED | cancelado | Mostrar error al usuario |
| ERROR | cancelado | Mostrar error al usuario |
| VOIDED | cancelado | Orden anulada |
| PENDING | pendiente | Esperar confirmacion |

## Soporte

Si tienes problemas con la integracion:
- Documentacion Wompi: https://docs.wompi.co/
- Soporte Wompi: soporte@wompi.co
