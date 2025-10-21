# 🔐 Cómo Cambiar el Rol de Usuario en XAMPP

Esta guía te muestra cómo asignar el rol de **administrador** a cualquier usuario desde phpMyAdmin en XAMPP.

---

## 📋 Pasos para Cambiar el Rol

### 1. Abrir phpMyAdmin

1. Asegúrate de que **XAMPP** esté corriendo
2. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
3. En el panel izquierdo, haz clic en la base de datos **`cafeteria_ucp`**

### 2. Ver los Usuarios Registrados

1. En la lista de tablas, haz clic en **`User`** (o `user`)
2. Verás todos los usuarios registrados con sus datos:
   - `id`: ID del usuario
   - `email`: Correo electrónico
   - `nombre`: Nombre completo
   - `password`: Contraseña hasheada
   - `rol`: Rol actual (`user` o `admin`)
   - `verificado`: Si el correo está verificado
   - `createdAt`: Fecha de registro

### 3. Cambiar el Rol a Administrador

**Opción A: Usando la Interfaz de phpMyAdmin**

1. Busca el usuario al que quieres dar permisos de administrador
2. Haz clic en el botón **"Editar"** (ícono de lápiz) en esa fila
3. En el campo **`rol`**, cambia el valor de `user` a `admin`
4. Haz clic en **"Continuar"** o **"Go"** para guardar los cambios

**Opción B: Usando SQL**

1. Haz clic en la pestaña **"SQL"** en la parte superior
2. Escribe esta consulta (reemplaza el email con el del usuario):

\`\`\`sql
UPDATE User 
SET rol = 'admin' 
WHERE email = 'correo@ejemplo.com';
\`\`\`

3. Haz clic en **"Continuar"** o **"Go"** para ejecutar

### 4. Verificar el Cambio

1. Vuelve a la pestaña **"Examinar"** de la tabla `User`
2. Verifica que el campo `rol` del usuario ahora diga **`admin`**

---

## 🎯 Resultado en la Página Web

Una vez que cambies el rol a `admin`, el usuario verá automáticamente:

### ✅ Al recargar la página:

1. **Badge "Admin"** junto a su nombre en el header
2. **Botón "Panel Admin"** en la barra superior (color morado)
3. Al hacer clic en "Panel Admin", accederá al **CRUD completo** donde puede:
   - ✏️ Crear, editar y eliminar productos
   - 📁 Gestionar categorías
   - 👀 Ver todos los pedidos
   - 📊 Administrar el inventario

### 👤 Los usuarios normales (rol: `user`):

- NO verán el badge "Admin"
- NO verán el botón "Panel Admin"
- Solo podrán ver el menú y hacer compras

---

## 🔄 Proceso Completo de Ejemplo

### Escenario: Tu amigo se registra y quieres hacerlo administrador

1. **Tu amigo se registra** en la página web con su correo: `amigo@gmail.com`
2. **Abres phpMyAdmin** → Base de datos `cafeteria_ucp` → Tabla `User`
3. **Buscas su correo** `amigo@gmail.com` en la lista
4. **Editas su registro** y cambias `rol` de `user` a `admin`
5. **Tu amigo recarga** la página web (F5 o Ctrl+R)
6. **Automáticamente ve** el botón "Panel Admin" y puede acceder al CRUD

---

## 📊 Tabla de Roles

| Rol | Permisos | Acceso al CRUD | Badge Visible |
|-----|----------|----------------|---------------|
| `user` | Ver menú, comprar productos | ❌ No | ❌ No |
| `admin` | Todo lo anterior + gestionar productos y categorías | ✅ Sí | ✅ Sí (morado) |

---

## 🛠️ Comandos SQL Útiles

### Ver todos los administradores:
\`\`\`sql
SELECT id, email, nombre, rol 
FROM User 
WHERE rol = 'admin';
\`\`\`

### Ver todos los usuarios normales:
\`\`\`sql
SELECT id, email, nombre, rol 
FROM User 
WHERE rol = 'user';
\`\`\`

### Cambiar múltiples usuarios a admin:
\`\`\`sql
UPDATE User 
SET rol = 'admin' 
WHERE email IN ('usuario1@gmail.com', 'usuario2@gmail.com', 'usuario3@gmail.com');
\`\`\`

### Quitar permisos de admin (volver a user):
\`\`\`sql
UPDATE User 
SET rol = 'user' 
WHERE email = 'correo@ejemplo.com';
\`\`\`

---

## ⚠️ Notas Importantes

1. **No es necesario reiniciar el servidor** - Los cambios se aplican inmediatamente
2. **El usuario debe recargar la página** para ver los cambios
3. **Guarda bien los correos de los administradores** para futuras referencias
4. **Solo da permisos de admin a personas de confianza** - tienen acceso total al sistema

---

## 🎓 Tu Usuario Administrador Principal

Recuerda que tu usuario principal es:
- **Email:** `diegohenao.cortes@gmail.com`
- **Contraseña:** `Alicesama25`
- **Rol:** `admin` (ya configurado)

---

¿Necesitas ayuda? Revisa la documentación en `INICIO-RAPIDO-XAMPP.md` o `CONFIGURAR-XAMPP.md`
