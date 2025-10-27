import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { sendOrderNotificationToStaff } from "@/lib/email"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const whereClause = session.rol === "admin" ? {} : { userId: session.userId }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            nombre: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[v0] Error obteniendo órdenes:", error)
    return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Iniciando creación de orden")
    const session = await getSession()

    if (!session) {
      console.log("[v0] Error: No hay sesión")
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Body recibido:", JSON.stringify(body, null, 2))

    const { items, metodoPago, tiempoRecogida, clienteInfo } = body

    if (!items || items.length === 0) {
      console.log("[v0] Error: Carrito vacío")
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    if (!clienteInfo || !clienteInfo.nombre || !clienteInfo.cedula || !clienteInfo.telefono) {
      console.log("[v0] Error: Información del cliente incompleta:", clienteInfo)
      return NextResponse.json({ error: "Información del cliente incompleta" }, { status: 400 })
    }

    // Calcular total
    let total = 0
    const orderItemsData = []

    for (const item of items) {
      console.log("[v0] Procesando item:", item)
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || !product.disponible) {
        console.log("[v0] Error: Producto no disponible:", item.productId)
        return NextResponse.json({ error: `Producto ${item.productId} no disponible` }, { status: 400 })
      }

      const subtotal = Number(product.precio) * item.cantidad
      total += subtotal

      orderItemsData.push({
        productId: product.id,
        cantidad: item.cantidad,
        precio: product.precio,
      })
    }

    console.log("[v0] Creando orden con total:", total)
    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        total,
        metodoPago: metodoPago || "mercadopago",
        estado: "pendiente",
        tiempoRecogida: tiempoRecogida || 15,
        clienteNombre: `${clienteInfo.nombre} ${clienteInfo.apellido || ""}`.trim(),
        clienteCedula: clienteInfo.cedula,
        clienteTelefono: clienteInfo.telefono,
        clienteCorreo: clienteInfo.correo,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    console.log("[v0] Orden creada exitosamente:", order.id)

    try {
      await sendOrderNotificationToStaff({
        orderNumber: order.id,
        clienteNombre: order.clienteNombre,
        clienteCedula: order.clienteCedula,
        clienteTelefono: order.clienteTelefono,
        clienteCorreo: order.clienteCorreo,
        tiempoRecogida: order.tiempoRecogida,
        metodoPago: order.metodoPago,
        total: Number(order.total),
        items: order.orderItems.map((item) => ({
          nombre: item.product.nombre,
          cantidad: item.cantidad,
          precio: Number(item.precio),
        })),
      })
      console.log("[v0] Email enviado exitosamente")
    } catch (emailError) {
      console.error("[v0] Error enviando email, pero orden creada:", emailError)
      // No fallar la orden si el email falla
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("[v0] Error creando orden - Detalles completos:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack available")
    return NextResponse.json(
      {
        error: "Error al crear orden",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
