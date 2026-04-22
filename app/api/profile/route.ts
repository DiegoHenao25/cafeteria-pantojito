import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

// GET - Obtener perfil del usuario actual
export async function GET() {
  try {
    console.log("[v0] GET /api/profile - Iniciando...")
    const session = await getSession()
    console.log("[v0] Sesion:", session ? `userId: ${session.userId}` : "No hay sesion")

    if (!session) {
      console.log("[v0] No hay sesion, retornando 401")
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error obteniendo perfil:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// PATCH - Actualizar perfil (nombre, apellido)
export async function PATCH(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { nombre, apellido } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
      },
    })

    return NextResponse.json({ user: updatedUser, message: "Perfil actualizado" })
  } catch (error) {
    console.error("Error actualizando perfil:", error)
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 })
  }
}
