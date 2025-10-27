import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId, customerEmail, customerName, customerPhone } = await request.json()

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ error: "Mercado Pago no configurado" }, { status: 500 })
    }

    // Create preference in Mercado Pago
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
        success: `${process.env.NEXT_PUBLIC_APP_URL}/payment-result?status=success&orderId=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment-result?status=failure&orderId=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment-result?status=pending&orderId=${orderId}`,
      },
      auto_return: "approved",
      external_reference: orderId.toString(),
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago-webhook`,
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Error de Mercado Pago:", error)
      return NextResponse.json({ error: "Error al crear preferencia de pago" }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
    })
  } catch (error) {
    console.error("[v0] Error en create-mercadopago-payment:", error)
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 })
  }
}
