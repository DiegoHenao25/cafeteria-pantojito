import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "La nueva contrasena debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar contrasena actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Contrasena actual incorrecta" }, { status: 400 })
    }

    // Hash de la nueva contrasena
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Contrasena actualizada correctamente" })
  } catch (error) {
    console.error("Error actualizando contrasena:", error)
    return NextResponse.json({ error: "Error al actualizar contrasena" }, { status: 500 })
  }
}
