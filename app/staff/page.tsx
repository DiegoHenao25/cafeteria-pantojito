"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, Clock, User, Phone, Mail, CreditCard, Package, CheckCircle, XCircle, LogOut } from "lucide-react"

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
  metodoPago: string
  estado: string
  tiempoRecogida: number
  clienteNombre: string
  clienteCedula: string
  clienteTelefono: string
  clienteCorreo: string
  createdAt: string
  orderItems: OrderItem[]
}

export default function StaffPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"todos" | "pendiente" | "completado">("pendiente")

  useEffect(() => {
    checkAuth()
    fetchOrders()
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (!data.user || data.user.rol !== "admin") {
        router.push("/")
      }
    } catch (error) {
      console.error("[v0] Error verificando autenticación:", error)
      router.push("/")
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.clear()
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("[v0] Error en logout:", error)
      window.location.href = "/login"
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("[v0] Error obteniendo órdenes:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
      })

      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("[v0] Error actualizando orden:", error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") return true
    return order.estado === filter
  })

  const pendingCount = orders.filter((o) => o.estado === "pendiente").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 p-2 rounded-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel del Staff</h1>
                <p className="text-sm text-gray-600">Gestión de Pedidos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {pendingCount > 0 && (
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  {pendingCount} Pendientes
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/admin")}
                className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-bold"
              >
                Volver al Menú
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === "todos" ? "default" : "outline"}
            onClick={() => setFilter("todos")}
            className={filter === "todos" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Todos ({orders.length})
          </Button>
          <Button
            variant={filter === "pendiente" ? "default" : "outline"}
            onClick={() => setFilter("pendiente")}
            className={filter === "pendiente" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Pendientes ({orders.filter((o) => o.estado === "pendiente").length})
          </Button>
          <Button
            variant={filter === "completado" ? "default" : "outline"}
            onClick={() => setFilter("completado")}
            className={filter === "completado" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Completados ({orders.filter((o) => o.estado === "completado").length})
          </Button>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay pedidos {filter !== "todos" ? filter + "s" : ""}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className={order.estado === "pendiente" ? "border-amber-500 border-2" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Pedido #{order.id}
                        {order.estado === "pendiente" ? (
                          <Badge variant="destructive">Pendiente</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-600">
                            Completado
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {new Date(order.createdAt).toLocaleString("es-CO", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${order.total.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        {order.tiempoRecogida} min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Información del Cliente
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Nombre:</span>
                          <span className="ml-2 font-medium">{order.clienteNombre}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cédula:</span>
                          <span className="ml-2 font-medium">{order.clienteCedula}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span className="font-medium">{order.clienteTelefono}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-xs">{order.clienteCorreo}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                          <Badge variant="outline">{order.metodoPago}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Productos
                      </h3>
                      <div className="space-y-2">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <img
                              src={
                                item.product.imagen ||
                                `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(item.product.nombre) || "/placeholder.svg"}`
                              }
                              alt={item.product.nombre}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product.nombre}</p>
                              <p className="text-xs text-gray-600">
                                ${Number(item.precio).toLocaleString()} x {item.cantidad}
                              </p>
                            </div>
                            <div className="font-semibold text-sm">
                              ${(Number(item.precio) * item.cantidad).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.estado === "pendiente" && (
                    <div className="flex gap-3 mt-6 pt-6 border-t">
                      <Button
                        onClick={() => updateOrderStatus(order.id, "completado")}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Completado
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, "cancelado")}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar Pedido
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
