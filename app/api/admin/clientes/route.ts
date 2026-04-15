import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession, isAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener todos los usuarios con sus estadisticas de compras
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            estado: true,
            metodoPago: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Procesar estadisticas para cada usuario
    const clientesConEstadisticas = usuarios.map((usuario) => {
      const pedidosPagados = usuario.orders.filter(
        (order) => order.estado === "pagado" || order.estado === "completado" || order.estado === "listo"
      )
      
      const totalGastado = pedidosPagados.reduce(
        (sum, order) => sum + Number(order.total),
        0
      )

      // Contar metodos de pago usados
      const metodosPago: Record<string, number> = {}
      pedidosPagados.forEach((order) => {
        const metodo = order.metodoPago || "desconocido"
        metodosPago[metodo] = (metodosPago[metodo] || 0) + 1
      })

      // Encontrar el metodo mas usado
      let metodoPagoFavorito = "Ninguno"
      let maxUso = 0
      Object.entries(metodosPago).forEach(([metodo, cantidad]) => {
        if (cantidad > maxUso) {
          maxUso = cantidad
          metodoPagoFavorito = metodo
        }
      })

      // Formatear metodo de pago
      const formatMetodoPago = (metodo: string) => {
        const metodos: Record<string, string> = {
          wompi: "Wompi",
          nequi: "Nequi",
          bancolombia: "Bancolombia",
          pse: "PSE",
          tarjeta: "Tarjeta",
          efectivo: "Efectivo",
          desconocido: "No especificado",
        }
        return metodos[metodo.toLowerCase()] || metodo
      }

      return {
        id: usuario.id,
        nombre: usuario.nombre || "Sin nombre",
        email: usuario.email,
        fechaRegistro: usuario.createdAt,
        totalPedidos: usuario.orders.length,
        pedidosPagados: pedidosPagados.length,
        totalGastado,
        metodoPagoFavorito: formatMetodoPago(metodoPagoFavorito),
        ultimaCompra: pedidosPagados.length > 0 
          ? pedidosPagados.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
          : null,
      }
    })

    // Estadisticas generales
    const estadisticas = {
      totalClientes: usuarios.length,
      clientesConCompras: clientesConEstadisticas.filter((c) => c.pedidosPagados > 0).length,
      totalVentas: clientesConEstadisticas.reduce((sum, c) => sum + c.totalGastado, 0),
      totalPedidos: clientesConEstadisticas.reduce((sum, c) => sum + c.pedidosPagados, 0),
    }

    return NextResponse.json({
      clientes: clientesConEstadisticas,
      estadisticas,
    })
  } catch (error) {
    console.error("Error obteniendo clientes:", error)
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 })
  }
}
