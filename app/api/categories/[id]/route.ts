import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = await params

    // Verificar si la categoria tiene productos
    const productsInCategory = await prisma.product.count({
      where: { categoryId: Number.parseInt(id) }
    })

    if (productsInCategory > 0) {
      return NextResponse.json({ 
        error: `No se puede eliminar. Esta categoria tiene ${productsInCategory} producto(s) asociado(s).` 
      }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error eliminando categoria:", error)
    return NextResponse.json({ error: "Error al eliminar categoria" }, { status: 500 })
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = await params
    const { nombre } = await request.json()

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id: Number.parseInt(id) },
      data: { nombre },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[v0] Error actualizando categoria:", error)
    return NextResponse.json({ error: "Error al actualizar categoria" }, { status: 500 })
  }
}
