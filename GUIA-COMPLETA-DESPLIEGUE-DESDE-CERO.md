# 🚀 GUÍA COMPLETA: Subir tu Cafetería a Internet desde CERO

**Objetivo:** Que cualquier persona desde cualquier lugar pueda entrar a tu página web y comprar productos.

**Lo que vamos a hacer:**
1. ✅ Instalar Git en tu PC
2. ✅ Crear cuenta en GitHub y subir tu proyecto
3. ✅ Crear cuenta en Vercel y desplegar tu aplicación
4. ✅ Crear base de datos en PlanetScale (MySQL gratis en la nube)
5. ✅ Importar tus datos de XAMPP a PlanetScale
6. ✅ Configurar variables de entorno
7. ✅ Obtener tu URL pública

---

## 📋 REQUISITOS PREVIOS

- ✅ Ya tienes el archivo de base de datos exportado de XAMPP
- ✅ Tienes Visual Studio Code instalado
- ✅ Tienes tu proyecto funcionando en localhost

---

## PASO 1: INSTALAR GIT EN TU PC

### Windows:

1. **Descarga Git:**
   - Ve a: https://git-scm.com/download/win
   - Descarga la versión de 64-bit

2. **Instala Git:**
   - Ejecuta el instalador descargado
   - Deja todas las opciones por defecto
   - Haz clic en "Next" hasta terminar

3. **Verifica la instalación:**
   - Abre Visual Studio Code
   - Abre una nueva terminal: `Terminal` → `New Terminal`
   - Escribe este comando:

\`\`\`bash
git --version
\`\`\`

   - Deberías ver algo como: `git version 2.43.0`

---

## PASO 2: CONFIGURAR GIT

**Abre la terminal en VS Code y copia estos comandos UNO POR UNO:**

\`\`\`bash
git config --global user.name "Tu Nombre"
\`\`\`

\`\`\`bash
git config --global user.email "tu-email@gmail.com"
\`\`\`

**Reemplaza:**
- `"Tu Nombre"` por tu nombre real (ejemplo: "Diego Henao")
- `"tu-email@gmail.com"` por tu correo real

---

## PASO 3: CREAR CUENTA EN GITHUB

1. **Ve a:** https://github.com

2. **Haz clic en "Sign up"**

3. **Completa el registro:**
   - Email: Tu correo
   - Password: Una contraseña segura
   - Username: Un nombre de usuario (ejemplo: diegohenao)

4. **Verifica tu correo electrónico**

5. **Inicia sesión en GitHub**

---

## PASO 4: CREAR ARCHIVO .gitignore

**En Visual Studio Code, crea un archivo llamado `.gitignore` en la raíz de tu proyecto:**
