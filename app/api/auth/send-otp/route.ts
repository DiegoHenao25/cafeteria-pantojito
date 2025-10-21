import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationCode } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString()

    // Eliminar códigos anteriores del mismo email
    await prisma.otp.deleteMany({
      where: { email },
    })

    // Crear nuevo código con expiración de 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await prisma.otp.create({
      data: {
        email,
        codigo,
        expiresAt,
      },
    })

    // Enviar correo
    const result = await sendVerificationCode(email, codigo)

    if (!result.success) {
      return NextResponse.json(
        { error: "Error al enviar el correo. Verifica tu configuración de email." },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Código enviado exitosamente" })
  } catch (error) {
    console.error("Error en send-otp:", error)
    return NextResponse.json({ error: "Error al enviar código" }, { status: 500 })
  }
}
