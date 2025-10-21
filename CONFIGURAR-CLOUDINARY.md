# Configurar Cloudinary para Subir Imágenes

## Por qué necesitas Cloudinary

Vercel es serverless y no permite guardar archivos permanentemente en el servidor. Por eso necesitas un servicio de almacenamiento en la nube como Cloudinary.

## Paso 1: Crear cuenta en Cloudinary

1. Ve a: https://cloudinary.com/users/register_free
2. Haz clic en "Sign Up for Free"
3. Completa el formulario:
   - Email
   - Contraseña
   - Nombre
4. Verifica tu correo electrónico
5. Inicia sesión

## Paso 2: Obtener credenciales

1. Una vez dentro, verás el Dashboard
2. En la parte superior verás una sección llamada "Account Details"
3. Copia estos 3 valores:
   - **Cloud Name** (ejemplo: `dxyz123abc`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (ejemplo: `abcdefghijklmnopqrstuvwxyz123`)

## Paso 3: Agregar credenciales a tu proyecto local

1. Abre el archivo `.env` en VS Code
2. Agrega estas líneas al final:

\`\`\`env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
\`\`\`

3. Reemplaza los valores con los que copiaste de Cloudinary
4. Guarda el archivo

## Paso 4: Agregar credenciales a Vercel

1. Ve a Vercel: https://vercel.com
2. Entra a tu proyecto "cafeteria-pantojito"
3. Ve a Settings → Environment Variables
4. Agrega estas 3 variables:

**Variable 1:**
- Key: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Value: Tu Cloud Name de Cloudinary
- Environment: Production, Preview, Development (las 3)

**Variable 2:**
- Key: `CLOUDINARY_API_KEY`
- Value: Tu API Key de Cloudinary
- Environment: Production, Preview, Development (las 3)

**Variable 3:**
- Key: `CLOUDINARY_API_SECRET`
- Value: Tu API Secret de Cloudinary
- Environment: Production, Preview, Development (las 3)

## Paso 5: Instalar dependencia y desplegar

1. En la terminal de VS Code, ejecuta:

\`\`\`bash
npm install cloudinary
\`\`\`

2. Sube los cambios a GitHub:

\`\`\`bash
git add .
git commit -m "Configurar Cloudinary para subir imágenes"
git push
\`\`\`

3. Vercel automáticamente desplegará los cambios

## Paso 6: Probar

1. Espera 2-3 minutos a que termine el despliegue
2. Ve a tu sitio: https://cafeteria-pantojito.vercel.app/admin
3. Intenta subir una imagen de producto
4. Ahora debería funcionar correctamente

## Ventajas de Cloudinary

- Almacenamiento en la nube (funciona en Vercel)
- Optimización automática de imágenes
- CDN global (carga rápida desde cualquier lugar)
- Plan gratuito: 25GB de almacenamiento y 25GB de ancho de banda al mes
- Las imágenes se redimensionan automáticamente a 800x800px

## Solución de problemas

### Error: "Invalid credentials"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de no tener espacios al inicio o final

### Error: "Cloud name not found"
- Verifica que el Cloud Name sea correcto
- Debe ser exactamente como aparece en el Dashboard de Cloudinary

### Las imágenes no se ven en el celular
- Cloudinary optimiza automáticamente las imágenes
- Las imágenes se sirven desde un CDN global
- Deberían cargar rápido en cualquier dispositivo
