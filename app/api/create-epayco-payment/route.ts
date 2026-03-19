import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      amount,
      reference,
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      customerDocType,
      customerDoc,
      paymentMethod,
    } = body

    // ePayco API credentials from environment variables
    const EPAYCO_PUBLIC_KEY = process.env.EPAYCO_PUBLIC_KEY
    const EPAYCO_PRIVATE_KEY = process.env.EPAYCO_PRIVATE_KEY
    const EPAYCO_P_CUST_ID = process.env.EPAYCO_P_CUST_ID
    const EPAYCO_TEST = process.env.EPAYCO_TEST === "true"

    if (!EPAYCO_PUBLIC_KEY || !EPAYCO_PRIVATE_KEY || !EPAYCO_P_CUST_ID) {
      return NextResponse.json({ error: "Configuración de ePayco incompleta" }, { status: 500 })
    }

    // Determine payment method code for ePayco
    let methodType = "CARD"
    if (paymentMethod === "pse") {
      methodType = "PSE"
    } else if (paymentMethod === "nequi") {
      methodType = "NEQUI"
    }

    // Create payment link with ePayco
    const paymentData = {
      // Authentication
      public_key: EPAYCO_PUBLIC_KEY,

      // Transaction info
      name: `Pedido Cafetería #${orderId}`,
      description: `Pedido de cafetería - Referencia: ${reference}`,
      invoice: reference,
      currency: "COP",
      amount: amount.toString(),
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",

      // Customer info
      external: "false",
      extra1: orderId.toString(),
      extra2: paymentMethod,
      extra3: reference,
      confirmation: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cafeteria-pantojito.vercel.app"}/api/epayco-confirmation`,
      response: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cafeteria-pantojito.vercel.app"}/payment-result`,

      // Customer data
      name_billing: customerName,
      email_billing: customerEmail,
      type_doc_billing: customerDocType,
      number_doc_billing: customerDoc,
      mobilephone_billing: customerPhone,

      // Payment method
      methodsDisable: methodType === "CARD" ? [] : ["CARD"],

      // Test mode
      test: EPAYCO_TEST ? "true" : "false",
    }

    // Create URL encoded form data
    const formData = new URLSearchParams()
    Object.entries(paymentData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v))
      } else {
        formData.append(key, value as string)
      }
    })

    // Generate payment URL
    const paymentUrl = `https://checkout.epayco.co/checkout.php?${formData.toString()}`

    return NextResponse.json({
      success: true,
      paymentUrl,
      reference,
      orderId,
    })
  } catch (error) {
    console.error("[v0] Error creating ePayco payment:", error)
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 })
  }
}
