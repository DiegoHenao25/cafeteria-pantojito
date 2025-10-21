const bcrypt = require("bcryptjs")

async function createAdminUser() {
  const email = "diegohenao.cortes@gmail.com"
  const password = "Alicesama25"
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log("=== SCRIPT SQL PARA CREAR USUARIO ADMINISTRADOR ===\n")
  console.log(`INSERT INTO User (email, password, nombre, rol, createdAt, updatedAt) VALUES`)
  console.log(`('${email}', '${hashedPassword}', 'Diego Henao', 'admin', NOW(), NOW());\n`)
  console.log("=== Copia y ejecuta este SQL en tu base de datos MySQL ===")
}

createAdminUser()
