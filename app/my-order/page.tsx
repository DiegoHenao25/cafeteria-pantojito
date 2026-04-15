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
    if (!orderId || orderId === "undefined") {
      router.push("/pedidos")
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
      console.error("Error cargando orden:", error)
    } finally {
      setLoading(false)
    }
  }

  const getOrderTimeline = (estado: string) => {
    const steps = [
      { id: "pendiente", label: "Recibido", icon: Package },
      { id: "en_proceso", label: "En Proceso", icon: Clock },
      { id: "listo", label: "Listo", icon: CheckCircle },
      { id: "entregado", label: "Entregado", icon: Coffee },
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
          color: "bg-[#e9e076]",
          textColor: "text-[#655642]",
          bgColor: "bg-[#e9e076]/10",
          title: "Pedido recibido",
          description: "Tu pedido ha sido recibido y pronto comenzara a prepararse",
          badge: "Pendiente",
        }
      case "en_proceso":
        return {
          color: "bg-[#d38BB6]",
          textColor: "text-[#d38BB6]",
          bgColor: "bg-[#d38BB6]/10",
          title: "Preparando tu pedido",
          description: "Nuestro equipo esta trabajando en tu orden",
          badge: "En Proceso",
        }
      case "listo":
        return {
          color: "bg-[#7BB39C]",
          textColor: "text-[#7BB39C]",
          bgColor: "bg-[#7BB39C]/10",
          title: "Tu pedido esta listo!",
          description: "Puedes pasar a recogerlo en la cafeteria",
          badge: "Listo para recoger",
        }
      case "entregado":
        return {
          color: "bg-[#655642]",
          textColor: "text-[#655642]",
          bgColor: "bg-[#655642]/10",
          title: "Pedido entregado",
          description: "Gracias por tu compra. Disfruta tu pedido!",
          badge: "Entregado",
        }
      case "cancelado":
        return {
          color: "bg-red-500",
          textColor: "text-red-600",
          bgColor: "bg-red-50",
          title: "Pedido cancelado",
          description: "Este pedido fue cancelado",
          badge: "Cancelado",
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-600",
          bgColor: "bg-gray-50",
          title: "Estado desconocido",
          description: "",
          badge: estado,
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <div className="text-center">
          <Coffee className="w-16 h-16 animate-pulse mx-auto mb-4 text-[#d38488]" />
          <p className="text-lg text-[#655642]/80">Cargando tu pedido...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <Card className="max-w-md mx-4 border-2 border-[#d38488]/30">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-[#d38488]" />
            <p className="text-lg mb-4 text-[#655642]">No se encontro el pedido</p>
            <Button 
              onClick={() => router.push("/pedidos")}
              className="bg-[#d38488] hover:bg-[#d38488] text-white"
            >
              Ver mis pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.estado)
  const timeline = getOrderTimeline(order.estado)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => router.push("/pedidos")} 
          className="mb-6 border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ver mis pedidos
        </Button>

        <Card className="border-2 border-[#d38488]/30 mb-6">
          <CardHeader className={`text-center border-b border-[#d38488]/30 ${statusInfo.bgColor}`}>
            <div className="flex justify-center mb-4">
              <div className={`${statusInfo.color} p-4 rounded-full`}>
                {order.estado === "pendiente" && <Clock className="w-12 h-12 text-white" />}
                {order.estado === "listo" && <CheckCircle className="w-12 h-12 text-white" />}
                {order.estado === "completado" && <Coffee className="w-12 h-12 text-white" />}
                {order.estado === "cancelado" && <Package className="w-12 h-12 text-white" />}
              </div>
            </div>
            <CardTitle className={`text-2xl mb-2 ${statusInfo.textColor}`}>{statusInfo.title}</CardTitle>
            <p className="text-[#655642]/80 mb-4">{statusInfo.description}</p>
            <Badge className={`${statusInfo.color} text-white text-lg px-6 py-2`}>{statusInfo.badge}</Badge>
          </CardHeader>

          <CardContent className="p-6">
            {order.estado !== "cancelado" && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-6 text-center text-[#655642]">Progreso del pedido</h3>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-6 left-0 right-0 h-1 bg-[#d38488]/20 -z-10">
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

                  {timeline.map((step) => {
                    const Icon = step.icon
                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                            step.completed ? statusInfo.color : "bg-[#d38488]/20"
                          } ${step.active ? "ring-4 ring-[#d38488]/30 scale-110" : ""}`}
                        >
                          <Icon className={`w-6 h-6 ${step.completed ? "text-white" : "text-[#d38488]"}`} />
                        </div>
                        <p
                          className={`text-xs text-center font-medium ${step.completed ? statusInfo.textColor : "text-[#d38488]"}`}
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
              <div className="bg-[#d38488]/10 p-4 rounded-lg border border-[#d38488]/30">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-[#655642]">
                  <Package className="w-5 h-5 text-[#d38488]" />
                  Detalles del pedido
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#655642]/80">Numero:</span>
                    <span className="font-bold text-[#655642]">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#655642]/80">Fecha:</span>
                    <span className="font-medium text-[#655642]">
                      {new Date(order.createdAt).toLocaleString("es-CO", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#655642]/80">Tiempo estimado:</span>
                    <span className="font-medium text-[#d38488]">{order.tiempoRecogida} minutos</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#d38488]/10 p-4 rounded-lg border border-[#d38488]/30">
                <h3 className="font-semibold text-lg mb-3 text-[#655642]">Tu informacion</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#d38488]" />
                    <span className="font-medium text-[#655642]">{order.clienteNombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#d38488]" />
                    <span className="font-medium text-[#655642]">{order.clienteTelefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#d38488]" />
                    <span className="font-medium text-xs text-[#655642]">{order.clienteCorreo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-[#655642]">Productos</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-[#d38488]/20"
                  >
                    {item.product.imagen && (
                      <img
                        src={item.product.imagen || "/placeholder.svg"}
                        alt={item.product.nombre}
                        className="w-16 h-16 object-cover rounded border border-[#d38488]/30"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[#655642]">{item.product.nombre}</p>
                      <p className="text-sm text-[#655642]/80">
                        ${Number(item.precio).toLocaleString()} x {item.cantidad}
                      </p>
                    </div>
                    <p className="font-bold text-lg text-[#d38488]">${(Number(item.precio) * item.cantidad).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[#d38488]/30 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#655642]">Total:</span>
                <span className="text-2xl font-bold text-[#d38488]">${Number(order.total).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center text-sm text-[#655642]/80 border-t border-[#d38488]/30 mt-6 pt-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#d38488] rounded-full animate-pulse" />
                <p>Actualizando automaticamente cada 5 segundos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
