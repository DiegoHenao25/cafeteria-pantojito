const bcrypt = require("bcryptjs")

async function generateAdminPassword() {
  const password = "Alicesama25"
  const hashedPassword = await bcrypt.hash(password, 10)

  console.log("=== SCRIPT PARA ARREGLAR CONTRASEÑA DE ADMIN ===\n")
  console.log("Ejecuta este comando SQL en tu base de datos MySQL:\n")
  console.log(`UPDATE User SET password = '${hashedPassword}' WHERE email = 'diegohenao.cortes@gmail.com';\n`)
  console.log("Esto actualizará la contraseña del administrador correctamente.")
}

generateAdminPassword()
