# Configurar Email para Verificación OTP

## Paso 1: Configurar Gmail

Para enviar correos de verificación, necesitas configurar una cuenta de Gmail:

### 1. Habilitar verificación en 2 pasos
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona "Seguridad" en el menú lateral
3. En "Acceso a Google", activa "Verificación en 2 pasos"

### 2. Crear contraseña de aplicación
1. Ve a https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "Cafetería UCP" como nombre
4. Haz clic en "Generar"
5. Copia la contraseña de 16 caracteres que aparece

## Paso 2: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (si no existe) y agrega:

\`\`\`env
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=la_contraseña_de_aplicacion_de_16_caracteres
\`\`\`

**Importante:** Usa la contraseña de aplicación generada, NO tu contraseña normal de Gmail.

## Paso 3: Instalar dependencias

\`\`\`bash
npm install nodemailer
npm install --save-dev @types/nodemailer
\`\`\`

## Paso 4: Arreglar contraseña del administrador

Si ya intentaste registrarte con el correo de administrador y no funciona:

\`\`\`bash
node scripts/fix-admin-password.js
\`\`\`

Esto te dará un comando SQL para actualizar la contraseña correctamente.

## Paso 5: Probar el sistema

1. Ve a `/register`
2. Ingresa tus datos
3. Haz clic en "Enviar código de verificación"
4. Revisa tu correo (puede tardar unos segundos)
5. Ingresa el código de 6 dígitos
6. Completa el registro

## Solución de problemas

### No llega el correo
- Verifica que EMAIL_USER y EMAIL_PASSWORD estén correctos en `.env`
- Revisa la carpeta de spam
- Asegúrate de tener verificación en 2 pasos activada
- Verifica que la contraseña de aplicación sea correcta

### Error "Invalid login"
- Regenera la contraseña de aplicación en Google
- Asegúrate de no tener espacios en la contraseña en el archivo `.env`

### El administrador no puede iniciar sesión
- Ejecuta el script `fix-admin-password.js`
- Copia el comando SQL que genera
- Ejecútalo en tu base de datos MySQL
\`\`\`

```json file="" isHidden
