# 🚀 Desplegar Cafetería Pantojito en Vercel

## ¿Por qué Vercel?

- ✅ **Gratis** para proyectos personales
- ✅ **URL pública** - Cualquiera puede acceder desde cualquier lugar
- ✅ **Rápido** - Se despliega en minutos
- ✅ **Actualizaciones automáticas** - Cada vez que hagas cambios
- ✅ **HTTPS automático** - Seguro por defecto

---

## 📋 Requisitos Previos

1. Cuenta en GitHub (gratis): https://github.com
2. Cuenta en Vercel (gratis): https://vercel.com
3. Base de datos en la nube (PlanetScale, Railway, o Supabase)

---

## 🗄️ PASO 1: Configurar Base de Datos en la Nube

### Opción A: PlanetScale (Recomendado)

1. **Crear cuenta:** https://planetscale.com
2. **Crear nueva base de datos:**
   - Nombre: `cafeteria-pantojito`
   - Región: Selecciona la más cercana
3. **Crear contraseña:**
   - Ve a "Settings" → "Passwords"
   - Haz clic en "New password"
   - Nombre: `production`
   - Copia la **Connection String** (empieza con `mysql://`)
4. **Importar tus datos:**
   - Ve a "Console"
   - Pega el contenido de `scripts/BASE-DATOS-COMPLETA.sql`
   - Ejecuta

---

## 📤 PASO 2: Subir tu Proyecto a GitHub

### Si no tienes Git instalado:

**Descargar Git:** https://git-scm.com/downloads

### Subir el proyecto:

1. **Abre la terminal en tu proyecto**

2. **Inicializar Git:**
   \`\`\`bash
   git init
   \`\`\`

3. **Crear archivo .gitignore:**
   
   Crea un archivo llamado `.gitignore` en la raíz del proyecto con este contenido:
   
   \`\`\`
   node_modules
   .next
   .env
   .env.local
   .vercel
   *.log
   .DS_Store
   \`\`\`

4. **Agregar archivos:**
   \`\`\`bash
   git add .
   \`\`\`

5. **Hacer commit:**
   \`\`\`bash
   git commit -m "Initial commit - Cafeteria Pantojito"
   \`\`\`

6. **Crear repositorio en GitHub:**
   - Ve a: https://github.com/new
   - Nombre: `cafeteria-pantojito`
   - Visibilidad: Privado (recomendado)
   - NO marques ninguna opción adicional
   - Haz clic en "Create repository"

7. **Conectar y subir:**
   
   Copia los comandos que GitHub te muestra (algo como):
   
   \`\`\`bash
   git remote add origin https://github.com/TU-USUARIO/cafeteria-pantojito.git
   git branch -M main
   git push -u origin main
   \`\`\`

---

## 🚀 PASO 3: Desplegar en Vercel

1. **Ir a Vercel:** https://vercel.com

2. **Iniciar sesión con GitHub**

3. **Importar proyecto:**
   - Haz clic en "Add New..." → "Project"
   - Busca `cafeteria-pantojito`
   - Haz clic en "Import"

4. **Configurar el proyecto:**
   - **Framework Preset:** Next.js (se detecta automáticamente)
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next

5. **Agregar Variables de Entorno:**
   
   Haz clic en "Environment Variables" y agrega:
   
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Tu connection string de PlanetScale |
   | `JWT_SECRET` | `tu-secreto-super-seguro-123456` |
   | `EMAIL_USER` | `tu-correo@gmail.com` |
   | `EMAIL_PASSWORD` | `tu-contraseña-de-aplicacion-16-digitos` |

6. **Desplegar:**
   - Haz clic en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! Verás tu URL pública

---

## 🔗 PASO 4: Obtener tu URL

Después del despliegue, verás algo como:

\`\`\`
https://cafeteria-pantojito.vercel.app
\`\`\`

**¡Esa es tu URL pública!** Compártela con quien quieras.

---

## 🔄 PASO 5: Actualizar el Proyecto

Cada vez que hagas cambios:

\`\`\`bash
git add .
git commit -m "Descripción de los cambios"
git push
\`\`\`

Vercel detectará los cambios y desplegará automáticamente.

---

## ⚙️ Configuración Adicional

### Dominio Personalizado (Opcional)

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio (ej: `cafeteriapantojito.com`)

### Configurar Prisma para Producción

Agrega este script a `package.json`:

\`\`\`json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
\`\`\`

---

## 🐛 Solución de Problemas

### Error: "Prisma Client not generated"

En Vercel, ve a:
- Settings → General → Build & Development Settings
- Build Command: `prisma generate && next build`

### Error: "Database connection failed"

Verifica que:
1. La `DATABASE_URL` en Vercel sea correcta
2. La base de datos en PlanetScale esté activa
3. Hayas importado las tablas correctamente

### Error: "Module not found"

\`\`\`bash
# Localmente, ejecuta:
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
\`\`\`

---

## 📊 Monitoreo

### Ver logs en tiempo real:

1. Ve a tu proyecto en Vercel
2. Haz clic en "Deployments"
3. Selecciona el deployment activo
4. Haz clic en "View Function Logs"

---

## 💰 Límites del Plan Gratis

- ✅ Despliegues ilimitados
- ✅ 100 GB de ancho de banda/mes
- ✅ Dominios personalizados ilimitados
- ✅ HTTPS automático
- ✅ Funciones serverless

**Suficiente para:**
- Proyectos personales
- Portafolios
- Aplicaciones pequeñas/medianas
- Prototipos

---

## 🎉 ¡Listo!

Ahora tu Cafetería Pantojito está en línea y accesible desde cualquier dispositivo con internet.

**Comparte tu URL:**
\`\`\`
https://tu-proyecto.vercel.app
\`\`\`

---

## 📝 Checklist Final

- [ ] Base de datos en la nube configurada
- [ ] Datos importados a la base de datos
- [ ] Proyecto subido a GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Proyecto desplegado exitosamente
- [ ] URL pública funcionando
- [ ] Probado desde celular/otro dispositivo
- [ ] Usuario administrador creado

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona, avísame y te ayudo paso a paso.
