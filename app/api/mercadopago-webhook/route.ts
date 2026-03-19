import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Webhook de Mercado Pago recibido:", body)

    // Mercado Pago sends notifications for different events
    if (body.type === "payment") {
      const paymentId = body.data.id

      // Get payment details from Mercado Pago
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!paymentResponse.ok) {
        console.error("[v0] Error al obtener detalles del pago")
        return NextResponse.json({ error: "Error al obtener pago" }, { status: 500 })
      }

      const payment = await paymentResponse.json()
      const orderId = payment.external_reference
      const status = payment.status // approved, pending, rejected, etc.

      // Update order in database
      const connection = await mysql.createConnection(process.env.DATABASE_URL!)

      let paymentStatus = "pending"
      if (status === "approved") {
        paymentStatus = "completed"
      } else if (status === "rejected" || status === "cancelled") {
        paymentStatus = "failed"
      }

      await connection.execute("UPDATE Orders SET payment_status = ?, transaction_id = ? WHERE id = ?", [
        paymentStatus,
        paymentId,
        orderId,
      ])

      await connection.end()

      console.log(`[v0] Pedido ${orderId} actualizado a ${paymentStatus}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Error en webhook de Mercado Pago:", error)
    return NextResponse.json({ error: "Error en webhook" }, { status: 500 })
  }
}
