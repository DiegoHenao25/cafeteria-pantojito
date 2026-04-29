import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que es admin
    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user || user.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const now = new Date()
    const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - hoy.getDay())
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
    const hace30Dias = new Date(hoy)
    hace30Dias.setDate(hoy.getDate() - 30)

    // Estados que cuentan como "pagados/completados"
    const estadosPagados = ["pendiente", "en_proceso", "listo", "entregado", "completado", "pagado"]

    // Pedidos de hoy
    const pedidosHoy = await prisma.order.findMany({
      where: {
        createdAt: { gte: hoy },
        estado: { in: estadosPagados }
      }
    })

    // Pedidos de la semana
    const pedidosSemana = await prisma.order.findMany({
      where: {
        createdAt: { gte: inicioSemana },
        estado: { in: estadosPagados }
      }
    })

    // Pedidos del mes
    const pedidosMes = await prisma.order.findMany({
      where: {
        createdAt: { gte: inicioMes },
        estado: { in: estadosPagados }
      }
    })

    // Todos los pedidos (para totales)
    const todosPedidos = await prisma.order.findMany({
      where: { estado: { in: estadosPagados } }
    })

    // Calcular ingresos
    const ingresosHoy = pedidosHoy.reduce((sum, p) => sum + p.total, 0)
    const ingresosSemana = pedidosSemana.reduce((sum, p) => sum + p.total, 0)
    const ingresosMes = pedidosMes.reduce((sum, p) => sum + p.total, 0)
    const ingresosTotales = todosPedidos.reduce((sum, p) => sum + p.total, 0)

    // Productos mas vendidos (ultimos 30 dias)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: hace30Dias },
          estado: { in: estadosPagados }
        }
      },
      include: {
        product: { select: { nombre: true, imagen: true } }
      }
    })

    const productosVendidos: Record<number, { nombre: string; imagen: string | null; cantidad: number; ingresos: number }> = {}
    orderItems.forEach(item => {
      if (!productosVendidos[item.productId]) {
        productosVendidos[item.productId] = {
          nombre: item.product.nombre,
          imagen: item.product.imagen,
          cantidad: 0,
          ingresos: 0
        }
      }
      productosVendidos[item.productId].cantidad += item.cantidad
      productosVendidos[item.productId].ingresos += item.precio * item.cantidad
    })

    const topProductos = Object.entries(productosVendidos)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)

    // Clientes mas frecuentes
    const clientesConPedidos = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            estado: { in: estadosPagados }
          }
        }
      },
      include: {
        orders: {
          where: { estado: { in: estadosPagados } },
          select: { total: true }
        }
      }
    })

    const topClientes = clientesConPedidos
      .map(cliente => ({
        id: cliente.id,
        nombre: cliente.nombre || cliente.email.split("@")[0],
        email: cliente.email,
        pedidos: cliente.orders.length,
        totalGastado: cliente.orders.reduce((sum, o) => sum + o.total, 0)
      }))
      .sort((a, b) => b.totalGastado - a.totalGastado)
      .slice(0, 5)

    // Ventas por dia (ultimos 7 dias)
    const ventasPorDia: { fecha: string; pedidos: number; ingresos: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const dia = new Date(hoy)
      dia.setDate(hoy.getDate() - i)
      const siguienteDia = new Date(dia)
      siguienteDia.setDate(dia.getDate() + 1)

      const pedidosDia = todosPedidos.filter(p => {
        const fechaPedido = new Date(p.createdAt)
        return fechaPedido >= dia && fechaPedido < siguienteDia
      })

      ventasPorDia.push({
        fecha: dia.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" }),
        pedidos: pedidosDia.length,
        ingresos: pedidosDia.reduce((sum, p) => sum + p.total, 0)
      })
    }

    // Ventas por hora (hoy)
    const ventasPorHora: { hora: string; pedidos: number }[] = []
    for (let h = 6; h <= 22; h++) {
      const pedidosHora = pedidosHoy.filter(p => {
        const hora = new Date(p.createdAt).getHours()
        return hora === h
      })
      ventasPorHora.push({
        hora: `${h}:00`,
        pedidos: pedidosHora.length
      })
    }

    // Metodos de pago (mes actual)
    const metodosPago: Record<string, number> = {}
    pedidosMes.forEach(p => {
      const metodo = p.metodoPago || "Otro"
      metodosPago[metodo] = (metodosPago[metodo] || 0) + 1
    })

    const distribucionMetodos = Object.entries(metodosPago)
      .map(([metodo, cantidad]) => ({ metodo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)

    // Total usuarios registrados
    const totalUsuarios = await prisma.user.count()
    const usuariosHoy = await prisma.user.count({
      where: { createdAt: { gte: hoy } }
    })

    // Pedidos pendientes (no incluir pendiente_pago)
    const pedidosPendientes = await prisma.order.count({
      where: { estado: "pendiente" }
    })
    const pedidosEnProceso = await prisma.order.count({
      where: { estado: "en_proceso" }
    })

    return NextResponse.json({
      resumen: {
        pedidosHoy: pedidosHoy.length,
        pedidosSemana: pedidosSemana.length,
        pedidosMes: pedidosMes.length,
        pedidosTotales: todosPedidos.length,
        ingresosHoy,
        ingresosSemana,
        ingresosMes,
        ingresosTotales,
        totalUsuarios,
        usuariosHoy,
        pedidosPendientes,
        pedidosEnProceso
      },
      topProductos,
      topClientes,
      ventasPorDia,
      ventasPorHora,
      distribucionMetodos,
      ultimaActualizacion: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error en estadisticas:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
