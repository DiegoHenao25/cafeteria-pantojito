import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, createToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, nombre } = await request.json()

    // Validar campos
    if (!email || !password || !nombre) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 })
    }

    // Determinar rol (admin solo para el correo específico)
    const rol = email === "diegohenao.cortes@gmail.com" ? "admin" : "cliente"

    // Crear usuario
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol,
      },
    })

    // Crear token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      rol: user.rol,
    })

    // Establecer cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    })
  } catch (error) {
    console.error("[v0] Error en registro:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
