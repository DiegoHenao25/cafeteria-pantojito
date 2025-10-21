import { NextResponse } from "next/server"
import { executeQuery, getConnection } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

// GET - Obtener pedidos
export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 })
    }

    let query = `
      SELECT p.*, u.nombre as usuario_nombre 
      FROM pedidos p 
      LEFT JOIN usuarios u ON p.usuario_id = u.id
    `
    let params = []

    // Si no es admin, solo mostrar sus pedidos
    if (user.rol !== "admin") {
      query += " WHERE p.usuario_id = ?"
      params = [user.id]
    }

    query += " ORDER BY p.created_at DESC"

    const pedidos = await executeQuery(query, params)

    // Obtener detalles de cada pedido
    for (const pedido of pedidos) {
      const detalles = await executeQuery(
        `
        SELECT pd.*, pr.nombre as producto_nombre 
        FROM pedido_detalles pd 
        JOIN productos pr ON pd.producto_id = pr.id 
        WHERE pd.pedido_id = ?
      `,
        [pedido.id],
      )

      pedido.detalles = detalles
    }

    return NextResponse.json(pedidos)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

// POST - Crear nuevo pedido
export async function POST(request) {
  const connection = await getConnection()

  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 })
    }

    const { productos } = await request.json()

    if (!productos || productos.length === 0) {
      return NextResponse.json({ error: "Productos requeridos" }, { status: 400 })
    }

    await connection.beginTransaction()

    // Calcular total
    let total = 0
    for (const item of productos) {
      const [producto] = await connection.execute("SELECT precio FROM productos WHERE id = ? AND disponible = TRUE", [
        item.producto_id,
      ])

      if (producto.length === 0) {
        throw new Error(`Producto ${item.producto_id} no disponible`)
      }

      total += producto[0].precio * item.cantidad
    }

    // Crear pedido
    const [pedidoResult] = await connection.execute("INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)", [
      user.id,
      total,
    ])

    const pedidoId = pedidoResult.insertId

    // Crear detalles del pedido
    for (const item of productos) {
      const [producto] = await connection.execute("SELECT precio FROM productos WHERE id = ?", [item.producto_id])

      const subtotal = producto[0].precio * item.cantidad

      await connection.execute(
        "INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
        [pedidoId, item.producto_id, item.cantidad, producto[0].precio, subtotal],
      )
    }

    await connection.commit()

    return NextResponse.json(
      {
        message: "Pedido creado exitosamente",
        pedido_id: pedidoId,
        total,
      },
      { status: 201 },
    )
  } catch (error) {
    await connection.rollback()
    console.error("Error al crear pedido:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  } finally {
    connection.release()
  }
}
