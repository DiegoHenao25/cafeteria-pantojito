# Actualizar Base de Datos - UN SOLO COMANDO

## Paso 1: Asegúrate de tener los archivos

Verifica que tengas estos dos archivos en la carpeta `scripts`:
- `actualizar-db.ts` (el script que ejecuta la actualización)
- `actualizar-orders-tabla.sql` (el SQL con los cambios)

## Paso 2: Ejecuta este comando en VS Code

Abre la terminal en VS Code (Ctrl + `) y ejecuta:

\`\`\`bash
npx tsx scripts/actualizar-db.ts
\`\`\`

## Eso es todo!

Verás mensajes como:
- 🔄 Conectando a Railway...
- ✅ Conectado a la base de datos
- 📝 Ejecutando actualización...
- ✅ Comando ejecutado
- 🎉 Base de datos actualizada exitosamente!

## Si sale error

Si dice "Cannot find module 'mysql2'", ejecuta primero:
\`\`\`bash
npm install mysql2
\`\`\`

Luego vuelve a ejecutar el comando de actualización.

## Siguiente paso

Una vez que veas "🎉 Base de datos actualizada exitosamente!", continúa con:
`CONFIGURAR-WOMPI-PAGOS-COLOMBIA.md`
