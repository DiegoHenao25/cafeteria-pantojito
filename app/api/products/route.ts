import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId: Number.parseInt(categoryId) } : undefined,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error obteniendo productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { nombre, descripcion, precio, imagen, categoryId, disponible } = await request.json()

    if (!nombre || !precio || !categoryId) {
      return NextResponse.json({ error: "Nombre, precio y categoría son requeridos" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        nombre,
        descripcion,
        precio: Number.parseFloat(precio),
        imagen,
        categoryId: Number.parseInt(categoryId),
        disponible: disponible !== false,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error creando producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
