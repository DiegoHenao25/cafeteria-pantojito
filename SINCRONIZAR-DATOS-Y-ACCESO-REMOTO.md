# 🔄 Sincronizar Datos entre PC y Laptop + Acceso Remoto

## 📋 Tabla de Contenidos
1. [Sincronizar Base de Datos entre PC y Laptop](#sincronizar-base-de-datos)
2. [Acceso desde Otros Dispositivos (Celular, Tablets)](#acceso-desde-otros-dispositivos)
3. [Solución Permanente: Base de Datos en la Nube](#solución-permanente)

---

## 🔄 PARTE 1: Sincronizar Base de Datos entre PC y Laptop

### Opción A: Exportar e Importar Base de Datos (Recomendado para empezar)

#### 📤 EN TU PC DE ESCRITORIO (donde tienes los datos):

**Paso 1: Exportar la base de datos**

1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Haz clic en la base de datos `cafeteria_pantojito` en el panel izquierdo
3. Haz clic en la pestaña **"Exportar"** arriba
4. Selecciona:
   - Método de exportación: **Rápido**
   - Formato: **SQL**
5. Haz clic en **"Continuar"**
6. Se descargará un archivo llamado `cafeteria_pantojito.sql`
7. **Guarda este archivo en una USB o envíatelo por correo/WhatsApp**

**Paso 2: Copiar el proyecto completo**

Copia toda la carpeta del proyecto a una USB o súbela a Google Drive/OneDrive

---

#### 📥 EN TU LAPTOP (donde quieres tener los datos):

**Paso 1: Instalar XAMPP**

Si no lo tienes instalado, descárgalo de: https://www.apachefriends.org/

**Paso 2: Iniciar MySQL en XAMPP**

1. Abre XAMPP Control Panel
2. Haz clic en **"Start"** en MySQL
3. Espera a que diga "Running"

**Paso 3: Crear la base de datos vacía**

1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Haz clic en **"Nueva"** en el panel izquierdo
3. Nombre: `cafeteria_pantojito`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en **"Crear"**

**Paso 4: Importar los datos de tu PC de escritorio**

1. Selecciona la base de datos `cafeteria_pantojito` que acabas de crear
2. Haz clic en la pestaña **"Importar"** arriba
3. Haz clic en **"Seleccionar archivo"**
4. Busca el archivo `cafeteria_pantojito.sql` que copiaste de tu PC
5. Haz clic en **"Continuar"** abajo
6. Espera a que termine (verás un mensaje verde de éxito)

**Paso 5: Copiar el proyecto**

1. Copia la carpeta del proyecto a tu laptop
2. Abre la carpeta en Visual Studio Code

**Paso 6: Instalar dependencias**

Abre la terminal en VS Code y ejecuta:

\`\`\`bash
npm install
\`\`\`

**Paso 7: Configurar variables de entorno**

Crea el archivo `.env` con:

\`\`\`env
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"
JWT_SECRET="tu-secreto-super-seguro-cambialo-por-algo-aleatorio-123456"
EMAIL_USER="tu-correo@gmail.com"
EMAIL_PASSWORD="tu-contraseña-de-aplicacion-16-digitos"
\`\`\`

**Paso 8: Iniciar el proyecto**

\`\`\`bash
npm run dev
\`\`\`

**¡Listo!** Ahora tu laptop tiene exactamente los mismos datos que tu PC de escritorio.

---

### 🔄 Mantener Sincronizados los Datos

**Cada vez que hagas cambios en una computadora y quieras pasarlos a la otra:**

1. Exporta la base de datos desde phpMyAdmin (Exportar → SQL)
2. Copia el archivo .sql a la otra computadora
3. En la otra computadora: phpMyAdmin → Importar → Seleccionar archivo

---

## 📱 PARTE 2: Acceso desde Otros Dispositivos (Celular, Tablets)

### ¿Por qué no funciona localhost:3000 en tu celular?

`localhost` significa "esta computadora". Tu celular no puede acceder a `localhost` de tu PC porque son dispositivos diferentes.

### Solución: Usar la IP Local de tu PC

#### Paso 1: Encontrar la IP de tu PC

**En Windows:**

1. Abre **CMD** (Símbolo del sistema)
2. Escribe: `ipconfig`
3. Busca **"Dirección IPv4"** en la sección "Adaptador de LAN inalámbrica" o "Ethernet"
4. Verás algo como: `192.168.1.5` o `192.168.0.10`
5. **Anota esta IP**

**En Mac/Linux:**

1. Abre Terminal
2. Escribe: `ifconfig` o `ip addr`
3. Busca tu IP local (empieza con 192.168.X.X)

#### Paso 2: Configurar Next.js para aceptar conexiones externas

En tu proyecto, cuando ejecutes el servidor, usa:

\`\`\`bash
npm run dev -- -H 0.0.0.0
\`\`\`

O crea un script en `package.json`:

\`\`\`json
"scripts": {
  "dev": "next dev",
  "dev:network": "next dev -H 0.0.0.0",
  // ... otros scripts
}
\`\`\`

Luego ejecuta:

\`\`\`bash
npm run dev:network
\`\`\`

#### Paso 3: Acceder desde otros dispositivos

**IMPORTANTE:** Tu celular/tablet debe estar conectado a la **misma red WiFi** que tu PC.

En tu celular/tablet, abre el navegador y ve a:

\`\`\`
http://TU_IP_LOCAL:3000
\`\`\`

Por ejemplo, si tu IP es `192.168.1.5`:

\`\`\`
http://192.168.1.5:3000
\`\`\`

#### Paso 4: Configurar el Firewall (si no funciona)

**En Windows:**

1. Busca "Firewall de Windows Defender"
2. Haz clic en "Configuración avanzada"
3. Haz clic en "Reglas de entrada"
4. Haz clic en "Nueva regla..."
5. Selecciona "Puerto" → Siguiente
6. TCP → Puerto específico: `3000` → Siguiente
7. Permitir la conexión → Siguiente
8. Marca todas las opciones → Siguiente
9. Nombre: "Next.js Dev Server" → Finalizar

---

## 🌐 PARTE 3: Solución Permanente - Base de Datos en la Nube

Para que SIEMPRE estén sincronizados y cualquiera pueda acceder desde cualquier lugar:

### Opción 1: Desplegar en Vercel (GRATIS)

**Ventajas:**
- Gratis
- Acceso desde cualquier dispositivo con internet
- URL pública (ej: cafeteria-pantojito.vercel.app)
- Actualizaciones automáticas

**Pasos:**

1. **Crear cuenta en Vercel:** https://vercel.com
2. **Instalar Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`
3. **Desplegar:**
   \`\`\`bash
   vercel
   \`\`\`
4. Sigue las instrucciones en pantalla

**IMPORTANTE:** Necesitarás una base de datos en la nube (ver abajo)

---

### Opción 2: Base de Datos en la Nube

Para que ambas computadoras usen la misma base de datos:

#### A) PlanetScale (Recomendado - GRATIS)

1. **Crear cuenta:** https://planetscale.com
2. **Crear base de datos:** "cafeteria_pantojito"
3. **Obtener la URL de conexión**
4. **Actualizar `.env`:**
   \`\`\`env
   DATABASE_URL="mysql://usuario:password@host.planetscale.com/cafeteria_pantojito?sslaccept=strict"
   \`\`\`

#### B) Railway (Alternativa - GRATIS)

1. **Crear cuenta:** https://railway.app
2. **Crear proyecto nuevo**
3. **Agregar MySQL**
4. **Copiar la URL de conexión**
5. **Actualizar `.env`**

#### C) Supabase (Alternativa - GRATIS)

1. **Crear cuenta:** https://supabase.com
2. **Crear proyecto nuevo**
3. **Ir a Settings → Database**
4. **Copiar la Connection String**
5. **Actualizar `.env`**

---

## 🎯 Resumen de Soluciones

### Para Desarrollo Local (PC y Laptop):

| Método | Ventajas | Desventajas |
|--------|----------|-------------|
| **Exportar/Importar DB** | Simple, no requiere internet | Manual, hay que hacerlo cada vez |
| **IP Local** | Acceso desde celular en misma WiFi | Solo funciona en tu red local |
| **DB en la Nube** | Siempre sincronizado | Requiere internet |

### Para Acceso Público (Cualquier persona, cualquier lugar):

| Método | Ventajas | Desventajas |
|--------|----------|-------------|
| **Vercel + DB en la Nube** | Gratis, profesional, rápido | Requiere configuración inicial |
| **Railway** | Todo en uno, fácil | Plan gratis limitado |

---

## 📝 Comandos Rápidos de Referencia

### Exportar base de datos (desde terminal):

\`\`\`bash
# En la carpeta de XAMPP (C:\xampp\mysql\bin en Windows)
mysqldump -u root cafeteria_pantojito > backup.sql
\`\`\`

### Importar base de datos (desde terminal):

\`\`\`bash
# En la carpeta de XAMPP
mysql -u root cafeteria_pantojito < backup.sql
\`\`\`

### Iniciar servidor para acceso en red local:

\`\`\`bash
npm run dev -- -H 0.0.0.0
\`\`\`

### Ver tu IP local:

\`\`\`bash
# Windows
ipconfig

# Mac/Linux
ifconfig
\`\`\`

---

## ❓ Preguntas Frecuentes

### ¿Los datos se sincronizan automáticamente entre PC y laptop?

No, con XAMPP local debes exportar/importar manualmente. Para sincronización automática, usa una base de datos en la nube.

### ¿Puedo usar mi PC de escritorio como servidor?

Sí, pero tu PC debe estar siempre encendida y conectada a internet. Es mejor usar Vercel o Railway.

### ¿Cuál es la mejor opción para un proyecto real?

**Vercel (frontend) + PlanetScale (base de datos)** - Ambos gratis y profesionales.

### ¿Cómo hago para que mi amigo pueda acceder?

- **Opción 1:** Usa tu IP local (ej: 192.168.1.5:3000) si está en tu misma WiFi
- **Opción 2:** Despliega en Vercel y comparte el link público

---

## 🚀 Recomendación Final

**Para desarrollo y pruebas:**
- Usa XAMPP local y exporta/importa cuando cambies de computadora
- Usa IP local para probar en tu celular

**Para producción (que otras personas usen):**
- Despliega en Vercel (gratis)
- Usa PlanetScale para la base de datos (gratis)
- Tendrás una URL como: `https://cafeteria-pantojito.vercel.app`

---

## 📞 Necesitas Ayuda?

Si tienes problemas con alguno de estos pasos, avísame y te ayudo específicamente con lo que necesites.
