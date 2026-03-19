import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, codigo, newPassword } = await request.json()

    if (!email || !codigo || !newPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar código válido
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        codigo,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!otp) {
      return NextResponse.json({ error: "Código inválido o expirado" }, { status: 400 })
    }

    // Actualizar contraseña del usuario
    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Eliminar el código usado
    await prisma.otp.delete({
      where: { id: otp.id },
    })

    return NextResponse.json({ message: "Contraseña actualizada exitosamente" })
  } catch (error) {
    console.error("[v0] Error en reset-password:", error)
    return NextResponse.json({ error: "Error al restablecer contraseña" }, { status: 500 })
  }
}
