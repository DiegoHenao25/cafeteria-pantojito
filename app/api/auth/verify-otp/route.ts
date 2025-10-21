import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, codigo } = await request.json()

    if (!email || !codigo) {
      return NextResponse.json({ error: "Email y código son requeridos" }, { status: 400 })
    }

    // Buscar código válido
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

    // Eliminar el código usado
    await prisma.otp.delete({
      where: { id: otp.id },
    })

    return NextResponse.json({ message: "Código verificado exitosamente", verified: true })
  } catch (error) {
    console.error("Error en verify-otp:", error)
    return NextResponse.json({ error: "Error al verificar código" }, { status: 500 })
  }
}
