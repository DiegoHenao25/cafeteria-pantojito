"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function PaymentResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)

  useEffect(() => {
    const status = searchParams.get("status")
    const reference = searchParams.get("reference")

    if (status === "success" && reference) {
      completePendingOrder()
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const completePendingOrder = async () => {
    try {
      const pendingOrderData = localStorage.getItem("pendingOrder")
      if (!pendingOrderData) {
        setLoading(false)
        return
      }

      const orderData = JSON.parse(pendingOrderData)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderNumber(order.id)
        localStorage.removeItem("pendingOrder")
        localStorage.removeItem("cart")
      }
    } catch (error) {
      console.error("Error completando orden:", error)
    } finally {
      setLoading(false)
    }
  }

  const status = searchParams.get("status")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 border-pink-200">
          <CardContent className="pt-6">
            <Loader2 className="w-16 h-16 text-pink-400 animate-spin mx-auto mb-4" />
            <p className="text-amber-700">Procesando tu pago...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-2 border-pink-200">
        <CardContent className="pt-6">
          {status === "success" ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-pink-100 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-pink-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Pago exitoso</h2>
              <p className="text-amber-700 mb-4">Tu pedido #{orderNumber} ha sido confirmado y esta siendo preparado.</p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => router.push("/pedidos")} 
                  className="bg-pink-400 hover:bg-pink-500 text-white"
                >
                  Ver mis pedidos
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/menu")} 
                  className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
                >
                  Volver al menu
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Pago cancelado</h2>
              <p className="text-amber-700 mb-4">El pago no se completo. Puedes intentar de nuevo.</p>
              <Button 
                onClick={() => router.push("/checkout")} 
                className="bg-pink-400 hover:bg-pink-500 text-white"
              >
                Intentar de nuevo
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
