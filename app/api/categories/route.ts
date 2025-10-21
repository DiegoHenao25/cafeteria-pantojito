import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { nombre: "asc" },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error obteniendo categorías:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { nombre } = await request.json()

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { nombre },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[v0] Error creando categoría:", error)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}
