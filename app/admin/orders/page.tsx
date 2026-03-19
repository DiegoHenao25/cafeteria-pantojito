"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, ArrowLeft, LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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

export default function OrdersManagement() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    checkAuth()
    loadOrders()
    // Actualizar cada 10 segundos
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (!data.user || data.user.rol !== "admin") {
        router.push("/login")
      }
    } catch (error) {
      console.error("[v0] Error verificando autenticación:", error)
      router.push("/login")
    }
  }

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("[v0] Error cargando órdenes:", error)
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
        await loadOrders()
      }
    } catch (error) {
      console.error("[v0] Error actualizando orden:", error)
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

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "listo":
        return <Badge className="bg-green-500">Listo</Badge>
      case "completado":
        return <Badge className="bg-blue-500">Completado</Badge>
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando órdenes...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="hidden lg:flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowMobileMenu(true)}
          className="lg:hidden border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="right" className="w-[280px] bg-white">
          <SheetHeader>
            <SheetTitle className="text-amber-900">Menú</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                router.push("/admin")
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                handleLogout()
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter((o) => o.estado === "pendiente").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Listos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.filter((o) => o.estado === "listo").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pedido #{order.id}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("es-CO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                {getStatusBadge(order.estado)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Información del Cliente</h3>
                  <p className="text-sm">
                    <strong>Nombre:</strong> {order.clienteNombre}
                  </p>
                  <p className="text-sm">
                    <strong>Teléfono:</strong> {order.clienteTelefono}
                  </p>
                  <p className="text-sm">
                    <strong>Correo:</strong> {order.clienteCorreo}
                  </p>
                  <p className="text-sm">
                    <strong>Tiempo de recogida:</strong> {order.tiempoRecogida} min
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Productos</h3>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm mb-1">
                      {item.product.imagen && (
                        <img
                          src={item.product.imagen || "/placeholder.svg"}
                          alt={item.product.nombre}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span>
                        {item.cantidad}x {item.product.nombre}
                      </span>
                    </div>
                  ))}
                  <p className="text-lg font-bold mt-2">Total: ${order.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {order.estado === "pendiente" && (
                  <Button onClick={() => updateOrderStatus(order.id, "listo")} className="bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Listo
                  </Button>
                )}
                {order.estado === "listo" && (
                  <Button onClick={() => updateOrderStatus(order.id, "completado")} className="bg-blue-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Completado
                  </Button>
                )}
                {(order.estado === "pendiente" || order.estado === "listo") && (
                  <Button onClick={() => updateOrderStatus(order.id, "cancelado")} variant="destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No hay pedidos aún</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
