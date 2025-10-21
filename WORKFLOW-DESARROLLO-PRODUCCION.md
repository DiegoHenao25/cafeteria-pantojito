# 🔄 Flujo de Trabajo: Desarrollo Local vs Producción

## 📋 Entendiendo el Flujo

Ahora que tienes Railway configurado, vas a trabajar con **DOS ambientes**:

1. **Desarrollo Local** (Tu PC) - Para probar cosas nuevas
2. **Producción** (Railway) - Lo que todos ven en internet

---

## 🏠 Ambiente de Desarrollo Local (Tu PC)

### ¿Qué es?
Es tu PC donde haces cambios, pruebas cosas nuevas, y experimentas sin afectar la página pública.

### ¿Qué usa?
- **Base de datos**: XAMPP (localhost)
- **URL**: http://localhost:3000
- **Quién puede ver**: Solo tú en tu PC

### ¿Cuándo lo usas?
- Cuando quieres agregar una nueva funcionalidad
- Cuando quieres probar algo sin romper la página pública
- Cuando estás desarrollando

### Comandos:
\`\`\`bash
# Iniciar XAMPP
# (Abre XAMPP Control Panel y enciende MySQL)

# Iniciar el proyecto
npm run dev

# Ver en el navegador
http://localhost:3000
\`\`\`

---

## 🌍 Ambiente de Producción (Railway)

### ¿Qué es?
Es la página pública en internet que todos pueden ver.

### ¿Qué usa?
- **Base de datos**: MySQL de Railway (en la nube)
- **URL**: https://tu-app.up.railway.app
- **Quién puede ver**: Cualquier persona con cualquier IP

### ¿Cuándo se actualiza?
- Automáticamente cuando haces `git push`
- Railway detecta los cambios y actualiza la página en 2-3 minutos

### Comandos:
\`\`\`bash
# Subir cambios a producción
git add .
git commit -m "Descripción de los cambios"
git push
\`\`\`

---

## 🔄 Flujo de Trabajo Completo

### Paso 1: Hacer cambios en tu PC
\`\`\`bash
# 1. Asegúrate de que XAMPP esté corriendo
# 2. Inicia el proyecto
npm run dev

# 3. Haz tus cambios en VS Code
# 4. Prueba en http://localhost:3000
\`\`\`

### Paso 2: Subir cambios a producción
\`\`\`bash
# 1. Guarda todos los archivos en VS Code (Ctrl + S)

# 2. Abre la terminal en VS Code (Ctrl + `)

# 3. Agrega los cambios
git add .

# 4. Crea un commit con descripción
git commit -m "Agregué nueva categoría de postres"

# 5. Sube los cambios a GitHub
git push
\`\`\`

### Paso 3: Railway actualiza automáticamente
\`\`\`
1. Railway detecta el push a GitHub
2. Descarga los cambios
3. Construye la aplicación
4. Despliega la nueva versión
5. ¡Listo! (2-3 minutos)
\`\`\`

### Paso 4: Verificar en producción
\`\`\`
1. Ve a tu URL de Railway
2. Refresca la página (F5)
3. Verifica que los cambios estén ahí
\`\`\`

---

## 📊 Comparación Visual

| Aspecto | Desarrollo Local | Producción (Railway) |
|---------|------------------|----------------------|
| **Base de datos** | XAMPP (localhost) | MySQL Railway (nube) |
| **URL** | localhost:3000 | tu-app.up.railway.app |
| **Acceso** | Solo tú | Cualquier persona |
| **Cambios** | Instantáneos | 2-3 minutos después de push |
| **Datos** | Datos de prueba | Datos reales |
| **Propósito** | Probar y desarrollar | Página pública |

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Agregar un nuevo producto

**En Desarrollo Local:**
\`\`\`bash
1. npm run dev
2. Ve a http://localhost:3000/admin
3. Agrega el producto "Café Latte - $4500"
4. Verifica que se vea bien
5. Si todo está bien, continúa al siguiente paso
\`\`\`

**Subir a Producción:**
\`\`\`bash
# Si solo agregaste datos (no código), NO necesitas hacer push
# Los datos se agregan directamente en producción:

1. Ve a https://tu-app.up.railway.app/admin
2. Inicia sesión como admin
3. Agrega el producto "Café Latte - $4500"
4. ¡Listo! Todos lo verán inmediatamente
\`\`\`

### Ejemplo 2: Cambiar el color del botón

**En Desarrollo Local:**
\`\`\`bash
1. npm run dev
2. Abre app/menu/page.tsx en VS Code
3. Cambia className="bg-blue-500" a className="bg-green-500"
4. Guarda (Ctrl + S)
5. Verifica en http://localhost:3000
6. Si te gusta, continúa al siguiente paso
\`\`\`

**Subir a Producción:**
\`\`\`bash
git add .
git commit -m "Cambié el color del botón a verde"
git push

# Espera 2-3 minutos
# Ve a https://tu-app.up.railway.app
# Refresca (F5)
# ¡El botón ahora es verde!
\`\`\`

---

## 🔐 Datos: ¿Dónde se guardan?

### Datos en Desarrollo Local (XAMPP)
- Usuarios que crees en localhost
- Productos que agregues en localhost
- Pedidos que hagas en localhost
- **NO se sincronizan con producción automáticamente**

### Datos en Producción (Railway)
- Usuarios que se registren en la URL pública
- Productos que agregues desde la URL pública
- Pedidos que hagan los clientes reales
- **Estos son los datos REALES que todos ven**

### ¿Cómo sincronizar datos?

**De Local a Producción:**
\`\`\`bash
# 1. Exporta de XAMPP (phpMyAdmin → Exportar)
# 2. Importa a Railway (TablePlus o Railway CLI)
\`\`\`

**De Producción a Local:**
\`\`\`bash
# 1. Exporta de Railway (TablePlus → Export)
# 2. Importa a XAMPP (phpMyAdmin → Importar)
\`\`\`

---

## ⚠️ Consejos Importantes

### ✅ Buenas Prácticas

1. **Siempre prueba en local primero**
   - No hagas cambios directamente en producción
   - Prueba todo en localhost antes de hacer push

2. **Haz commits descriptivos**
   \`\`\`bash
   # ❌ Mal
   git commit -m "cambios"
   
   # ✅ Bien
   git commit -m "Agregué sistema de cupones de descuento"
   \`\`\`

3. **Haz push frecuentemente**
   - No esperes a tener 100 cambios
   - Haz push cada vez que termines una funcionalidad

4. **Verifica después de cada push**
   - Siempre revisa que todo funcione en producción
   - Revisa los logs en Railway si algo falla

### ❌ Errores Comunes

1. **Olvidar hacer push**
   - Hiciste cambios en local pero no los subiste
   - Solución: `git push`

2. **Agregar datos en local y esperar verlos en producción**
   - Los datos de XAMPP NO se sincronizan automáticamente
   - Solución: Agrega los datos directamente en producción

3. **Hacer cambios directamente en producción**
   - Es arriesgado, puede romper la página
   - Solución: Siempre prueba en local primero

---

## 🎉 Resumen

**Desarrollo Local (Tu PC):**
- Para probar y desarrollar
- Usa XAMPP
- Solo tú lo ves
- Cambios instantáneos

**Producción (Railway):**
- Para que todos accedan
- Usa MySQL en la nube
- Cualquier persona lo ve
- Se actualiza con `git push`

**Flujo:**
\`\`\`
1. Haces cambios en tu PC (localhost)
2. Pruebas que funcione
3. git push
4. Railway actualiza automáticamente
5. Todos ven los cambios
