import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json([], { status: 200 }) // Retornar array vacio en vez de error
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: {
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
    console.error("Error obteniendo mis pedidos:", error)
    return NextResponse.json([], { status: 200 }) // Retornar array vacio en vez de error
  }
}
