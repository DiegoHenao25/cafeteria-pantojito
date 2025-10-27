import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { amount, reference, customerEmail, customerName } = await request.json()

    if (!amount || !reference || !customerEmail) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET

    if (!wompiPublicKey || !integritySecret) {
      return NextResponse.json({ error: "Configuración de Wompi incompleta" }, { status: 500 })
    }

    const amountInCents = Math.round(amount * 100)
    const currency = "COP"

    const crypto = require("crypto")
    const concatenatedString = `${reference}${amountInCents}${currency}${integritySecret}`
    const integritySignature = crypto.createHash("sha256").update(concatenatedString).digest("hex")

    const paymentData = {
      publicKey: wompiPublicKey,
      currency: currency,
      amountInCents: amountInCents,
      reference: reference,
      signature: {
        integrity: integritySignature,
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment-result`,
      customerData: {
        email: customerEmail,
        fullName: customerName,
      },
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error("[v0] Error creando pago Wompi:", error)
    return NextResponse.json({ error: "Error al crear pago" }, { status: 500 })
  }
}
