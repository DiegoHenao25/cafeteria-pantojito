import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = await executeQuery("SELECT * FROM productos ORDER BY created_at DESC")

    return NextResponse.json(productos)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// POST - Crear nuevo producto (solo admin)
export async function POST(request) {
  try {
    const { nombre, descripcion, precio, imagen } = await request.json()

    if (!nombre || !precio) {
      return NextResponse.json({ error: "Nombre y precio son requeridos" }, { status: 400 })
    }

    const result = await executeQuery(
      "INSERT INTO productos (nombre, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?)",
      [nombre, descripcion || "", precio, imagen || ""],
    )

    const nuevoProducto = await executeQuery("SELECT * FROM productos WHERE id = ?", [result.insertId])

    return NextResponse.json(
      {
        message: "Producto creado exitosamente",
        producto: nuevoProducto[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
