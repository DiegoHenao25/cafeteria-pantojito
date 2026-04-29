import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession, isAdmin } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session || !(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const clienteId = parseInt(id)

    if (isNaN(clienteId)) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 })
    }

    // Obtener pedidos del cliente con items y productos
    const pedidos = await prisma.order.findMany({
      where: {
        userId: clienteId,
        estado: {
          in: ["pagado", "completado", "listo", "entregado", "en_proceso", "pendiente"]
        }
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                nombre: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20 // Ultimos 20 pedidos
    })

    // Formatear respuesta
    const pedidosFormateados = pedidos.map(pedido => ({
      id: pedido.id,
      total: Number(pedido.total),
      estado: pedido.estado,
      metodoPago: pedido.metodoPago || "Wompi",
      createdAt: pedido.createdAt.toISOString(),
      items: pedido.orderItems.map(item => ({
        nombre: item.product.nombre,
        cantidad: item.cantidad,
        precio: Number(item.precio)
      }))
    }))

    return NextResponse.json({ pedidos: pedidosFormateados })
  } catch (error) {
    console.error("Error obteniendo pedidos del cliente:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}
