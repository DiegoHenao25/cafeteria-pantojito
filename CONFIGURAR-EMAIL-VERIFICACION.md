# Configurar Verificación por Email

## Paso 1: Configurar Gmail para enviar correos

### Opción A: Usar Contraseña de Aplicación (Recomendado)

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, selecciona **Seguridad**
3. Activa la **Verificación en dos pasos** si no la tienes activada
4. Busca **Contraseñas de aplicaciones**
5. Selecciona **Correo** y **Otro (nombre personalizado)**
6. Escribe "Cafetería Pantojito" y haz clic en **Generar**
7. Copia la contraseña de 16 caracteres que aparece

### Opción B: Permitir aplicaciones menos seguras (No recomendado)

1. Ve a: https://myaccount.google.com/lesssecureapps
2. Activa "Permitir aplicaciones menos seguras"

## Paso 2: Configurar variables de entorno

Abre tu archivo `.env` y agrega:

\`\`\`env
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion
\`\`\`

**Ejemplo:**
\`\`\`env
EMAIL_USER=cafeteria.pantojito@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
\`\`\`

## Paso 3: Agregar tabla OTP a la base de datos

### Opción A: Usando el script SQL

1. Abre phpMyAdmin (http://localhost/phpmyadmin)
2. Selecciona la base de datos `cafeteria_pantojito`
3. Ve a la pestaña **SQL**
4. Copia y pega el contenido del archivo `scripts/add-otp-table.sql`
5. Haz clic en **Continuar**

### Opción B: Usando Prisma

\`\`\`bash
npx prisma db push
\`\`\`

## Paso 4: Probar el sistema

1. Reinicia el servidor: `npm run dev`
2. Ve a la página de registro
3. Completa el formulario
4. Haz clic en "Enviar código de verificación"
5. Revisa tu correo (puede tardar 1-2 minutos)
6. Ingresa el código de 6 dígitos
7. Completa el registro

## Solución de problemas

### No llega el correo

1. **Revisa la carpeta de spam**
2. **Verifica las credenciales** en el archivo `.env`
3. **Revisa la consola** del servidor para ver errores
4. **Prueba con otro correo** (a veces Gmail bloquea temporalmente)

### Error "Invalid login"

- Asegúrate de usar una **Contraseña de Aplicación**, no tu contraseña normal de Gmail
- Verifica que la verificación en dos pasos esté activada

### El código expira muy rápido

- Los códigos expiran en 10 minutos
- Si necesitas más tiempo, edita `app/api/auth/send-otp/route.ts` y cambia:
  \`\`\`typescript
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
  \`\`\`

## Alternativa: Sistema de Link de Verificación

Si prefieres usar un link en lugar de código, puedo implementarlo. El link sería algo como:

\`\`\`
http://localhost:3000/verify?token=abc123xyz789
\`\`\`

Avísame si quieres esta opción en lugar del código.
