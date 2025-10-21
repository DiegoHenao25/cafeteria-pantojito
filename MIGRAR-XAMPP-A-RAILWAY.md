# 🚀 Migrar Base de Datos de XAMPP a Railway

## 📋 ¿Qué vas a hacer?

Vas a **copiar** todos los datos de tu XAMPP local (usuarios, productos, categorías, pedidos) a la base de datos de Railway en la nube.

**Después de esto:**
- ✅ Cualquier persona con cualquier IP podrá ver tu página
- ✅ Todos verán los mismos datos (productos, usuarios, etc.)
- ✅ Los cambios se guardan en Railway automáticamente
- ✅ Ya NO necesitas tener XAMPP prendido para que funcione
- ✅ Puedes seguir usando XAMPP en tu PC para probar cosas nuevas

---

## 🎯 PASO 1: Exportar Datos de XAMPP

### 1.1 Abre phpMyAdmin
\`\`\`
http://localhost/phpmyadmin
\`\`\`

### 1.2 Selecciona tu base de datos
- Haz clic en `cafeteria_pantojito` en el panel izquierdo

### 1.3 Exportar
1. Haz clic en la pestaña **"Exportar"** arriba
2. Selecciona **"Método: Personalizado"**
3. Selecciona **TODAS las tablas** (marca todas):
   - ✅ Usuario
   - ✅ Categoria
   - ✅ Producto
   - ✅ Pedido
   - ✅ PedidoDetalle
   - ✅ Carrito
   - ✅ Otp
4. En **"Formato"**: Deja **SQL**
5. En **"Opciones de formato"**:
   - ✅ Marca "Agregar DROP TABLE / VIEW / PROCEDURE / FUNCTION / EVENT / TRIGGER"
   - ✅ Marca "Agregar CREATE TABLE"
   - ✅ Marca "Agregar valor para columnas AUTO_INCREMENT"
6. Haz clic en **"Continuar"**
7. Se descargará un archivo: `cafeteria_pantojito.sql`

**Guarda este archivo en un lugar seguro** (Escritorio, Documentos, etc.)

---

## 🎯 PASO 2: Crear Base de Datos MySQL en Railway

### 2.1 Entra a Railway
\`\`\`
https://railway.app
\`\`\`

### 2.2 Abre tu proyecto
- Haz clic en tu proyecto "Cafeteria Pantojito"

### 2.3 Agregar MySQL
1. Haz clic en **"+ New"** (botón morado arriba a la derecha)
2. Selecciona **"Database"**
3. Selecciona **"Add MySQL"**
4. Espera 30 segundos mientras Railway crea la base de datos

### 2.4 Obtener credenciales de conexión
1. Haz clic en el servicio **"MySQL"** que acabas de crear
2. Ve a la pestaña **"Variables"**
3. Verás estas variables (cópialas en un bloc de notas):
   \`\`\`
   MYSQLHOST=containers-us-west-XXX.railway.app
   MYSQLPORT=6789
   MYSQLUSER=root
   MYSQLPASSWORD=tu-password-aqui
   MYSQLDATABASE=railway
   \`\`\`

### 2.5 Construir la URL de conexión
Copia esta plantilla y reemplaza los valores:
\`\`\`
mysql://MYSQLUSER:MYSQLPASSWORD@MYSQLHOST:MYSQLPORT/MYSQLDATABASE
\`\`\`

**Ejemplo:**
\`\`\`
mysql://root:abc123XYZ@containers-us-west-123.railway.app:6789/railway
\`\`\`

**Guarda esta URL**, la necesitarás en el siguiente paso.

---

## 🎯 PASO 3: Conectar tu Proyecto a Railway MySQL

### 3.1 Actualizar variables de entorno en Railway

1. En Railway, haz clic en tu servicio **"cafeteria-pantojito"** (el de Next.js)
2. Ve a la pestaña **"Variables"**
3. Busca la variable `DATABASE_URL`
4. Haz clic en **"Edit"** (lápiz)
5. **Reemplaza** el valor con la URL que construiste en el paso 2.5
6. Haz clic en **"Save"**

**Ejemplo:**
\`\`\`
DATABASE_URL=mysql://root:abc123XYZ@containers-us-west-123.railway.app:6789/railway
\`\`\`

### 3.2 Verificar otras variables
Asegúrate de que también tengas estas variables configuradas:
\`\`\`
JWT_SECRET=tu-secreto-super-seguro-123456
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion-16-digitos
\`\`\`

---

## 🎯 PASO 4: Importar Datos a Railway MySQL

### Opción A: Usar Railway CLI (Recomendado)

#### 4.1 Instalar Railway CLI
\`\`\`bash
npm install -g @railway/cli
\`\`\`

#### 4.2 Iniciar sesión
\`\`\`bash
railway login
\`\`\`
Se abrirá tu navegador, haz clic en "Authorize"

#### 4.3 Conectar a tu proyecto
\`\`\`bash
railway link
\`\`\`
Selecciona tu proyecto "Cafeteria Pantojito"

#### 4.4 Conectar a MySQL
\`\`\`bash
railway connect MySQL
\`\`\`

#### 4.5 Importar el archivo SQL
\`\`\`bash
railway run mysql -u root -p railway < ruta/al/archivo/cafeteria_pantojito.sql
\`\`\`

**Reemplaza** `ruta/al/archivo/` con la ubicación real de tu archivo.

**Ejemplo en Windows:**
\`\`\`bash
railway run mysql -u root -p railway < C:\Users\TuNombre\Desktop\cafeteria_pantojito.sql
\`\`\`

**Ejemplo en Mac/Linux:**
\`\`\`bash
railway run mysql -u root -p railway < ~/Desktop/cafeteria_pantojito.sql
\`\`\`

Te pedirá la contraseña de MySQL (la que copiaste en el paso 2.4)

---

### Opción B: Usar TablePlus o MySQL Workbench (Interfaz Gráfica)

#### 4.1 Descargar TablePlus (Gratis)
\`\`\`
https://tableplus.com/
\`\`\`

#### 4.2 Crear nueva conexión
1. Abre TablePlus
2. Haz clic en **"Create a new connection"**
3. Selecciona **"MySQL"**
4. Llena los datos (del paso 2.4):
   - **Name**: Railway - Cafeteria Pantojito
   - **Host**: `MYSQLHOST` (ej: containers-us-west-123.railway.app)
   - **Port**: `MYSQLPORT` (ej: 6789)
   - **User**: `MYSQLUSER` (ej: root)
   - **Password**: `MYSQLPASSWORD`
   - **Database**: `MYSQLDATABASE` (ej: railway)
5. Haz clic en **"Test"** para verificar la conexión
6. Haz clic en **"Connect"**

#### 4.3 Importar el archivo SQL
1. Una vez conectado, haz clic derecho en la base de datos
2. Selecciona **"Import"** → **"From SQL Dump"**
3. Selecciona el archivo `cafeteria_pantojito.sql` que exportaste
4. Haz clic en **"Import"**
5. Espera a que termine (puede tardar 1-2 minutos)

---

## 🎯 PASO 5: Verificar que Todo Funcione

### 5.1 Verificar en Railway
1. Ve a Railway
2. Haz clic en tu servicio MySQL
3. Ve a la pestaña **"Data"**
4. Deberías ver todas tus tablas con datos:
   - Usuario
   - Categoria
   - Producto
   - Pedido
   - etc.

### 5.2 Verificar en tu aplicación
1. Ve a la URL de tu aplicación en Railway (ej: `https://cafeteria-pantojito-production.up.railway.app`)
2. Deberías ver:
   - ✅ Todos tus productos
   - ✅ Todas tus categorías
   - ✅ Poder iniciar sesión con tus usuarios
   - ✅ Todo funcionando igual que en localhost

