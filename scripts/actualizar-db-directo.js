const mysql = require("mysql2/promise")

async function actualizarBaseDatos() {
  console.log("🔄 Conectando a Railway...")

  const connection = await mysql.createConnection(
    "mysql://root:PSfmsbAsvnBbAomcIHUFJbqHRHlultcz@interchange.proxy.rlwy.net:36883/railway",
  )

  console.log("✅ Conectado a Railway")

  try {
    // Renombrar tabla Order a Orders (evita palabra reservada)
    console.log("📝 Renombrando tabla Order a Orders...")
    await connection.execute("RENAME TABLE `Order` TO `Orders`")
    console.log("✅ Tabla renombrada")

    // Agregar nuevas columnas
    console.log("📝 Agregando columnas nuevas...")

    const columnas = [
      "ADD COLUMN customer_name VARCHAR(100)",
      "ADD COLUMN customer_lastname VARCHAR(100)",
      "ADD COLUMN customer_id VARCHAR(50)",
      "ADD COLUMN customer_phone VARCHAR(20)",
      "ADD COLUMN customer_email VARCHAR(100)",
      "ADD COLUMN pickup_time VARCHAR(20)",
      "ADD COLUMN payment_method VARCHAR(50)",
      'ADD COLUMN payment_status VARCHAR(50) DEFAULT "pending"',
    ]

    for (const columna of columnas) {
      try {
        await connection.execute(`ALTER TABLE Orders ${columna}`)
        console.log(`✅ Agregada: ${columna.split(" ")[2]}`)
      } catch (err) {
        if (err.code === "ER_DUP_FIELDNAME") {
          console.log(`⚠️  Ya existe: ${columna.split(" ")[2]}`)
        } else {
          throw err
        }
      }
    }

    console.log("✅ Base de datos actualizada exitosamente")
  } catch (error) {
    console.error("❌ Error:", error.message)
  } finally {
    await connection.end()
  }
}

actualizarBaseDatos()
