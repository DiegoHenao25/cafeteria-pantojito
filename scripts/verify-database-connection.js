// Script para verificar la conexión a la base de datos XAMPP
const mysql = require("mysql2/promise")

async function verifyConnection() {
  console.log("🔍 Verificando conexión a XAMPP MySQL...\n")

  try {
    // Configuración de conexión (ajusta según tu .env)
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "", // Por defecto XAMPP no tiene contraseña
      database: "cafeteria_ucp",
    })

    console.log("✅ Conexión exitosa a MySQL!\n")

    // Verificar tablas
    const [tables] = await connection.query("SHOW TABLES")
    console.log("📋 Tablas encontradas:")
    tables.forEach((table) => {
      console.log(`   - ${Object.values(table)[0]}`)
    })

    // Verificar usuarios
    const [users] = await connection.query("SELECT id, email, nombre, rol FROM User")
    console.log(`\n👥 Usuarios registrados: ${users.length}`)
    users.forEach((user) => {
      console.log(`   - ${user.email} (${user.rol})`)
    })

    // Verificar categorías
    const [categories] = await connection.query("SELECT * FROM Category")
    console.log(`\n📁 Categorías: ${categories.length}`)
    categories.forEach((cat) => {
      console.log(`   - ${cat.nombre}`)
    })

    // Verificar productos
    const [products] = await connection.query("SELECT COUNT(*) as total FROM Product")
    console.log(`\n🍔 Productos: ${products[0].total}`)

    await connection.end()
    console.log("\n✅ Verificación completada exitosamente!")
    console.log("\n💡 Puedes iniciar el proyecto con: npm run dev")
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:")
    console.error(`   ${error.message}\n`)

    console.log("🔧 Soluciones posibles:")
    console.log("   1. Verifica que XAMPP esté corriendo (MySQL en verde)")
    console.log('   2. Verifica que la base de datos "cafeteria_ucp" exista')
    console.log("   3. Ejecuta el script: scripts/xampp-create-database.sql")
    console.log("   4. Verifica tu archivo .env\n")

    process.exit(1)
  }
}

verifyConnection()
