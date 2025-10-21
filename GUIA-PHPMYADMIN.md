# 📋 Guía: Cómo Importar la Base de Datos en phpMyAdmin

## 🎯 Pasos para Configurar la Base de Datos

### Paso 1: Abrir phpMyAdmin
1. Abre XAMPP Control Panel
2. Asegúrate de que **Apache** y **MySQL** estén corriendo (botón "Start" en verde)
3. Haz clic en el botón **"Admin"** al lado de MySQL
4. Se abrirá phpMyAdmin en tu navegador (http://localhost/phpmyadmin)

### Paso 2: Crear la Base de Datos (Método 1 - Recomendado)
1. En phpMyAdmin, haz clic en la pestaña **"SQL"** en la parte superior
2. Abre el archivo `scripts/BASE-DATOS-COMPLETA.sql` en Visual Studio Code
3. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)
4. **Pega** el contenido en el cuadro de texto de phpMyAdmin
5. Haz clic en el botón **"Continuar"** o **"Go"** en la esquina inferior derecha
6. Deberías ver mensajes de éxito en verde ✅

### Paso 3: Verificar que se Creó Correctamente
1. En el panel izquierdo de phpMyAdmin, busca **"cafeteria_pantojito"**
2. Haz clic en el nombre de la base de datos
3. Deberías ver 7 tablas:
   - ✅ User
   - ✅ Category
   - ✅ Product
   - ✅ Order
   - ✅ OrderItem
   - ✅ Otp

4. Haz clic en la tabla **"Category"** y luego en **"Examinar"**
   - Deberías ver 4 categorías: Snacks, Papitas, Almuerzos, Bebidas

5. Haz clic en la tabla **"User"** y luego en **"Examinar"**
   - Deberías ver el usuario administrador

### Paso 4: Configurar el Archivo .env
1. Abre el archivo `.env` en la raíz de tu proyecto
2. Asegúrate de que tenga esta línea:
   \`\`\`
   DATABASE_URL="mysql://root@localhost:3306/cafeteria_pantojito"
   \`\`\`
3. Guarda el archivo

### Paso 5: Crear el Usuario Administrador
Como la contraseña debe estar hasheada, usa el script de Node.js:

1. Abre la terminal en Visual Studio Code
2. Ejecuta:
   \`\`\`bash
   npm run db:create-admin
   \`\`\`
3. Esto creará el usuario administrador con:
   - Email: diegohenao.cortes@gmail.com
   - Contraseña: Alicesama25
   - Rol: admin

### Paso 6: Probar la Conexión
1. En la terminal, ejecuta:
   \`\`\`bash
   npm run db:verify
   \`\`\`
2. Deberías ver: ✅ Conexión exitosa a la base de datos

### Paso 7: Iniciar el Proyecto
\`\`\`bash
npm run dev
\`\`\`

Abre http://localhost:3000 y prueba iniciar sesión con las credenciales de administrador.

---

## 🔧 Método Alternativo: Importar Archivo SQL

Si prefieres importar el archivo directamente:

1. En phpMyAdmin, haz clic en **"Importar"** en la parte superior
2. Haz clic en **"Seleccionar archivo"**
3. Busca y selecciona `scripts/BASE-DATOS-COMPLETA.sql`
4. Haz clic en **"Continuar"** al final de la página
5. Espera a que termine la importación

---

## ❓ Solución de Problemas

### Error: "Base de datos ya existe"
- No hay problema, el script está diseñado para no sobrescribir datos existentes
- Puedes continuar con los siguientes pasos

### Error: "Tabla ya existe"
- Igual que arriba, es normal si ya habías creado las tablas antes

### No veo la base de datos en el panel izquierdo
- Haz clic en el ícono de **"Actualizar"** 🔄 en phpMyAdmin
- O cierra y vuelve a abrir phpMyAdmin

### El usuario administrador no funciona
- Ejecuta el script: `npm run db:create-admin`
- Esto creará o actualizará el usuario con la contraseña correcta

### Error de conexión en la aplicación
- Verifica que MySQL esté corriendo en XAMPP
- Verifica que el archivo `.env` tenga la URL correcta
- Ejecuta `npm run db:verify` para probar la conexión

---

## 📝 Cambiar Rol de Usuario a Administrador

Si quieres hacer administrador a otro usuario:

1. En phpMyAdmin, ve a la base de datos **cafeteria_pantojito**
2. Haz clic en la tabla **"User"**
3. Haz clic en **"Examinar"**
4. Busca el usuario que quieres hacer administrador
5. Haz clic en el ícono de **"Editar"** (lápiz) ✏️
6. Cambia el campo **"rol"** de `cliente` a `admin`
7. Haz clic en **"Continuar"**
8. El usuario ahora es administrador y verá el Panel Admin al recargar la página

---

## ✅ Checklist Final

- [ ] XAMPP está corriendo (Apache y MySQL)
- [ ] Base de datos "cafeteria_pantojito" creada
- [ ] 7 tablas creadas correctamente
- [ ] 4 categorías insertadas
- [ ] Usuario administrador creado
- [ ] Archivo .env configurado
- [ ] Conexión verificada con `npm run db:verify`
- [ ] Aplicación corriendo con `npm run dev`
- [ ] Puedo iniciar sesión como administrador

¡Listo! Tu base de datos está completamente configurada. 🎉
