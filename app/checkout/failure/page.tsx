"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, Coffee } from "lucide-react"
import Link from "next/link"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-red-600">Pago Fallido</CardTitle>
          <CardDescription className="text-lg">No se pudo procesar tu pago</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-900">
              <strong>¿Qué pasó?</strong>
              <br />
              El pago no pudo ser procesado. Esto puede deberse a:
              <br />• Fondos insuficientes
              <br />• Datos de tarjeta incorrectos
              <br />• Problemas con el banco emisor
              <br />• Cancelación del pago
            </p>
          </div>

          {paymentId && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">ID de Transacción:</span>
                <span className="font-mono text-sm">{paymentId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/checkout" className="flex-1">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Intentar de Nuevo
              </Button>
            </Link>
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
