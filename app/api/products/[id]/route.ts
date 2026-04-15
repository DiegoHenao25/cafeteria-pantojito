import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
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
    const body = await request.json()
    const { nombre, descripcion, precio, imagen, categoryId, disponible } = body

    console.log("[v0] Actualizando producto:", id, body)

    const updateData: any = {}
    if (nombre !== undefined) updateData.nombre = nombre
    if (descripcion !== undefined) updateData.descripcion = descripcion
    if (precio !== undefined) updateData.precio = Number.parseFloat(precio)
    if (imagen !== undefined) updateData.imagen = imagen
    if (categoryId !== undefined) updateData.categoryId = Number.parseInt(categoryId)
    if (disponible !== undefined) updateData.disponible = disponible

    const product = await prisma.product.update({
      where: { id: Number.parseInt(id) },
      data: updateData,
      include: { category: true },
    })

    console.log("[v0] Producto actualizado:", product)
    return NextResponse.json(product)
  } catch (error: any) {
    console.error("[v0] Error actualizando producto:", error)
    const errorMessage = error?.message || "Error al actualizar producto"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

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

    // Primero verificar si el producto tiene pedidos asociados
    const productWithOrders = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
      include: { orderItems: true }
    })

    if (productWithOrders && productWithOrders.orderItems.length > 0) {
      // Si tiene pedidos, solo lo marcamos como no disponible
      await prisma.product.update({
        where: { id: Number.parseInt(id) },
        data: { disponible: false }
      })
      return NextResponse.json({ 
        success: true, 
        message: "Producto deshabilitado (tiene pedidos asociados)" 
      })
    }

    // Si no tiene pedidos, lo eliminamos
    await prisma.product.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error eliminando producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
