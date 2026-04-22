import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// API para verificar el estado del pago directamente con Wompi
// y actualizar la orden en la base de datos

interface WompiTransaction {
  data: {
    id: string
    reference: string
    status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING"
    amount_in_cents: number
    currency: string
    payment_method_type: string
    finalized_at: string | null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const orderId = searchParams.get("orderId")
    const transactionId = searchParams.get("id") // Wompi envia el transaction ID como "id"

    if (!reference && !orderId && !transactionId) {
      return NextResponse.json({ error: "Se requiere reference, orderId o transactionId" }, { status: 400 })
    }

    // Si tenemos transactionId, verificar directamente con Wompi
    if (transactionId) {
      const wompiResponse = await fetch(
        `https://production.wompi.co/v1/transactions/${transactionId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.WOMPI_PRIVATE_KEY || ""}`,
          },
        }
      )

      if (wompiResponse.ok) {
        const wompiData: WompiTransaction = await wompiResponse.json()
        const transaction = wompiData.data

        // Buscar la orden por referencia
        // El formato de referencia es: PANTOJITO-timestamp-randomhex
        const order = await prisma.order.findFirst({
          where: {
            estado: { in: ["pendiente_pago", "pendiente"] },
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          orderBy: { createdAt: "desc" },
          include: {
            orderItems: {
              include: { product: true }
            }
          }
        })

        if (order) {
          // Mapear estado de Wompi
          let nuevoEstado: string
          let pagado = false

          switch (transaction.status) {
            case "APPROVED":
              nuevoEstado = "pendiente" // Pago OK, pedido listo para preparar
              pagado = true
              break
            case "DECLINED":
            case "VOIDED":
            case "ERROR":
              nuevoEstado = "cancelado"
              break
            case "PENDING":
            default:
              nuevoEstado = "pendiente_pago"
          }

          // Actualizar la orden
          const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: { estado: nuevoEstado },
            include: {
              orderItems: {
                include: { product: true }
              }
            }
          })

          return NextResponse.json({
            success: true,
            order: updatedOrder,
            paymentStatus: transaction.status,
            pagado,
            wompiTransactionId: transaction.id
          })
        }

        return NextResponse.json({
          success: false,
          paymentStatus: transaction.status,
          error: "Orden no encontrada"
        })
      }
    }

    // Buscar orden por orderId
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          orderItems: {
            include: { product: true }
          }
        }
      })

      if (!order) {
        return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
      }

      // Determinar si el pago esta confirmado basado en el estado
      const pagado = order.estado !== "pendiente_pago" && order.estado !== "cancelado"

      return NextResponse.json({
        success: true,
        order,
        pagado,
        estado: order.estado
      })
    }

    return NextResponse.json({ error: "Parametros insuficientes" }, { status: 400 })

  } catch (error) {
    console.error("[verify-payment] Error:", error)
    return NextResponse.json(
      { error: "Error verificando el pago" },
      { status: 500 }
    )
  }
}

// POST para verificar y actualizar manualmente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, transactionId } = body

    if (!orderId) {
      return NextResponse.json({ error: "Se requiere orderId" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        orderItems: {
          include: { product: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    // Si tenemos transactionId, verificar con Wompi
    if (transactionId && process.env.WOMPI_PRIVATE_KEY) {
      const wompiResponse = await fetch(
        `https://production.wompi.co/v1/transactions/${transactionId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
          },
        }
      )

      if (wompiResponse.ok) {
        const wompiData: WompiTransaction = await wompiResponse.json()
        
        let nuevoEstado: string
        switch (wompiData.data.status) {
          case "APPROVED":
            nuevoEstado = "pendiente"
            break
          case "DECLINED":
          case "VOIDED":
          case "ERROR":
            nuevoEstado = "cancelado"
            break
          default:
            nuevoEstado = "pendiente_pago"
        }

        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { estado: nuevoEstado },
          include: {
            orderItems: {
              include: { product: true }
            }
          }
        })

        return NextResponse.json({
          success: true,
          order: updatedOrder,
          paymentStatus: wompiData.data.status,
          pagado: wompiData.data.status === "APPROVED"
        })
      }
    }

    return NextResponse.json({
      success: true,
      order,
      pagado: order.estado !== "pendiente_pago" && order.estado !== "cancelado"
    })

  } catch (error) {
    console.error("[verify-payment POST] Error:", error)
    return NextResponse.json(
      { error: "Error verificando el pago" },
      { status: 500 }
    )
  }
}
