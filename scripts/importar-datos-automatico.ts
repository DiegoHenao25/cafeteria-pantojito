import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Iniciando importación de datos...")

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.otp.deleteMany()
  await prisma.user.deleteMany()

  console.log("✅ Datos anteriores eliminados")

  // Crear categoría
  const categoria = await prisma.category.create({
    data: {
      id: 1,
      nombre: "Bebidas",
    },
  })
  console.log("✅ Categoría creada:", categoria.nombre)

  // Crear producto
  const producto = await prisma.product.create({
    data: {
      id: 1,
      nombre: "Pony Malta",
      descripcion: "",
      precio: 3500,
      imagen: "/uploads/1737441026115-pony-malta.jpg",
      disponible: true,
      categoryId: 1,
    },
  })
  console.log("✅ Producto creado:", producto.nombre)

  // Crear usuarios
  const usuarios = [
    {
      id: 1,
      nombre: "Diego",
      email: "diego.henao@ucp.edu.co",
      password: await bcrypt.hash("Diego123", 10),
      rol: "cliente",
    },
    {
      id: 2,
      nombre: "Diego Henao",
      email: "diegohenao.cortes@gmail.com",
      password: await bcrypt.hash("Alicesama25", 10),
      rol: "admin",
    },
    {
      id: 3,
      nombre: "Prueba",
      email: "prueba@gmail.com",
      password: await bcrypt.hash("Prueba123", 10),
      rol: "cliente",
    },
  ]

  for (const userData of usuarios) {
    const usuario = await prisma.user.create({ data: userData })
    console.log("✅ Usuario creado:", usuario.email, "- Rol:", usuario.rol)
  }

  // Crear pedido
  const pedido = await prisma.order.create({
    data: {
      id: 1,
      userId: 2,
      total: 3500,
      estado: "pendiente",
    },
  })
  console.log("✅ Pedido creado: ID", pedido.id)

  // Crear detalle del pedido
  const detalle = await prisma.orderItem.create({
    data: {
      id: 1,
      orderId: 1,
      productId: 1,
      cantidad: 1,
      precio: 3500,
    },
  })
  console.log("✅ Detalle de pedido creado")

  console.log("\n🎉 ¡Importación completada exitosamente!")
  console.log("\n📊 Resumen:")
  console.log("- 1 categoría (Bebidas)")
  console.log("- 1 producto (Pony Malta)")
  console.log("- 3 usuarios (1 admin, 2 clientes)")
  console.log("- 1 pedido con 1 producto")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
