"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Coffee, Clock } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    const orderId = searchParams.get("external_reference")

    if (orderId) {
      // Obtener detalles de la orden
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data))
        .catch((err) => console.error("Error fetching order:", err))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-green-600">Pago Exitoso</CardTitle>
          <CardDescription className="text-lg">Tu pedido ha sido confirmado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderDetails && (
            <div className="bg-amber-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Número de Pedido:</span>
                <span className="font-bold text-lg">#{orderDetails.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-lg text-green-600">${orderDetails.total?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="w-5 h-5" />
                <span>Tiempo de recogida: {orderDetails.tiempoRecogida} minutos</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Próximos pasos:</strong>
              <br />
              1. Recibirás una notificación cuando tu pedido esté listo
              <br />
              2. Dirígete a la cafetería para recoger tu pedido
              <br />
              3. Muestra este número de pedido al personal
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {orderDetails && (
              <Link href={`/my-order?id=${orderDetails.id}`} className="flex-1">
                <Button className="w-full">Ver Estado del Pedido</Button>
              </Link>
            )}
            <Link href="/menu" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <Coffee className="w-4 h-4 mr-2" />
                Volver al Menú
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
