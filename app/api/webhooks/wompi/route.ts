import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Wompi envia eventos cuando cambia el estado de una transaccion
// Documentacion: https://docs.wompi.co/docs/colombia/webhooks

interface WompiWebhookEvent {
  event: string
  data: {
    transaction: {
      id: string
      reference: string
      status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING"
      amount_in_cents: number
      currency: string
      payment_method_type: string
      created_at: string
      finalized_at: string
    }
  }
  sent_at: string
  timestamp: number
  signature: {
    checksum: string
    properties: string[]
  }
}

// Verificar la firma del webhook de Wompi
function verifyWompiSignature(body: WompiWebhookEvent, eventsSecret: string): boolean {
  try {
    const { signature, data, timestamp } = body
    const { properties, checksum } = signature
    
    // Construir la cadena para verificar
    const values = properties.map(prop => {
      const keys = prop.split(".")
      let value: any = body
      for (const key of keys) {
        value = value?.[key]
      }
      return value
    })
    
    const concatenated = values.join("") + timestamp + eventsSecret
    const calculatedChecksum = crypto.createHash("sha256").update(concatenated).digest("hex")
    
    return calculatedChecksum === checksum
  } catch (error) {
    console.error("[Wompi Webhook] Error verificando firma:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WompiWebhookEvent = await request.json()
    
    console.log("[Wompi Webhook] Evento recibido:", body.event)
    console.log("[Wompi Webhook] Referencia:", body.data?.transaction?.reference)
    console.log("[Wompi Webhook] Estado:", body.data?.transaction?.status)

    // Verificar firma (opcional pero recomendado en produccion)
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET
    if (eventsSecret && body.signature) {
      const isValid = verifyWompiSignature(body, eventsSecret)
      if (!isValid) {
        console.error("[Wompi Webhook] Firma invalida")
        return NextResponse.json({ error: "Firma invalida" }, { status: 401 })
      }
    }

    // Solo procesar eventos de transaccion
    if (body.event !== "transaction.updated") {
      return NextResponse.json({ message: "Evento ignorado" })
    }

    const { transaction } = body.data
    const reference = transaction.reference

    // Extraer el orderId de la referencia (formato: PANTOJITO-timestamp-randomhex)
    // Buscar la orden por la referencia wompi almacenada
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: parseInt(reference.split("-")[1]) || 0 },
          // Buscar por referencia exacta si se almacena
        ]
      }
    })

    if (!order) {
      // Intentar buscar por el patron de referencia en ordenes pendientes recientes
      const recentOrders = await prisma.order.findMany({
        where: {
          estado: "pendiente_pago",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Ultimas 24 horas
          }
        },
        orderBy: { createdAt: "desc" }
      })
      
      // Por ahora log y continuar
      console.error("[Wompi Webhook] Orden no encontrada para referencia:", reference)
      return NextResponse.json({ message: "Orden no encontrada" })
    }

    // Mapear estados de Wompi a estados del sistema
    let nuevoEstado: string
    switch (transaction.status) {
      case "APPROVED":
        nuevoEstado = "pendiente" // Pago aprobado, pedido pendiente de preparacion
        break
      case "DECLINED":
      case "VOIDED":
      case "ERROR":
        nuevoEstado = "cancelado"
        break
      case "PENDING":
        nuevoEstado = "pendiente_pago"
        break
      default:
        nuevoEstado = "pendiente_pago"
    }

    // Actualizar la orden
    await prisma.order.update({
      where: { id: order.id },
      data: {
        estado: nuevoEstado,
        // Guardar info de Wompi si los campos existen
        // wompiTransactionId: transaction.id,
        // wompiStatus: transaction.status,
      }
    })

    console.log(`[Wompi Webhook] Orden ${order.id} actualizada a estado: ${nuevoEstado}`)

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      newStatus: nuevoEstado 
    })

  } catch (error) {
    console.error("[Wompi Webhook] Error:", error)
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 }
    )
  }
}

// GET para verificar que el endpoint esta activo
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Wompi webhook endpoint activo" 
  })
}
