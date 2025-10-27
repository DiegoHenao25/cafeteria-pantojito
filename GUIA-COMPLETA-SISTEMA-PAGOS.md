# Guía Completa del Sistema de Pagos y Pedidos

Esta guía explica cómo funciona todo el sistema de pagos, pedidos y notificaciones de tu cafetería.

## Resumen del Sistema

Tu aplicación ahora tiene:

1. **Checkout con información del cliente** (nombre, cédula, teléfono, correo)
2. **Selección de tiempo de recogida** (15, 20, 30, 45 minutos)
3. **Tres métodos de pago:**
   - Efectivo (pago al recoger)
   - Tarjeta de crédito/débito (Wompi)
   - PSE/Transferencias (Nequi, Bancolombia, etc. vía Wompi)
4. **Vista del staff** para ver pedidos entrantes
5. **Notificaciones por email** al staff cuando llega un pedido

## Flujo Completo de un Pedido

### 1. Cliente Hace el Pedido

1. Cliente navega por el menú (`/menu`)
2. Agrega productos al carrito
3. Va al checkout (`/checkout`)
4. Completa sus datos personales:
   - Nombre y apellido
   - Cédula
   - Teléfono
   - Correo
5. Selecciona tiempo de recogida (15-45 min)
6. Selecciona método de pago

### 2. Procesamiento del Pago

**Si elige Efectivo:**
- El pedido se crea inmediatamente
- Estado: "pendiente"
- Cliente pagará al recoger

**Si elige Tarjeta o PSE:**
- Se abre el widget de Wompi
- Cliente completa el pago
- Wompi procesa la transacción
- Si es exitoso: se crea el pedido
- Si falla: cliente puede intentar de nuevo

### 3. Notificación al Staff

Cuando se crea un pedido:

1. Se guarda en la base de datos
2. Se envía un email automático al staff con:
   - Número de pedido
   - Información del cliente
   - Productos ordenados
   - Tiempo de recogida
   - Método de pago
   - Total a cobrar

### 4. Staff Gestiona el Pedido

El staff puede:

1. Ver todos los pedidos en `/staff`
2. Filtrar por estado (pendientes, completados)
3. Ver detalles completos de cada pedido
4. Marcar pedidos como completados
5. Cancelar pedidos si es necesario

### 5. Cliente Recoge su Pedido

1. Cliente llega a la cafetería
2. Staff verifica el pedido
3. Si es efectivo: cobra el monto
4. Entrega el pedido
5. Marca como completado en el sistema

## Archivos Actualizados

### 1. `lib/email.tsx`
- Función `sendOrderNotificationToStaff()` agregada
- Envía emails con detalles completos del pedido
- Formato HTML profesional

### 2. `app/api/orders/route.ts`
- Crea pedidos en la base de datos
- Envía notificación por email al staff
- Maneja errores de email sin fallar el pedido

### 3. `app/api/create-payment/route.ts` (NUEVO)
- Crea transacciones de pago con Wompi
- Genera firma de integridad
- Retorna datos para el widget de Wompi

### 4. `app/checkout/page.tsx`
- Formulario completo de información personal
- Selección de tiempo de recogida
- Integración con widget de Wompi
- Manejo de pagos electrónicos y efectivo

### 5. `app/staff/page.tsx` (NUEVO)
- Vista exclusiva para administradores
- Lista de todos los pedidos
- Filtros por estado
- Acciones para completar/cancelar pedidos
- Actualización automática cada 30 segundos

### 6. `app/payment-result/page.tsx` (NUEVO)
- Página de resultado después del pago
- Completa el pedido si el pago fue exitoso
- Maneja pagos cancelados

## Cómo Instalar los Cambios

### Paso 1: Actualizar Base de Datos

Ya ejecutaste el script SQL anteriormente, así que la base de datos ya tiene las columnas necesarias.

### Paso 2: Configurar Wompi

Sigue la guía `CONFIGURAR-WOMPI-PAGOS-COLOMBIA.md` para:
1. Crear cuenta en Wompi
2. Obtener claves API
3. Agregar variables de entorno

### Paso 3: Desplegar Cambios

