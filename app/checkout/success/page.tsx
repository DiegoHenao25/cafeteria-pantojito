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
    const orderId = searchParams.get("orderId") || searchParams.get("external_reference") || searchParams.get("id")

    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data))
        .catch((err) => console.error("Error fetching order:", err))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-[#d38488]/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#d38488]/20 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-[#d38488]" />
            </div>
          </div>
          <CardTitle className="text-3xl text-[#655642]">Pago exitoso</CardTitle>
          <CardDescription className="text-lg text-[#d38488]">Tu pedido ha sido confirmado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderDetails ? (
            <div className="bg-[#d38488]/10 p-6 rounded-lg space-y-4 border border-[#d38488]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Numero de pedido:</span>
                <span className="font-bold text-lg text-[#655642]">#{orderDetails.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Total:</span>
                <span className="font-bold text-lg text-[#d38488]">${orderDetails.total?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-[#655642]/80">
                <Clock className="w-5 h-5 text-[#d38488]" />
                <span>Tiempo de recogida: {orderDetails.tiempoRecogida} minutos</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#d38488]/10 p-6 rounded-lg space-y-4 border border-[#d38488]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Numero de pedido:</span>
                <span className="font-bold text-lg text-[#655642]">#</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Total:</span>
                <span className="font-bold text-lg text-[#d38488]">$</span>
              </div>
              <div className="flex items-center gap-2 text-[#655642]/80">
                <Clock className="w-5 h-5 text-[#d38488]" />
                <span>Tiempo de recogida: minutos</span>
              </div>
            </div>
          )}

          <div className="bg-[#d38488]/10 p-4 rounded-lg border border-[#d38488]/30">
            <p className="text-sm text-[#655642]">
              <strong className="text-[#655642]">Proximos pasos:</strong>
              <br />
              1. Recibiras una notificacion cuando tu pedido este listo
              <br />
              2. Dirigete a la cafeteria para recoger tu pedido
              <br />
              3. Muestra este numero de pedido al personal
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/pedidos" className="flex-1">
              <Button className="w-full bg-[#d38488] hover:bg-[#d38488] text-white">
                Ver estado del pedido
              </Button>
            </Link>
            <Link href="/menu" className="flex-1">
              <Button variant="outline" className="w-full border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10">
                <Coffee className="w-4 h-4 mr-2" />
                Volver al menu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
