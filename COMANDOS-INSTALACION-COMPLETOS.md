# 🚀 COMANDOS DE INSTALACIÓN COMPLETOS - CAFETERÍA PANTOJITO

**Copia y pega estos comandos en orden. No te saltes ninguno.**

---

## ✅ PASO 1: Limpiar Instalación Anterior (Si existe)

\`\`\`bash
rm -rf node_modules package-lock.json
npm cache clean --force
\`\`\`

---

## 📦 PASO 2: Instalar TODAS las Dependencias Principales

**Copia y pega este comando completo (es largo pero es UN SOLO comando):**

\`\`\`bash
npm install next@15.1.6 react@19.0.0 react-dom@19.0.0 @prisma/client@6.16.3 bcryptjs@2.4.3 jose@6.1.0 sharp@0.32.6 class-variance-authority@0.7.1 clsx@2.1.1 lucide-react@0.544.0 tailwind-merge@3.3.1 tailwindcss-animate@1.0.7 swr@2.2.4 mysql2@3.15.1 nodemailer@7.0.9 geist@1.5.1 @vercel/analytics@1.5.0 jsonwebtoken@9.0.2 tw-animate-css@1.4.0
\`\`\`

---

## 🛠️ PASO 3: Instalar Dependencias de Desarrollo

**Copia y pega este comando completo:**

\`\`\`bash
npm install -D typescript@5 @types/node@20 @types/react@19 @types/react-dom@19 @types/bcryptjs@2.4.6 @types/nodemailer@6.4.14 @types/jsonwebtoken@9.0.5 eslint@8 eslint-config-next@15.1.6 tailwindcss@4.1.9 @tailwindcss/postcss@4.1.9 postcss@8.5.6 prisma@6.16.3
\`\`\`

---

## 🎨 PASO 4: Instalar Componentes de shadcn/ui

**Copia y pega CADA comando UNO POR UNO:**

### Componentes Básicos:

\`\`\`bash
npx shadcn@latest add button
\`\`\`

\`\`\`bash
npx shadcn@latest add card
\`\`\`

\`\`\`bash
npx shadcn@latest add input
\`\`\`

\`\`\`bash
npx shadcn@latest add label
\`\`\`

\`\`\`bash
npx shadcn@latest add badge
\`\`\`

\`\`\`bash
npx shadcn@latest add dialog
\`\`\`

\`\`\`bash
npx shadcn@latest add select
\`\`\`

\`\`\`bash
npx shadcn@latest add textarea
\`\`\`

\`\`\`bash
npx shadcn@latest add radio-group
\`\`\`

### Componentes Adicionales (si los necesitas):

\`\`\`bash
npx shadcn@latest add dropdown-menu
\`\`\`

\`\`\`bash
npx shadcn@latest add popover
\`\`\`

\`\`\`bash
npx shadcn@latest add toast
\`\`\`

\`\`\`bash
npx shadcn@latest add avatar
\`\`\`

\`\`\`bash
npx shadcn@latest add separator
\`\`\`

\`\`\`bash
npx shadcn@latest add checkbox
\`\`\`

\`\`\`bash
npx shadcn@latest add slider
\`\`\`

\`\`\`bash
npx shadcn@latest add progress
\`\`\`

\`\`\`bash
npx shadcn@latest add tooltip
\`\`\`

---

## 🗄️ PASO 5: Configurar Prisma

**Copia y pega estos comandos uno por uno:**

\`\`\`bash
npx prisma generate
\`\`\`

\`\`\`bash
npx prisma db push
\`\`\`

---

## 📧 PASO 6: Configurar Variables de Entorno

1. **Crea el archivo `.env` en la raíz del proyecto** (al mismo nivel que package.json)

2. **Copia y pega este contenido en el archivo `.env`:**

\`\`\`env
# Base de datos XAMPP
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"

# JWT Secret
JWT_SECRET="cafeteria-pantojito-secret-key-super-segura-2024"

# Email para verificación
EMAIL_USER="tu-correo@gmail.com"
EMAIL_PASSWORD="xxxx xxxx xxxx xxxx"
\`\`\`

3. **Reemplaza estos valores:**
   - `EMAIL_USER`: Tu correo de Gmail completo
   - `EMAIL_PASSWORD`: La contraseña de aplicación de 16 dígitos (con espacios) que generaste en Gmail

---

## 🗃️ PASO 7: Crear la Base de Datos

### Opción A: Usando phpMyAdmin (Recomendado)

1. Abre: http://localhost/phpmyadmin
2. Haz clic en "Nueva" (panel izquierdo)
3. Nombre: `cafeteria_pantojito`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en "Crear"
6. Selecciona la base de datos
7. Haz clic en la pestaña "SQL"
8. Copia y pega el contenido del archivo `scripts/BASE-DATOS-COMPLETA.sql`
9. Haz clic en "Continuar"

### Opción B: Usando Prisma (Alternativa)

\`\`\`bash
npx prisma db push
\`\`\`

---

## ✅ PASO 8: Verificar la Instalación

\`\`\`bash
npm run db:verify
\`\`\`

**Deberías ver:** ✅ Conexión exitosa a la base de datos

---

## 🚀 PASO 9: Iniciar el Proyecto

\`\`\`bash
npm run dev
\`\`\`

**Deberías ver:**
\`\`\`
✓ Ready in X ms
○ Local: http://localhost:3000
\`\`\`

---

## 🎉 ¡LISTO! Abre tu navegador en: http://localhost:3000

---

## 🔧 COMANDOS ÚTILES ADICIONALES

### Ver la base de datos en interfaz gráfica:
\`\`\`bash
npx prisma studio
\`\`\`

### Reiniciar el servidor:
\`\`\`
Ctrl + C (para detener)
npm run dev (para iniciar de nuevo)
\`\`\`

### Limpiar caché de Next.js:
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module '@tailwindcss/postcss'"
\`\`\`bash
npm install -D @tailwindcss/postcss@4.1.9
\`\`\`

### Error: "Cannot find module 'sharp'"
\`\`\`bash
npm install sharp@0.32.6
\`\`\`

### Error: "Cannot find module 'nodemailer'"
\`\`\`bash
npm install nodemailer@7.0.9
npm install -D @types/nodemailer@6.4.14
\`\`\`

### Error: "Prisma Client not generated"
\`\`\`bash
npx prisma generate
\`\`\`

### Error: "Port 3000 is already in use"
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Error al enviar correos:
1. Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén en `.env`
2. Asegúrate de usar una contraseña de aplicación de Gmail (16 dígitos)
3. Lee: `CONFIGURAR-EMAIL-VERIFICACION.md`

### Error: "Database connection failed"
1. Verifica que XAMPP MySQL esté corriendo (luz verde)
2. Verifica que la base de datos `cafeteria_pantojito` exista en phpMyAdmin
3. Verifica que el `DATABASE_URL` en `.env` sea exactamente: `mysql://root@localhost:3306/cafeteria_pantojito`

