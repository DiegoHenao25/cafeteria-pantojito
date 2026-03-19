# Pasos Finales para Activar Mercado Pago

## 1. Instalar dependencia de Mercado Pago

Abre la terminal en VS Code y ejecuta:

\`\`\`bash
npm install mercadopago
\`\`\`

## 2. Agregar variables de entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

\`\`\`
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-cffb3bc1-95a6-455b-ad42-74e22234b314
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8355097594568227-102621-2d66592e59f21986d0159f00413bffb4-2948865355
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
\`\`\`

(Reemplaza `https://tu-proyecto.vercel.app` con tu URL real de Vercel)

## 3. Desplegar a Vercel

\`\`\`bash
git add .
git commit -m "Agregado Mercado Pago"
git push
\`\`\`

## 4. Probar el sistema

1. Ve a tu sitio desplegado
2. Agrega productos al carrito
3. Ve al checkout
4. Completa el formulario
5. Haz clic en "Pagar con Mercado Pago"
6. Serás redirigido a Mercado Pago para completar el pago
7. Después del pago, volverás a tu sitio con confirmación

## 5. Cómo funciona el flujo completo

1. **Cliente hace pedido** → Completa formulario en checkout
2. **Sistema crea orden** → Guarda en base de datos con estado "pending"
3. **Redirige a Mercado Pago** → Cliente paga con Nequi/PSE/Tarjeta
4. **Mercado Pago confirma** → Envía webhook a tu servidor
5. **Sistema actualiza orden** → Cambia estado a "paid"
6. **Email al staff** → Notifica al correo de la cafetería con detalles del pedido
7. **Cliente ve confirmación** → Página de éxito con número de orden

## 6. Dónde llega el dinero

- El dinero llega a tu cuenta de Mercado Pago
- Desde ahí puedes transferirlo a tu Nequi o banco
- En modo TEST (claves actuales), no se mueve dinero real
- Para producción, necesitas activar tu cuenta y usar claves de producción

## 7. Vista del Staff

El staff puede ver todos los pedidos en: `https://tu-sitio.vercel.app/staff`

Ahí verán:
- Todos los pedidos entrantes
- Estado de pago
- Datos del cliente
- Hora de recogida
- Productos ordenados

## Siguiente paso

Ejecuta: `npm install mercadopago` y luego despliega a Vercel.
