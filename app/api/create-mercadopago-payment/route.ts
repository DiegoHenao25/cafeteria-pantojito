import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Iniciando creación de pago en Mercado Pago")
    const body = await request.json()
    console.log("[v0] Body recibido:", JSON.stringify(body, null, 2))

    const { amount, orderId, customerEmail, customerName, customerPhone } = body

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    console.log("[v0] Access Token presente:", !!accessToken)
    console.log("[v0] App URL:", appUrl)

    if (!accessToken) {
      console.log("[v0] Error: Mercado Pago no configurado")
      return NextResponse.json({ error: "Mercado Pago no configurado" }, { status: 500 })
    }

    const preference = {
      items: [
        {
          title: `Pedido #${orderId} - Cafetería Pantojito`,
          quantity: 1,
          unit_price: amount,
          currency_id: "COP",
        },
      ],
      payer: {
        name: customerName,
        email: customerEmail,
        phone: {
          number: customerPhone,
        },
      },
      back_urls: {
        success: `${appUrl}/payment-success?orderId=${orderId}`,
        failure: `${appUrl}/payment-failure?orderId=${orderId}`,
        pending: `${appUrl}/payment-pending?orderId=${orderId}`,
      },
      auto_return: "approved",
      external_reference: orderId.toString(),
      notification_url: `${appUrl}/api/mercadopago-webhook`,
    }

    console.log("[v0] Preference creada:", JSON.stringify(preference, null, 2))

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    })

    console.log("[v0] Response status de Mercado Pago:", response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Error de Mercado Pago:", JSON.stringify(error, null, 2))
      return NextResponse.json(
        {
          error: "Error al crear preferencia de pago",
          details: error,
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    console.log("[v0] Preferencia creada exitosamente:", data.id)

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
    })
  } catch (error) {
    console.error("[v0] Error en create-mercadopago-payment:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack available")
    return NextResponse.json(
      {
        error: "Error al procesar el pago",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
