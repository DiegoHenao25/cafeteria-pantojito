"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingBag, Clock } from "lucide-react"

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
  tiempoRecogida: number
  createdAt: string
  orderItems: OrderItem[]
}

export default function MisPedidosPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders/mis-pedidos")
      if (res.ok) {
        const data = await res.json()
        setOrders(data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">Pendiente</Badge>
      case "listo":
        return <Badge className="bg-green-100 text-green-700 border border-green-300">Listo para recoger</Badge>
      case "completado":
        return <Badge className="bg-pink-100 text-pink-700 border border-pink-300">Completado</Badge>
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-pink-200" />
          <p className="text-amber-900">Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/menu")} className="text-amber-900 hover:bg-pink-50">
              <ArrowLeft className="w-5 h-5 mr-2" />
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

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {orders.length === 0 ? (
          <Card className="border-pink-100">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-pink-300" />
              <h2 className="text-xl font-semibold text-amber-900 mb-2">No tienes pedidos aun</h2>
              <p className="text-amber-700 mb-6">Realiza tu primer pedido y aparecera aqui.</p>
              <Button onClick={() => router.push("/menu")} className="bg-pink-400 hover:bg-pink-500 text-white">
                Ver Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-pink-100 overflow-hidden">
                <CardHeader className="bg-pink-50 border-b border-pink-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-amber-900">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-amber-700">
                        {new Date(order.createdAt).toLocaleString("es-CO", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.estado)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-pink-100">
                        {item.product.imagen ? (
                          <img
                            src={item.product.imagen}
                            alt={item.product.nombre}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-pink-100 rounded flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-pink-300" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-amber-900">{item.product.nombre}</p>
                          <p className="text-sm text-amber-700">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-semibold text-pink-500">${(item.precio * item.cantidad).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-pink-100">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span className="text-sm">Tiempo de recogida: {order.tiempoRecogida} min</span>
                    </div>
                    <p className="text-lg font-bold text-amber-900">
                      Total: <span className="text-pink-500">${order.total.toLocaleString()}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