\`\`\`bash
git add .
git commit -m "Agregar sistema completo de pagos y notificaciones"
git push
\`\`\`

Vercel redesplegará automáticamente.

### Paso 4: Probar el Sistema

1. **Probar checkout:**
   - Ve a `/menu`
   - Agrega productos
   - Completa el checkout
   - Prueba con efectivo primero

2. **Probar pagos Wompi:**
   - Usa las claves de prueba
   - Selecciona PSE o tarjeta
   - Usa datos de prueba de Wompi

3. **Verificar email:**
   - Revisa que llegue el email al staff
   - Verifica que tenga todos los detalles

4. **Probar vista del staff:**
   - Inicia sesión como admin
   - Ve a `/staff`
   - Verifica que aparezcan los pedidos
   - Prueba marcar como completado

## Acceso a la Vista del Staff

**URL:** `https://tu-proyecto.vercel.app/staff`

**Requisitos:**
- Debes estar autenticado
- Tu usuario debe tener rol "admin"

**Funcionalidades:**
- Ver todos los pedidos en tiempo real
- Filtrar por estado (todos, pendientes, completados)
- Ver información completa del cliente
- Ver productos ordenados
- Marcar pedidos como completados
- Cancelar pedidos
- Actualización automática cada 30 segundos

## Configuración del Email del Staff

El email de notificaciones se envía a la dirección configurada en `EMAIL_USER`.

Para cambiar el email del staff:

1. Ve a Vercel → Settings → Environment Variables
2. Edita `EMAIL_USER`
3. Pon el email de la cafetería donde quieres recibir notificaciones
4. Redespliega

## Métodos de Pago Disponibles

### 1. Efectivo
- **Ventaja:** Sin comisiones, sin configuración
- **Desventaja:** Cliente debe tener efectivo al recoger
- **Flujo:** Pedido se crea → Cliente paga al recoger

### 2. Tarjeta de Crédito/Débito (Wompi)
- **Ventaja:** Pago inmediato, seguro
- **Desventaja:** Comisión del 3.49% + $900
- **Flujo:** Widget Wompi → Pago → Pedido creado

### 3. PSE / Transferencias (Wompi)
- **Incluye:** Nequi, Bancolombia, Daviplata, etc.
- **Ventaja:** Métodos populares en Colombia
- **Desventaja:** Comisión del 2.99% + $900
- **Flujo:** Widget Wompi → Selecciona banco → Pago → Pedido creado

## Solución de Problemas

### No llegan los emails
1. Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén configurados
2. Verifica que uses una "Contraseña de aplicación" de Gmail
3. Revisa los logs en Vercel para ver errores

### Widget de Wompi no se abre
1. Verifica que las claves de Wompi estén configuradas
2. Revisa la consola del navegador
3. Asegúrate de que el script de Wompi esté cargando

### Pedidos no aparecen en `/staff`
1. Verifica que estés autenticado como admin
2. Revisa que los pedidos se estén creando en la base de datos
3. Verifica la conexión a Railway

### Pago exitoso pero no se crea el pedido
1. Revisa los logs en Vercel
2. Verifica que `NEXT_PUBLIC_BASE_URL` esté configurado
3. Asegúrate de que la URL de redirección sea correcta

## Próximos Pasos Opcionales

1. **Agregar historial de pedidos para clientes**
   - Página `/mis-pedidos` para ver pedidos anteriores

2. **Notificaciones push**
   - Alertas en tiempo real para el staff

3. **Impresión de tickets**
   - Generar PDF de pedidos para imprimir

4. **Estadísticas y reportes**
   - Dashboard con ventas, productos más vendidos, etc.

5. **Programa de fidelidad**
   - Puntos por compras, descuentos, etc.

## Recursos

- **Documentación Wompi:** https://docs.wompi.co
- **Dashboard Wompi:** https://comercios.wompi.co
- **Soporte Wompi:** soporte@wompi.co

## Notas Finales

- El sistema está listo para recibir pedidos reales
- Primero prueba en modo sandbox de Wompi
- Cuando estés listo, cambia a claves de producción
- Mantén las claves privadas seguras
- Revisa regularmente los pedidos en `/staff`
- Los emails son automáticos, no requieren intervención
