import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOrderNotificationToStaff } from "@/lib/email"
import crypto from "crypto"

// Verificar firma del webhook de Wompi
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
  return signature === expectedSignature
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("x-event-checksum") || ""
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET

    // Verificar firma si está configurado el secret
    if (eventsSecret && signature) {
      const isValid = verifyWebhookSignature(payload, signature, eventsSecret)
      if (!isValid) {
        console.error("Firma de webhook inválida")
        return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
      }
    }

    const body = JSON.parse(payload)
    const { event, data } = body

    console.log("Wompi webhook recibido:", event)

    // Solo procesar eventos de transacción
    if (event !== "transaction.updated") {
      return NextResponse.json({ message: "Evento ignorado" })
    }

    const transaction = data.transaction
    const reference = transaction.reference
    const status = transaction.status

    console.log(`Transacción ${reference} - Estado: ${status}`)

    // Extraer el orderId de la referencia (formato: PANTOJITO-timestamp-random)
    // Por ahora buscamos por id del order si está en la referencia
    // La referencia tiene formato: PANTOJITO-{timestamp}-{random}
    // Buscar la orden más reciente pendiente con método wompi
    const order = await prisma.order.findFirst({
      where: { 
        metodoPago: "wompi",
        estado: "pendiente"
      },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      console.error(`Orden no encontrada para referencia: ${reference}`)
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    // Mapear estados de Wompi a estados de nuestra app
    let newEstado = order.estado
    switch (status) {
      case "APPROVED":
        newEstado = "pagado"
        break
      case "DECLINED":
      case "ERROR":
        newEstado = "cancelado"
        break
      case "VOIDED":
        newEstado = "cancelado"
        break
      case "PENDING":
        newEstado = "pendiente"
        break
      default:
        console.log(`Estado desconocido: ${status}`)
    }

    // Actualizar orden
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        estado: newEstado,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Si el pago fue aprobado, enviar notificación al staff
    if (status === "APPROVED") {
      try {
        await sendOrderNotificationToStaff({
          orderNumber: updatedOrder.id,
          clienteNombre: updatedOrder.clienteNombre || "Cliente",
          clienteCedula: updatedOrder.clienteCedula || "",
          clienteTelefono: updatedOrder.clienteTelefono || "",
          clienteCorreo: updatedOrder.clienteCorreo || "",
          tiempoRecogida: updatedOrder.tiempoRecogida || 15,
          metodoPago: "Wompi",
          total: Number(updatedOrder.total),
          items: updatedOrder.orderItems.map((item) => ({
            nombre: item.product.nombre,
            cantidad: item.cantidad,
            precio: Number(item.precio),
          })),
        })
      } catch (emailError) {
        console.error("Error enviando email de notificación:", emailError)
      }
    }

    console.log(`Orden ${order.id} actualizada a estado: ${newEstado}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en wompi-webhook:", error)
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 }
    )
  }
}

// También soportar GET para verificación de Wompi
export async function GET() {
  return NextResponse.json({ status: "ok" })
}
