import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error obteniendo producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { nombre, descripcion, precio, imagen, categoryId, disponible } = await request.json()

    const product = await prisma.product.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        nombre,
        descripcion,
        precio: precio ? Number.parseFloat(precio) : undefined,
        imagen,
        categoryId: categoryId ? Number.parseInt(categoryId) : undefined,
        disponible,
      },
      include: { category: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[v0] Error actualizando producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await prisma.product.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error eliminando producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
