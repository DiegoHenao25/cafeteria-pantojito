import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { estado } = await request.json()

    const order = await prisma.order.update({
      where: { id: Number.parseInt(params.id) },
      data: { estado },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("[v0] Error actualizando orden:", error)
    return NextResponse.json({ error: "Error al actualizar orden" }, { status: 500 })
  }
}
