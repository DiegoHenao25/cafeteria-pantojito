require("dotenv").config({ path: ".env.local" })
const mysql = require("mysql2/promise")

async function actualizarBaseDatos() {
  console.log("🔄 Conectando a Railway...")

  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL

  if (!databaseUrl) {
    console.error("❌ Error: No se encontró la URL de la base de datos")
    console.log("📝 Agrega una de estas variables a .env.local:")
    console.log("   DATABASE_URL=mysql://root:password@host:port/database")
    console.log("   O copia MYSQL_PUBLIC_URL desde Railway")
    process.exit(1)
  }

  const connection = await mysql.createConnection(databaseUrl)

  try {
    console.log("✅ Conectado exitosamente")
    console.log("📝 Actualizando tabla Order...")

    // Agregar nuevas columnas a la tabla Order
    const queries = [
      `ALTER TABLE \`Order\` ADD COLUMN customer_name VARCHAR(100)`,
      `ALTER TABLE \`Order\` ADD COLUMN customer_lastname VARCHAR(100)`,
      `ALTER TABLE \`Order\` ADD COLUMN customer_id VARCHAR(50)`,
      `ALTER TABLE \`Order\` ADD COLUMN customer_phone VARCHAR(20)`,
      `ALTER TABLE \`Order\` ADD COLUMN customer_email VARCHAR(100)`,
      `ALTER TABLE \`Order\` ADD COLUMN pickup_time VARCHAR(20)`,
      `ALTER TABLE \`Order\` ADD COLUMN payment_method VARCHAR(50) DEFAULT 'pending'`,
      `ALTER TABLE \`Order\` ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending'`,
      `ALTER TABLE \`Order\` ADD COLUMN transaction_id VARCHAR(255)`,
    ]

    for (const query of queries) {
      try {
        await connection.execute(query)
        console.log("✓ Columna agregada")
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log("⚠ Columna ya existe, continuando...")
        } else {
          throw error
        }
      }
    }

    console.log("✅ Base de datos actualizada exitosamente")
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

actualizarBaseDatos()