---

## 🎯 PASO 6: Configurar Desarrollo Local (Opcional)

Si quieres seguir usando XAMPP en tu PC para probar cosas nuevas:

### 6.1 Crear archivo `.env.local`
En la raíz de tu proyecto, crea un archivo llamado `.env.local`:

\`\`\`env
# Base de datos LOCAL (XAMPP)
DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"

# JWT Secret
JWT_SECRET="tu-secreto-super-seguro-123456"

# Email
EMAIL_USER="tu-correo@gmail.com"
EMAIL_PASSWORD="tu-contraseña-de-aplicacion-16-digitos"
\`\`\`

### 6.2 Cómo funciona ahora:
- **Cuando trabajas en tu PC** (`npm run dev`): Usa XAMPP (localhost)
- **Cuando despliegas en Railway**: Usa la base de datos de Railway (nube)

---

## 📊 Resumen: ¿Cómo funciona ahora?

### Antes (Solo XAMPP):
\`\`\`
Tu PC (XAMPP) → Solo tú puedes ver la página en localhost:3000
\`\`\`

### Después (Railway):
\`\`\`
Railway (Nube) → Cualquier persona con cualquier IP puede ver la página
                → URL pública: https://tu-app.up.railway.app
                → Base de datos en la nube (MySQL Railway)
\`\`\`

### Flujo de trabajo:
1. **Desarrollo**: Haces cambios en tu PC con VS Code
2. **Subir cambios**: `git push` desde VS Code
3. **Despliegue automático**: Railway detecta los cambios y actualiza la página (2-3 minutos)
4. **Resultado**: Todos ven los cambios en la URL pública

---

## ✅ Checklist Final

- [ ] Exporté los datos de XAMPP a un archivo `.sql`
- [ ] Creé la base de datos MySQL en Railway
- [ ] Copié las credenciales de MySQL de Railway
- [ ] Actualicé la variable `DATABASE_URL` en Railway
- [ ] Importé el archivo `.sql` a Railway MySQL
- [ ] Verifiqué que los datos estén en Railway
- [ ] Probé la URL pública y todo funciona
- [ ] (Opcional) Creé `.env.local` para desarrollo local

---

## 🆘 Solución de Problemas

### Error: "Access denied for user"
- Verifica que la contraseña de MySQL sea correcta
- Verifica que el usuario sea `root`
- Verifica que el host y puerto sean correctos

### Error: "Connection refused"
- Verifica que el servicio MySQL esté corriendo en Railway
- Verifica que el puerto sea correcto (no uses 3306, usa el puerto de Railway)

### No veo mis datos en Railway
- Verifica que el archivo `.sql` se haya importado correctamente
- Verifica que hayas seleccionado la base de datos correcta (`railway`)
- Intenta importar de nuevo

### La página no muestra los productos
- Verifica que la variable `DATABASE_URL` esté correcta en Railway
- Verifica que los datos estén en la base de datos de Railway
- Revisa los logs en Railway (pestaña "Deployments" → "View Logs")

---

## 🎉 ¡Listo!

Ahora tu aplicación está completamente en la nube. Cualquier persona desde cualquier IP puede acceder a tu página y ver los mismos datos.

**Próximos pasos:**
- Agrega más productos desde el panel de administración
- Comparte la URL con tus amigos para que prueben
- Configura un dominio personalizado (opcional)
