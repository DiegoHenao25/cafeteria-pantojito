# Verificar Configuración de Email

## Problema: Error de Certificado SSL

Si ves el error `self-signed certificate in certificate chain`, sigue estos pasos:

## Paso 1: Verificar Variables de Entorno

Asegúrate de que tu archivo `.env` tenga estas variables configuradas:

\`\`\`env
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-16-digitos
\`\`\`

**IMPORTANTE:** 
- `EMAIL_USER` debe ser tu correo completo de Gmail (ejemplo: diegohenao.cortes@gmail.com)
- `EMAIL_PASSWORD` debe ser la contraseña de aplicación de 16 dígitos (sin espacios)

## Paso 2: Obtener Contraseña de Aplicación de Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, selecciona **Seguridad**
3. En "Cómo inicias sesión en Google", activa la **Verificación en dos pasos** (si no está activada)
4. Una vez activada, busca **Contraseñas de aplicaciones**
5. Selecciona "Correo" y "Otro (nombre personalizado)"
6. Escribe "Cafetería Pantojito" y haz clic en **Generar**
7. Copia la contraseña de 16 dígitos (sin espacios)
8. Pégala en tu archivo `.env` como `EMAIL_PASSWORD`

## Paso 3: Reiniciar el Servidor

Después de configurar las variables de entorno:

\`\`\`bash
# Detén el servidor (Ctrl + C)
# Luego reinicia:
npm run dev
\`\`\`

## Paso 4: Probar el Envío de Correo

Intenta registrarte nuevamente. Si todo está configurado correctamente, deberías recibir el código en tu correo.

## Solución de Problemas

### Error: "Invalid login"
- Verifica que la contraseña de aplicación sea correcta (16 dígitos sin espacios)
- Asegúrate de que la verificación en dos pasos esté activada

### Error: "self-signed certificate"
- Ya está solucionado en el código con `tls: { rejectUnauthorized: false }`
- Si persiste, verifica que estés usando Node.js versión 16 o superior

### No llega el correo
- Revisa la carpeta de spam
- Verifica que el correo en `EMAIL_USER` sea correcto
- Espera unos minutos, a veces Gmail tarda en entregar

### Ver logs en la consola
Los mensajes de correo se registran en la consola de Visual Studio Code donde corre `npm run dev`. Busca mensajes que digan `[v0] Correo enviado:` o `[v0] Error al enviar correo:`

## Verificar Conexión Manualmente

Puedes verificar la conexión ejecutando:

\`\`\`bash
npm run db:verify
\`\`\`

Esto te dirá si la configuración de correo es correcta antes de intentar registrarte.
