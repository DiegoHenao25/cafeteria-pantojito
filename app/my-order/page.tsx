"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Package, ArrowLeft, Coffee, Phone, Mail } from "lucide-react"

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
  clienteTelefono: string
  clienteCorreo: string
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

  const getOrderTimeline = (estado: string) => {
    const steps = [
      { id: "pendiente", label: "Pedido Recibido", icon: Package },
      { id: "listo", label: "Listo para Recoger", icon: CheckCircle },
      { id: "completado", label: "Entregado", icon: Coffee },
    ]

    const currentIndex = steps.findIndex((step) => step.id === estado)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          title: "Preparando tu pedido",
          description: "Nuestro equipo está trabajando en tu orden",
          badge: "En Preparación",
        }
      case "listo":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          title: "¡Tu pedido está listo!",
          description: "Puedes pasar a recogerlo en la cafetería",
          badge: "Listo para Recoger",
        }
      case "completado":
        return {
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          title: "Pedido completado",
          description: "Gracias por tu compra. ¡Disfruta tu pedido!",
          badge: "Completado",
        }
      case "cancelado":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          title: "Pedido cancelado",
          description: "Este pedido fue cancelado",
          badge: "Cancelado",
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          title: "Estado desconocido",
          description: "",
          badge: estado,
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <Coffee className="w-16 h-16 animate-pulse mx-auto mb-4 text-amber-600" />
          <p className="text-lg text-gray-600">Cargando tu pedido...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-4">No se encontró el pedido</p>
            <Button onClick={() => router.push("/menu")}>Volver al Menú</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.estado)
  const timeline = getOrderTimeline(order.estado)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="outline" onClick={() => router.push("/menu")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Menú
        </Button>

        <Card className="border-2 border-amber-200 mb-6">
          <CardHeader className={`text-center border-b border-amber-200 ${statusInfo.bgColor}`}>
            <div className="flex justify-center mb-4">
              <div className={`${statusInfo.color} p-4 rounded-full`}>
                {order.estado === "pendiente" && <Clock className="w-12 h-12 text-white" />}
                {order.estado === "listo" && <CheckCircle className="w-12 h-12 text-white" />}
                {order.estado === "completado" && <Coffee className="w-12 h-12 text-white" />}
                {order.estado === "cancelado" && <Package className="w-12 h-12 text-white" />}
              </div>
            </div>
            <CardTitle className={`text-2xl mb-2 ${statusInfo.textColor}`}>{statusInfo.title}</CardTitle>
            <p className="text-gray-600 mb-4">{statusInfo.description}</p>
            <Badge className={`${statusInfo.color} text-white text-lg px-6 py-2`}>{statusInfo.badge}</Badge>
          </CardHeader>

          <CardContent className="p-6">
            {order.estado !== "cancelado" && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-6 text-center">Progreso del Pedido</h3>
                <div className="flex items-center justify-between relative">
                  {/* Línea de conexión */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div
                      className={`h-full ${statusInfo.color} transition-all duration-500`}
                      style={{
                        width:
                          order.estado === "pendiente"
                            ? "0%"
                            : order.estado === "listo"
                              ? "50%"
                              : order.estado === "completado"
                                ? "100%"
                                : "0%",
                      }}
                    />
                  </div>

                  {timeline.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                            step.completed ? statusInfo.color : "bg-gray-200"
                          } ${step.active ? "ring-4 ring-amber-200 scale-110" : ""}`}
                        >
                          <Icon className={`w-6 h-6 ${step.completed ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <p
                          className={`text-xs text-center font-medium ${step.completed ? statusInfo.textColor : "text-gray-400"}`}
                        >
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Detalles del pedido */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  Detalles del Pedido
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número:</span>
                    <span className="font-bold">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleString("es-CO", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo estimado:</span>
                    <span className="font-medium text-amber-600">{order.tiempoRecogida} minutos</span>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Tu Información</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{order.clienteNombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{order.clienteTelefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-xs">{order.clienteCorreo}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Productos</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-100"
                  >
                    {item.product.imagen && (
                      <img
                        src={item.product.imagen || "/placeholder.svg"}
                        alt={item.product.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{item.product.nombre}</p>
                      <p className="text-sm text-gray-600">
                        ${Number(item.precio).toLocaleString()} x {item.cantidad}
                      </p>
                    </div>
                    <p className="font-bold text-lg">${(Number(item.precio) * item.cantidad).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-amber-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-600">${Number(order.total).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 border-t mt-6 pt-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p>Actualizando automáticamente cada 5 segundos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
