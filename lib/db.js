import mysql from "mysql2/promise"

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafeteria_ucp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

// Función para ejecutar consultas
export async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Error en la consulta:", error)
    throw error
  }
}

// Función para obtener una conexión del pool
export async function getConnection() {
  return await pool.getConnection()
}

export default pool
