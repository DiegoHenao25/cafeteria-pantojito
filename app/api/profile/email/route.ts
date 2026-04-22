import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

// Store temporal para codigos de verificacion (en produccion usar Redis o base de datos)
const verificationCodes = new Map<number, { code: string; newEmail: string; expiresAt: Date }>()

// POST - Enviar codigo de verificacion al email actual
export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { newEmail } = await request.json()

    if (!newEmail) {
      return NextResponse.json({ error: "El nuevo correo es requerido" }, { status: 400 })
    }

    // Verificar que el email no este en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    })

    if (existingUser && existingUser.id !== session.userId) {
      return NextResponse.json({ error: "Este correo ya esta en uso" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Generar codigo de 6 digitos
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Guardar codigo (expira en 10 minutos)
    verificationCodes.set(session.userId, {
      code,
      newEmail,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    // En produccion, aqui enviarias el email con el codigo
    // Por ahora, mostraremos el codigo en la consola del servidor
    console.log(`[v0] Codigo de verificacion para ${user.email}: ${code}`)

    // Simular envio de email - En produccion usar servicio de email real
    // await sendEmail(user.email, "Codigo de verificacion", `Tu codigo es: ${code}`)

    return NextResponse.json({ 
      message: "Codigo enviado al correo actual",
      // Solo para desarrollo - remover en produccion
      devCode: process.env.NODE_ENV === "development" ? code : undefined
    })
  } catch (error) {
    console.error("Error enviando codigo:", error)
    return NextResponse.json({ error: "Error al enviar codigo" }, { status: 500 })
  }
}

// PATCH - Verificar codigo y actualizar email
export async function PATCH(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "El codigo es requerido" }, { status: 400 })
    }

    const storedData = verificationCodes.get(session.userId)

    if (!storedData) {
      return NextResponse.json({ error: "No hay codigo pendiente. Solicita uno nuevo." }, { status: 400 })
    }

    if (new Date() > storedData.expiresAt) {
      verificationCodes.delete(session.userId)
      return NextResponse.json({ error: "El codigo ha expirado. Solicita uno nuevo." }, { status: 400 })
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: "Codigo incorrecto" }, { status: 400 })
    }

    // Actualizar email
    await prisma.user.update({
      where: { id: session.userId },
      data: { email: storedData.newEmail },
    })

    // Limpiar codigo usado
    verificationCodes.delete(session.userId)

    return NextResponse.json({ message: "Correo actualizado correctamente" })
  } catch (error) {
    console.error("Error verificando codigo:", error)
    return NextResponse.json({ error: "Error al verificar codigo" }, { status: 500 })
  }
}
