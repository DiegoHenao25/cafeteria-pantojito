"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Coffee, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  id: number
  total: number
  estado: string
  tiempoRecogida: number
  clienteNombre: string
  createdAt: string
  orderItems: Array<{
    cantidad: number
    product: {
      nombre: string
      precio: number
    }
  }>
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"verificando" | "aprobado" | "pendiente" | "rechazado" | "error">("verificando")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    verifyPayment()
  }, [searchParams])

  const verifyPayment = async () => {
    try {
      // Obtener parametros de la URL (Wompi puede enviar varios)
      const orderId = searchParams.get("orderId") || searchParams.get("external_reference")
      const transactionId = searchParams.get("id") // Wompi transaction ID
      const reference = searchParams.get("reference")

      if (!orderId && !transactionId) {
        setPaymentStatus("error")
        setErrorMessage("No se encontro informacion del pedido")
        setLoading(false)
        return
      }

      // Verificar el pago con el backend
      const params = new URLSearchParams()
      if (orderId) params.append("orderId", orderId)
      if (transactionId) params.append("id", transactionId)
      if (reference) params.append("reference", reference)

      const response = await fetch(`/api/verify-payment?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setPaymentStatus("error")
        setErrorMessage(data.error || "Error verificando el pago")
        setLoading(false)
        return
      }

      setOrderDetails(data.order)

      // Determinar el estado del pago
      if (data.pagado) {
        setPaymentStatus("aprobado")
      } else if (data.order?.estado === "pendiente_pago") {
        setPaymentStatus("pendiente")
      } else if (data.order?.estado === "cancelado") {
        setPaymentStatus("rechazado")
      } else {
        setPaymentStatus("aprobado") // Si ya esta en proceso o listo
      }

    } catch (error) {
      console.error("Error verificando pago:", error)
      setPaymentStatus("error")
      setErrorMessage("Error de conexion al verificar el pago")
    } finally {
      setLoading(false)
    }
  }

  // Reintentar verificacion
  const handleRetryVerification = () => {
    setLoading(true)
    setPaymentStatus("verificando")
    verifyPayment()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 border-[#d38488]/30">
          <CardContent className="pt-8 pb-8">
            <Loader2 className="w-16 h-16 text-[#d38488] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#655642] mb-2">Verificando tu pago...</h2>
            <p className="text-[#655642]/60">Por favor espera mientras confirmamos tu transaccion</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pago aprobado
  if (paymentStatus === "aprobado" && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-[#7BB39C]/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#7BB39C]/20 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-[#7BB39C]" />
              </div>
            </div>
            <CardTitle className="text-3xl text-[#655642]">Pago Confirmado</CardTitle>
            <CardDescription className="text-lg text-[#7BB39C]">Tu pedido ha sido registrado exitosamente</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-[#7BB39C]/10 p-6 rounded-lg space-y-4 border border-[#7BB39C]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Numero de pedido:</span>
                <span className="font-bold text-2xl text-[#655642]">#{orderDetails.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Total pagado:</span>
                <span className="font-bold text-xl text-[#7BB39C]">${orderDetails.total?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#655642]/80">Cliente:</span>
                <span className="font-medium text-[#655642]">{orderDetails.clienteNombre}</span>
              </div>
              <div className="flex items-center gap-2 text-[#655642]/80">
                <Clock className="w-5 h-5 text-[#d38488]" />
                <span>Tiempo estimado de recogida: <strong>{orderDetails.tiempoRecogida} minutos</strong></span>
              </div>
            </div>

            {/* Productos del pedido */}
            <div className="bg-[#d38488]/5 p-4 rounded-lg border border-[#d38488]/20">
              <h3 className="font-semibold text-[#655642] mb-3">Tu pedido:</h3>
              <div className="space-y-2">
                {orderDetails.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-[#655642]/80">{item.cantidad}x {item.product.nombre}</span>
                    <span className="text-[#655642]">${(Number(item.product.precio) * item.cantidad).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#e9e076]/20 p-4 rounded-lg border border-[#e9e076]/30">
              <p className="text-sm text-[#655642]">
                <strong className="text-[#655642]">Proximos pasos:</strong>
                <br />
                1. Recibiras una notificacion cuando tu pedido este listo
                <br />
                2. Dirigete a la cafeteria para recoger tu pedido
                <br />
                3. Muestra el numero de pedido <strong>#{orderDetails.id}</strong> al personal
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/my-order?orderId=${orderDetails.id}`} className="flex-1">
                <Button className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white">
                  Seguir mi pedido
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

  // Pago pendiente
  if (paymentStatus === "pendiente") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 border-[#e9e076]/50">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-[#e9e076]/30 p-4 rounded-full">
                <Clock className="w-16 h-16 text-[#e9e076]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#655642] mb-2">Pago Pendiente</h2>
            <p className="text-[#655642]/80 mb-4">
              Tu pago esta siendo procesado. Esto puede tomar unos momentos.
            </p>
            {orderDetails && (
              <p className="text-sm text-[#655642]/60 mb-4">
                Pedido #{orderDetails.id}
              </p>
            )}
            <div className="space-y-3">
              <Button 
                onClick={handleRetryVerification}
                className="w-full bg-[#e9e076] hover:bg-[#e9e076]/80 text-[#655642]"
              >
                Verificar estado del pago
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/pedidos")}
                className="w-full border-[#d38488] text-[#655642]"
              >
                Ver mis pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pago rechazado o cancelado
  if (paymentStatus === "rechazado") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 border-red-200">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#655642] mb-2">Pago No Completado</h2>
            <p className="text-[#655642]/80 mb-2">
              El pago fue rechazado o cancelado.
            </p>
            <p className="text-sm text-[#655642]/60 mb-4">
              Tu pedido ha sido cancelado automaticamente. No se realizo ningun cargo.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white"
              >
                Intentar de nuevo
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/menu")}
                className="w-full border-[#d38488] text-[#655642]"
              >
                Volver al menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-2 border-[#e9e076]/50">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-[#e9e076]/30 p-4 rounded-full">
              <AlertTriangle className="w-16 h-16 text-[#e9e076]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#655642] mb-2">Error de Verificacion</h2>
          <p className="text-[#655642]/80 mb-4">
            {errorMessage || "No pudimos verificar tu pago en este momento."}
          </p>
          <div className="space-y-3">
            <Button 
              onClick={handleRetryVerification}
              className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white"
            >
              Reintentar
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/pedidos")}
              className="w-full border-[#d38488] text-[#655642]"
            >
              Ver mis pedidos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 border-[#d38488]/30">
          <CardContent className="pt-8 pb-8">
            <Loader2 className="w-16 h-16 text-[#d38488] animate-spin mx-auto mb-4" />
            <p className="text-[#655642]/80">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
