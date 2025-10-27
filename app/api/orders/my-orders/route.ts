import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getSession } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                nombre: true,
                imagen: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Error al cargar pedidos" }, { status: 500 })
  }
}
