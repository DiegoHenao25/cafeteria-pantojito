import mysql from "mysql2/promise"
import * as fs from "fs"
import * as path from "path"

async function actualizarBaseDatos() {
  console.log("🔄 Conectando a Railway...")

  const connection = await mysql.createConnection(process.env.DATABASE_URL!)

  console.log("✅ Conectado a la base de datos")
  console.log("📝 Ejecutando actualización de tabla Order...")

  const sqlPath = path.join(__dirname, "actualizar-orders-tabla.sql")
  const sql = fs.readFileSync(sqlPath, "utf8")

  // Ejecutar cada comando SQL
  const commands = sql.split(";").filter((cmd) => cmd.trim())

  for (const command of commands) {
    if (command.trim()) {
      await connection.query(command)
      console.log("✅ Comando ejecutado")
    }
  }

  console.log("🎉 Base de datos actualizada exitosamente!")
  await connection.end()
}

actualizarBaseDatos().catch((error) => {
  console.error("❌ Error:", error.message)
  process.exit(1)
})
