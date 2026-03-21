"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Package, CheckCircle2, XCircle, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

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
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "preparando":
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
            <Package className="w-3 h-3 mr-1" />
            Preparando
          </Badge>
        )
      case "listo":
        return (
          <Badge className="bg-green-100 text-green-800 border border-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Listo para recoger
          </Badge>
        )
      case "entregado":
      case "completado":
        return (
          <Badge className="bg-pink-100 text-pink-800 border border-pink-300">
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-pink-200 animate-pulse" />
          <p className="text-amber-900">Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/menu")} className="text-amber-900 hover:bg-pink-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-pink-200" />
              <div>
                <h1 className="text-xl font-bold text-amber-900">Mis Pedidos</h1>
                <p className="text-sm text-pink-400">Historial y estado de tus pedidos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto border-pink-100">
            <CardContent className="pt-6 text-center">
              <ShoppingBag className="w-16 h-16 text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-amber-900 mb-2">No tienes pedidos aun</h2>
              <p className="text-amber-700 mb-6">Realiza tu primer pedido y aparecera aqui.</p>
              <Button onClick={() => router.push("/menu")} className="bg-pink-400 hover:bg-pink-500 text-white">
                Ver Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-pink-100">
                <CardHeader className="bg-pink-50 border-b border-pink-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-amber-900">Pedido #{order.id}</CardTitle>
                      <CardDescription className="text-amber-700">{formatDate(order.createdAt)}</CardDescription>
                    </div>
                    {getEstadoBadge(order.estado)}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-pink-100">
                        <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product.imagen ? (
                            <img
                              src={item.product.imagen || "/placeholder.svg"}
                              alt={item.product.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-pink-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-amber-900">{item.product.nombre}</p>
                          <p className="text-sm text-amber-700">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-semibold text-pink-500">${Number(item.precio).toLocaleString("es-CO")}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-pink-100 pt-4 space-y-2">
                    {order.tiempoRecogida && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-700 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-pink-400" />
                          Tiempo estimado:
                        </span>
                        <span className="font-medium text-amber-900">{order.tiempoRecogida} minutos</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-amber-900">Total:</span>
                      <span className="text-pink-500">${Number(order.total).toLocaleString("es-CO")}</span>
                    </div>
                  </div>

                  {/* Status Message */}
                  {order.estado === "listo" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium text-center">
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
