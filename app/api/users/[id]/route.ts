import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { rol } = await request.json()
    const userId = Number.parseInt(params.id)

    // Validar que el rol sea válido
    if (!["admin", "cliente"].includes(rol)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { rol },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Error al actualizar rol" }, { status: 500 })
  }
}
