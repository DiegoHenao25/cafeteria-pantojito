# Resumen Rápido: Configurar ePayco

## 3 Pasos Principales

### 1. Crear Cuenta en ePayco
- Ve a: https://dashboard.epayco.co/register
- Regístrate con tu email universitario
- Verifica tu email
- **No necesitas RUT para modo prueba**

### 2. Obtener Claves API
En el dashboard de ePayco:
- Ve a **"Integraciones"** o **"API Keys"**
- Copia las claves de **Pruebas**:
  - `EPAYCO_PUBLIC_KEY`
  - `EPAYCO_PRIVATE_KEY`
  - `EPAYCO_CUSTOMER_ID`
  - `EPAYCO_P_KEY`

### 3. Configurar Variables de Entorno

Agrega a tu `.env.local`:

\`\`\`env
EPAYCO_PUBLIC_KEY=tu_clave_publica
EPAYCO_PRIVATE_KEY=tu_clave_privada
EPAYCO_CUSTOMER_ID=tu_customer_id
EPAYCO_P_KEY=tu_p_key
EPAYCO_TEST_MODE=true
NEXT_PUBLIC_APP_URL=https://cafeteria-pantojito.vercel.app
\`\`\`

Agrega las mismas variables en Vercel → Settings → Environment Variables

## Instalar y Desplegar

\`\`\`bash
npm install epayco-sdk-node
git add .
git commit -m "Integración ePayco"
git push origin main
\`\`\`

## Probar

1. Ve a tu sitio
2. Agrega productos al carrito
3. Haz checkout
4. Paga con número de prueba: `3001234567`
5. Verifica que llegue email al staff
6. Revisa el pedido en `/staff`

## Datos de Prueba

- **Teléfono Nequi:** 3001234567 (aprobado)
- **Cédula:** 1234567890
- **Nombre:** Cualquiera

## ¿Dónde Llega el Dinero?

- **Modo Prueba:** No es dinero real, solo simulación
- **Modo Producción:** Llega a tu Nequi vinculada en ePayco (1-3 días)

## Notificaciones al Staff

Cuando un cliente paga:
1. Email automático a `diego.henao@ucp.edu.co`
2. Pedido aparece en `/staff` con estado "Pagado"
3. Incluye todos los detalles del cliente y pedido

---

**Guía completa:** Ver archivo `CONFIGURAR-EPAYCO-PASO-A-PASO.md`
