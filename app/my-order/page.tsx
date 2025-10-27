"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Package, ArrowLeft } from "lucide-react"

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
  clienteNombre: string
  createdAt: string
  orderItems: OrderItem[]
}

export default function MyOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push("/menu")
      return
    }

    loadOrder()
    // Actualizar cada 5 segundos para ver cambios en tiempo real
    const interval = setInterval(loadOrder, 5000)
    return () => clearInterval(interval)
  }, [orderId])

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("[v0] Error cargando orden:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: "Preparando tu pedido",
          description: "Estamos trabajando en tu orden",
          badge: <Badge className="bg-yellow-500 text-lg px-4 py-2">En Preparación</Badge>,
        }
      case "listo":
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: "¡Tu pedido está listo!",
          description: "Puedes pasar a recogerlo",
          badge: <Badge className="bg-green-500 text-lg px-4 py-2">Listo para Recoger</Badge>,
        }
      case "completado":
        return {
          icon: <Package className="w-12 h-12 text-blue-500" />,
          title: "Pedido completado",
          description: "Gracias por tu compra",
          badge: <Badge className="bg-blue-500 text-lg px-4 py-2">Completado</Badge>,
        }
      case "cancelado":
        return {
          icon: <Clock className="w-12 h-12 text-red-500" />,
          title: "Pedido cancelado",
          description: "Este pedido fue cancelado",
          badge: (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Cancelado
            </Badge>
          ),
        }
      default:
        return {
          icon: <Clock className="w-12 h-12 text-gray-500" />,
          title: "Estado desconocido",
          description: "",
          badge: <Badge>{estado}</Badge>,
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-amber-600" />
          <p>Cargando tu pedido...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-lg mb-4">No se encontró el pedido</p>
            <Button onClick={() => router.push("/menu")}>Volver al Menú</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.estado)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="outline" onClick={() => router.push("/menu")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Menú
        </Button>

        <Card className="border-2 border-amber-200">
          <CardHeader className="text-center border-b border-amber-200 bg-amber-50">
            <div className="flex justify-center mb-4">{statusInfo.icon}</div>
            <CardTitle className="text-2xl mb-2">{statusInfo.title}</CardTitle>
            <p className="text-gray-600">{statusInfo.description}</p>
            <div className="flex justify-center mt-4">{statusInfo.badge}</div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Información del pedido */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Detalles del Pedido</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Número de pedido:</strong> #{order.id}
                </p>
                <p>
                  <strong>Nombre:</strong> {order.clienteNombre}
                </p>
                <p>
                  <strong>Hora del pedido:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString("es-CO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <strong>Tiempo estimado:</strong> {order.tiempoRecogida} minutos
                </p>
              </div>
            </div>

            {/* Productos */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Tu Pedido</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    {item.product.imagen && (
                      <img
                        src={item.product.imagen || "/placeholder.svg"}
                        alt={item.product.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.nombre}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-bold">${item.precio.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">${order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Mensaje de actualización automática */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Esta página se actualiza automáticamente cada 5 segundos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
