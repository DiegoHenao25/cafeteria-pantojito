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
      console.error("[v0] Error completando orden:", error)
    } finally {
      setLoading(false)
    }
  }

  const status = searchParams.get("status")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <Loader2 className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Procesando tu pago...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-6">
          {status === "success" ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Exitoso</h2>
              <p className="text-gray-600 mb-4">Tu pedido #{orderNumber} ha sido confirmado y está siendo preparado.</p>
              <Button onClick={() => router.push("/menu")} className="bg-amber-600 hover:bg-amber-700">
                Volver al Menú
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <XCircle className="w-16 h-16 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Cancelado</h2>
              <p className="text-gray-600 mb-4">El pago no se completó. Puedes intentar de nuevo.</p>
              <Button onClick={() => router.push("/checkout")} className="bg-amber-600 hover:bg-amber-700">
                Intentar de Nuevo
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
