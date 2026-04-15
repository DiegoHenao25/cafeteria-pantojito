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
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f6] to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-[#d38488]/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-red-600">Pago Fallido</CardTitle>
          <CardDescription className="text-lg text-[#655642]/60">No se pudo procesar tu pago</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-900">
              <strong>Que paso?</strong>
              <br />
              El pago no pudo ser procesado. Esto puede deberse a:
              <br />- Fondos insuficientes
              <br />- Datos de tarjeta incorrectos
              <br />- Problemas con el banco emisor
              <br />- Cancelacion del pago
            </p>
          </div>

          {paymentId && (
            <div className="bg-[#e9e076]/20 p-4 rounded-lg border border-[#e9e076]/40">
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/60 text-sm">ID de Transaccion:</span>
                <span className="font-mono text-sm text-[#655642]">{paymentId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/checkout" className="flex-1">
              <Button className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Intentar de Nuevo
              </Button>
            </Link>
            <Link href="/menu" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent border-[#655642] text-[#655642] hover:bg-[#655642]/10">
                <Coffee className="w-4 h-4 mr-2" />
                Volver al Menu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
