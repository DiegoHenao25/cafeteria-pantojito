import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import crypto from "crypto"

// Constante para la comisión de Wompi (1.98%)
const WOMPI_COMMISSION_RATE = 0.0198

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { items, tiempoRecogida, clienteInfo } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    if (!clienteInfo || !clienteInfo.nombre || !clienteInfo.cedula || !clienteInfo.telefono) {
      return NextResponse.json({ error: "Información del cliente incompleta" }, { status: 400 })
    }

    // Calcular subtotal desde el backend (no confiar en frontend)
    let subtotal = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || !product.disponible) {
        return NextResponse.json({ error: `Producto ${item.productId} no disponible` }, { status: 400 })
      }

      const itemSubtotal = Number(product.precio) * item.cantidad
      subtotal += itemSubtotal

      orderItemsData.push({
        productId: product.id,
        cantidad: item.cantidad,
        precio: product.precio,
      })
    }

    // Calcular comisión Wompi (1.98%)
    const comisionPago = Math.ceil(subtotal * WOMPI_COMMISSION_RATE)
    // Total final = subtotal + comisión
    const total = subtotal + comisionPago

    // Generar referencia única para Wompi
    const wompiReference = `PANTOJITO-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`

    // Crear la orden en base de datos
    // Nota: Los campos subtotal, comisionPago, wompiReference, wompiStatus son opcionales
    // hasta que se ejecute la migración SQL
    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        total,
        metodoPago: "wompi",
        estado: "pendiente",
        tiempoRecogida: tiempoRecogida || 15,
        clienteNombre: `${clienteInfo.nombre} ${clienteInfo.apellido || ""}`.trim(),
        clienteCedula: clienteInfo.cedula,
        clienteTelefono: clienteInfo.telefono,
        clienteCorreo: clienteInfo.correo,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Configuracion de Wompi
    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || process.env.WOMPI_PUBLIC_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    if (!publicKey) {
      console.error("[v0] WOMPI_PUBLIC_KEY no configurada")
      return NextResponse.json({ error: "Wompi no configurado correctamente. Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY" }, { status: 500 })
    }

    // Generar firma de integridad para Wompi
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET
    let signature = ""
    
    if (integritySecret) {
      // Wompi requiere: reference + amount_in_cents + currency + integrity_secret
      const amountInCents = Math.round(total * 100)
      const signatureString = `${wompiReference}${amountInCents}COP${integritySecret}`
      signature = crypto.createHash("sha256").update(signatureString).digest("hex")
    }

    return NextResponse.json({
      orderId: order.id,
      wompiReference,
      publicKey,
      amountInCents: Math.round(total * 100),
      currency: "COP",
      redirectUrl: `${appUrl}/checkout/success?orderId=${order.id}`,
      signature,
      // Información para mostrar al usuario
      breakdown: {
        subtotal,
        comisionPago,
        comisionPorcentaje: "1.98%",
        total,
      },
    })
  } catch (error) {
    console.error("Error en create-wompi-payment:", error)
    return NextResponse.json(
      {
        error: "Error al procesar el pago",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
