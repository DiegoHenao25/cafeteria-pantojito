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
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { items, metodoPago, tiempoRecogida, clienteInfo } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    if (!clienteInfo || !clienteInfo.nombre || !clienteInfo.cedula || !clienteInfo.telefono) {
      return NextResponse.json({ error: "Información del cliente incompleta" }, { status: 400 })
    }

    // Calcular total
    let total = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || !product.disponible) {
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

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        total,
        metodoPago: metodoPago || "efectivo",
        estado: "pendiente",
        tiempoRecogida: tiempoRecogida || 15,
        clienteNombre: `${clienteInfo.nombre} ${clienteInfo.apellido}`,
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
    } catch (emailError) {
      console.error("[v0] Error enviando email, pero orden creada:", emailError)
      // No fallar la orden si el email falla
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("[v0] Error creando orden:", error)
    return NextResponse.json({ error: "Error al crear orden" }, { status: 500 })
  }
}