---

## 📝 NOTAS IMPORTANTES

1. **XAMPP debe estar corriendo** antes de iniciar el proyecto
2. **MySQL debe tener luz verde** en el panel de XAMPP
3. El archivo `.env` debe estar en la **raíz del proyecto** (mismo nivel que package.json)
4. Si cambias algo en `.env`, **reinicia el servidor** (Ctrl+C y npm run dev)
5. Si instalas nuevas dependencias, **reinicia el servidor**

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `INSTALAR-TODO.md` - Guía de instalación paso a paso
- `GUIA-PHPMYADMIN.md` - Cómo usar phpMyAdmin
- `CONFIGURAR-EMAIL-VERIFICACION.md` - Configurar Gmail
- `INSTALACION-COMPLETA-PC-NUEVA.md` - Instalación desde cero
- `scripts/BASE-DATOS-COMPLETA.sql` - Script SQL completo

---

## 🆘 ¿SIGUES TENIENDO ERRORES?

1. **Copia el mensaje de error completo**
2. **Verifica que seguiste TODOS los pasos en orden**
3. **Asegúrate de que XAMPP esté corriendo**
4. **Revisa que el archivo `.env` esté configurado correctamente**
5. **Intenta limpiar e instalar de nuevo** (Paso 1 y 2)

---

**¡Con estos comandos tu proyecto debería funcionar perfectamente!** 🎉
