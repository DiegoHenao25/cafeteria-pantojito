"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Package, CheckCircle2, XCircle, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGlobalTimer } from "@/hooks/use-global-timer"
import { CountdownBadge } from "@/components/countdown-badge"

interface OrderItem {
  id: number
  cantidad: number
  precio: number
  product: {
    nombre: string
    imagen: string | null
  }
}

interface Order {
  id: number
  total: number
  estado: string
  createdAt: string
  tiempoRecogida: number | null
  orderItems: OrderItem[]
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Hook para temporizador global
  const { getTimeRemaining, formatTime, getTimeColor, getProgress } = useGlobalTimer()

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/orders")

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else if (response.status === 401) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente_pago":
        return (
          <Badge className="bg-[#e9e076]/50 text-[#655642] border border-[#e9e076] border-dashed">
            <Clock className="w-3 h-3 mr-1" />
            Esperando Pago
          </Badge>
        )
      case "pendiente":
        return (
          <Badge className="bg-[#e9e076]/30 text-[#655642] border border-[#e9e076]">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "en_proceso":
        return (
          <Badge className="bg-[#d38BB6]/20 text-[#d38BB6] border border-[#d38BB6]">
            <Package className="w-3 h-3 mr-1" />
            En Proceso
          </Badge>
        )
      case "listo":
        return (
          <Badge className="bg-[#7BB39C]/20 text-[#655642] border border-[#7BB39C]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Listo para recoger
          </Badge>
        )
      case "entregado":
        return (
          <Badge className="bg-[#655642]/20 text-[#655642] border border-[#655642]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Entregado
          </Badge>
        )
      case "completado":
        return (
          <Badge className="bg-[#7BB39C]/20 text-[#7BB39C] border border-[#7BB39C]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-[#d38488]/30 animate-pulse" />
          <p className="text-[#655642]">Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#d38488]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/menu")} className="text-[#655642] hover:bg-[#d38488]/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-[#d38488]/30" />
              <div>
                <h1 className="text-xl font-bold text-[#655642]">Mis Pedidos</h1>
                <p className="text-sm text-[#d38488]">Historial y estado de tus pedidos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto border-[#d38488]/20">
            <CardContent className="pt-6 text-center">
              <ShoppingBag className="w-16 h-16 text-[#d38488] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#655642] mb-2">No tienes pedidos aun</h2>
              <p className="text-[#655642]/80 mb-6">Realiza tu primer pedido y aparecera aqui.</p>
              <Button onClick={() => router.push("/menu")} className="bg-[#d38488] hover:bg-[#d38488] text-white">
                Ver Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-[#d38488]/20">
                <CardHeader className="bg-[#d38488]/10 border-b border-[#d38488]/20">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-lg text-[#655642]">Pedido #{order.id}</CardTitle>
                      <CardDescription className="text-[#655642]/80">{formatDate(order.createdAt)}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Temporizador de cuenta regresiva */}
                      {order.tiempoRecogida && (order.estado === "pendiente" || order.estado === "en_proceso") && (
                        <CountdownBadge
                          timeRemaining={getTimeRemaining(order.createdAt, order.tiempoRecogida)}
                          formattedTime={formatTime(getTimeRemaining(order.createdAt, order.tiempoRecogida))}
                          color={getTimeColor(getTimeRemaining(order.createdAt, order.tiempoRecogida))}
                          progress={getProgress(order.createdAt, order.tiempoRecogida)}
                          size="sm"
                        />
                      )}
                      {getEstadoBadge(order.estado)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#d38488]/20">
                        <div className="w-12 h-12 bg-[#d38488]/10 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product.imagen ? (
                            <img
                              src={item.product.imagen || "/placeholder.svg"}
                              alt={item.product.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-[#d38488]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#655642]">{item.product.nombre}</p>
                          <p className="text-sm text-[#655642]/80">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-semibold text-[#d38488]">${Number(item.precio).toLocaleString("es-CO")}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-[#d38488]/20 pt-4 space-y-2">
                    {order.tiempoRecogida && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#655642]/80 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#d38488]" />
                          Tiempo estimado:
                        </span>
                        <span className="font-medium text-[#655642]">{order.tiempoRecogida} minutos</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-[#655642]">Total:</span>
                      <span className="text-[#d38488]">${Number(order.total).toLocaleString("es-CO")}</span>
                    </div>
                  </div>

                  {/* Status Message */}
                  {order.estado === "listo" && (
                    <div className="mt-4 p-3 bg-[#7BB39C]/10 border border-[#7BB39C]/30 rounded-lg">
                      <p className="text-sm text-[#7BB39C] font-medium text-center">
                        Tu pedido esta listo para recoger!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
