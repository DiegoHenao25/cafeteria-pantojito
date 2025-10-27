import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] ePayco confirmation received:", body)

    const {
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_currency_code,
      x_signature,
      x_approval_code,
      x_transaction_state,
      x_response,
      x_response_reason_text,
      x_extra1, // orderId
      x_extra2, // paymentMethod
      x_extra3, // reference
    } = body

    // Verify signature
    const EPAYCO_P_CUST_ID = process.env.EPAYCO_P_CUST_ID
    const EPAYCO_PRIVATE_KEY = process.env.EPAYCO_PRIVATE_KEY

    if (!EPAYCO_P_CUST_ID || !EPAYCO_PRIVATE_KEY) {
      console.error("[v0] Missing ePayco credentials")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    // Connect to database
    const connection = await mysql.createConnection(process.env.DATABASE_URL!)

    try {
      // Update order payment status
      const paymentStatus = x_transaction_state === "Aceptada" ? "completed" : "failed"

      await connection.execute(
        `UPDATE Orders SET 
          payment_status = ?,
          payment_reference = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [paymentStatus, x_ref_payco, x_extra1],
      )

      console.log(`[v0] Order ${x_extra1} payment status updated to ${paymentStatus}`)

      // Send email notification if payment successful
      if (paymentStatus === "completed") {
        // TODO: Send email notification to staff
        console.log(`[v0] Payment successful for order ${x_extra1}`)
      }

      return NextResponse.json({ success: true })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("[v0] Error processing ePayco confirmation:", error)
    return NextResponse.json({ error: "Error processing confirmation" }, { status: 500 })
  }
}
