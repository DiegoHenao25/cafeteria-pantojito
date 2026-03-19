// Script para crear el usuario administrador en XAMPP
const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")

async function createAdmin() {
  console.log("👤 Creando usuario administrador...\n")

  const adminEmail = "diegohenao.cortes@gmail.com"
  const adminPassword = "Alicesama25"
  const adminNombre = "Diego Henao"

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "", // Ajusta si configuraste contraseña en XAMPP
      database: "cafeteria_ucp",
    })

    console.log("✅ Conectado a MySQL\n")

    // Verificar si el usuario ya existe
    const [existing] = await connection.query("SELECT * FROM User WHERE email = ?", [adminEmail])

    if (existing.length > 0) {
      console.log("⚠️  El usuario administrador ya existe")
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Rol: ${existing[0].rol}\n`)

      // Actualizar contraseña si es necesario
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      await connection.query("UPDATE User SET password = ?, rol = ? WHERE email = ?", [
        hashedPassword,
        "admin",
        adminEmail,
      ])

      console.log("✅ Contraseña actualizada y rol configurado como admin")
    } else {
      // Crear nuevo usuario administrador
      const hashedPassword = await bcrypt.hash(adminPassword, 10)

      await connection.query("INSERT INTO User (email, password, nombre, rol, createdAt) VALUES (?, ?, ?, ?, NOW())", [
        adminEmail,
        hashedPassword,
        adminNombre,
        "admin",
      ])

      console.log("✅ Usuario administrador creado exitosamente!")
    }

    console.log("\n📋 Credenciales de administrador:")
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Contraseña: ${adminPassword}`)
    console.log("\n💡 Ahora puedes iniciar sesión en http://localhost:3000/login")

    await connection.end()
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

createAdmin()
