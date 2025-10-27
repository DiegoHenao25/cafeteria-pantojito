"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Coffee, Clock, Package, CheckCircle2, XCircle } from "lucide-react"
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
      console.log("[v0] Cargando pedidos del usuario...")
      const response = await fetch("/api/orders")

      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Pedidos recibidos:", data)
        setOrders(data)
      } else if (response.status === 401) {
        console.log("[v0] Usuario no autorizado, redirigiendo a login")
        router.push("/login")
      } else {
        console.log("[v0] Error en respuesta:", await response.text())
      }
    } catch (error) {
      console.error("[v0] Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "preparando":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Package className="w-3 h-3 mr-1" />
            Preparando
          </Badge>
        )
      case "listo":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Listo
          </Badge>
        )
      case "entregado":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Entregado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{estado}</Badge>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Coffee className="w-12 h-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/menu")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mis Pedidos</h1>
                <p className="text-sm text-gray-600">Historial y estado de tus pedidos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tienes pedidos aún.</p>
              <Button onClick={() => router.push("/menu")}>Ver Menú</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                    </div>
                    {getEstadoBadge(order.estado)}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product.imagen ? (
                            <img
                              src={item.product.imagen || "/placeholder.svg"}
                              alt={item.product.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Coffee className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product.nombre}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-semibold text-gray-900">${Number(item.precio).toLocaleString("es-CO")}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 space-y-2">
                    {order.tiempoRecogida && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Tiempo estimado:
                        </span>
                        <span className="font-medium">{order.tiempoRecogida} minutos</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-amber-600">${Number(order.total).toLocaleString("es-CO")}</span>
                    </div>
                  </div>

                  {/* Status Message */}
                  {order.estado === "listo" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium text-center">
                        ¡Tu pedido está listo para recoger!
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
