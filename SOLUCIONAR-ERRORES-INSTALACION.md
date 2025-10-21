# Solucionar Errores de Instalación - Cafetería Pantojito

## Problema: Errores al ejecutar `npm run dev`

Si ves errores como "Cannot find module '@tailwindcss/postcss'" o problemas con las dependencias, sigue estos pasos:

---

## Solución Paso a Paso

### 1. Eliminar instalaciones anteriores

Abre la terminal en Visual Studio Code (Ctrl + `) y ejecuta:

\`\`\`bash
# Eliminar node_modules y archivos de bloqueo
rmdir /s /q node_modules
del package-lock.json
del yarn.lock
\`\`\`

Si estás en Mac/Linux, usa:
\`\`\`bash
rm -rf node_modules package-lock.json yarn.lock
\`\`\`

---

### 2. Limpiar caché de npm

\`\`\`bash
npm cache clean --force
\`\`\`

---

### 3. Instalar todas las dependencias

\`\`\`bash
npm install
\`\`\`

Este comando instalará automáticamente todas las librerías necesarias que están en el `package.json`:

**Dependencias principales:**
- Next.js 15.1.6 (framework)
- React 19 (librería UI)
- Prisma (ORM para base de datos)
- TailwindCSS 4 (estilos)
- Nodemailer (envío de correos)
- bcryptjs (encriptación de contraseñas)
- jose (JWT para autenticación)
- SWR (manejo de datos)
- Lucide React (iconos)

---

### 4. Generar cliente de Prisma

\`\`\`bash
npm run prisma:generate
\`\`\`

---

### 5. Verificar instalación

Verifica que todo esté instalado correctamente:

\`\`\`bash
npm list --depth=0
\`\`\`

Deberías ver todas las dependencias listadas sin errores.

---

### 6. Intentar ejecutar el proyecto

\`\`\`bash
npm run dev
\`\`\`

---

## Si aún hay errores

### Error: "Cannot find module '@tailwindcss/postcss'"

Instala manualmente:
\`\`\`bash
npm install -D @tailwindcss/postcss
\`\`\`

### Error: "Cannot find module 'geist'"

Instala manualmente:
\`\`\`bash
npm install geist
\`\`\`

### Error: "Cannot find module '@types/...'

Instala los tipos que falten:
\`\`\`bash
npm install -D @types/jsonwebtoken @types/bcryptjs @types/nodemailer
\`\`\`

### Error con Prisma

\`\`\`bash
npm install @prisma/client prisma
npm run prisma:generate
\`\`\`

---

## Verificar versiones instaladas

\`\`\`bash
node --version    # Debe ser v18 o superior
npm --version     # Debe ser v9 o superior
\`\`\`

Si las versiones son antiguas, actualiza Node.js desde https://nodejs.org/

---

## Orden completo de comandos (copia y pega)

\`\`\`bash
# 1. Limpiar todo
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

# 2. Instalar dependencias
npm install

# 3. Generar Prisma
npm run prisma:generate

# 4. Ejecutar proyecto
npm run dev
\`\`\`

---

## Checklist de verificación

- [ ] Node.js v18+ instalado
- [ ] npm actualizado
- [ ] Carpeta node_modules eliminada
- [ ] package-lock.json eliminado
- [ ] npm install ejecutado sin errores
- [ ] prisma generate ejecutado
- [ ] XAMPP corriendo (Apache y MySQL)
- [ ] Base de datos creada
- [ ] Archivo .env configurado
- [ ] npm run dev funciona

---

## Contacto

Si después de seguir todos estos pasos aún tienes errores, copia el mensaje de error completo para poder ayudarte mejor.
