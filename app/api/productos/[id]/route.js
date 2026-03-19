import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - Obtener producto por ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const productos = await executeQuery("SELECT * FROM productos WHERE id = ?", [id])

    if (productos.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(productos[0])
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

// PUT - Actualizar producto
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { nombre, descripcion, precio, imagen, disponible } = await request.json()

    const updateFields = []
    const updateValues = []

    if (nombre !== undefined) {
      updateFields.push("nombre = ?")
      updateValues.push(nombre)
    }
    if (descripcion !== undefined) {
      updateFields.push("descripcion = ?")
      updateValues.push(descripcion)
    }
    if (precio !== undefined) {
      updateFields.push("precio = ?")
      updateValues.push(precio)
    }
    if (imagen !== undefined) {
      updateFields.push("imagen_url = ?")
      updateValues.push(imagen)
    }
    if (disponible !== undefined) {
      updateFields.push("disponible = ?")
      updateValues.push(disponible)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 })
    }

    updateValues.push(id)

    const result = await executeQuery(`UPDATE productos SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const productoActualizado = await executeQuery("SELECT * FROM productos WHERE id = ?", [id])

    return NextResponse.json({
      message: "Producto actualizado exitosamente",
      producto: productoActualizado[0],
    })
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

// DELETE - Eliminar producto
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const result = await executeQuery("DELETE FROM productos WHERE id = ?", [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Producto eliminado exitosamente",
    })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
