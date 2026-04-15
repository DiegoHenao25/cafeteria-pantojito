import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET - Obtener perfil del usuario actual
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    
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
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
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
