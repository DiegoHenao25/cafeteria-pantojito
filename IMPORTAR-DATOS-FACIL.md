# Importar Datos de XAMPP a Railway - FORMA FÁCIL

He creado un script automático que importa todos tus datos de XAMPP a Railway con un solo comando.

## Paso 1: Instalar dependencia necesaria

Abre la terminal en VS Code y ejecuta:

\`\`\`bash
npm install tsx
\`\`\`

## Paso 2: Ejecutar el script de importación

\`\`\`bash
npm run db:import
\`\`\`

## ¿Qué hace este script?

El script automáticamente:
- Limpia cualquier dato anterior
- Crea la categoría "Bebidas"
- Crea el producto "Pony Malta" ($3500)
- Crea 3 usuarios:
  - diego.henao@ucp.edu.co (cliente)
  - diegohenao.cortes@gmail.com (ADMIN) - Contraseña: Alicesama25
  - prueba@gmail.com (cliente)
- Crea 1 pedido de ejemplo

## Verificar que funcionó

Después de ejecutar el script, verás mensajes como:

\`\`\`
🚀 Iniciando importación de datos...
✅ Datos anteriores eliminados
✅ Categoría creada: Bebidas
✅ Producto creado: Pony Malta
✅ Usuario creado: diego.henao@ucp.edu.co - Rol: cliente
✅ Usuario creado: diegohenao.cortes@gmail.com - Rol: admin
✅ Usuario creado: prueba@gmail.com - Rol: cliente
✅ Pedido creado: ID 1
✅ Detalle de pedido creado

🎉 ¡Importación completada exitosamente!
\`\`\`

## Ver los datos importados

Ejecuta:

\`\`\`bash
npx prisma studio
\`\`\`

Se abrirá una interfaz gráfica donde puedes ver todos los datos.

## Siguiente paso

Una vez que veas el mensaje de éxito, continúa con el despliegue en Vercel.
