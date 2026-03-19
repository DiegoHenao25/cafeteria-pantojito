import { neon } from "@neondatabase/serverless"

async function migrateOrders() {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    console.log("[v0] Iniciando migración de tabla Order...")

    // Agregar nuevas columnas a la tabla Order
    await sql`
      ALTER TABLE Order 
      ADD COLUMN IF NOT EXISTS customerName VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customerLastName VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customerDocument VARCHAR(50),
      ADD COLUMN IF NOT EXISTS customerPhone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS customerEmail VARCHAR(255),
      ADD COLUMN IF NOT EXISTS pickupTime VARCHAR(20),
      ADD COLUMN IF NOT EXISTS paymentMethod VARCHAR(50),
      ADD COLUMN IF NOT EXISTS paymentStatus VARCHAR(50) DEFAULT 'pending'
    `

    console.log("[v0] Migración completada exitosamente")
  } catch (error) {
    console.error("[v0] Error en migración:", error)
    throw error
  }
}

migrateOrders()
