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
  const [userName, setUserName] = useState("")

  useEffect(() => {
    checkAuth()
    loadOrders()
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (!data.user || data.user.rol !== "admin") {
        router.push("/login")
      } else {
        setUserName(data.user.nombre || "Admin")
      }
    } catch (error) {
      console.error("Error verificando autenticacion:", error)
      router.push("/login")
    }
  }

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("Error cargando ordenes:", error)
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
      console.error("Error actualizando orden:", error)
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.clear()
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Error en logout:", error)
      window.location.href = "/login"
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">Pendiente</Badge>
      case "listo":
        return <Badge className="bg-green-100 text-green-700 border border-green-300">Listo</Badge>
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
          <p className="text-amber-900">Cargando ordenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-pink-200" />
              <div>
                <h1 className="text-xl font-bold text-amber-900">Pantojitos</h1>
                <p className="text-sm text-pink-400">Gestion de Pedidos</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-amber-700">Bienvenido, {userName}</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-900">Gestion de Pedidos</h2>
          <div className="hidden lg:flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetContent side="right" className="w-[280px] bg-white">
            <SheetHeader>
              <SheetTitle className="text-amber-900 flex items-center gap-2">
                <img src="/logo.jpeg" alt="Pantojitos" className="w-8 h-8 rounded-full border-2 border-pink-200" />
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-amber-700 px-2">Bienvenido, {userName}</p>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); router.push("/admin") }}
                className="w-full justify-start border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Panel
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); handleLogout() }}
                className="w-full justify-start border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-amber-900">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">{orders.filter((o) => o.estado === "pendiente").length}</p>
            </CardContent>
          </Card>
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-amber-900">Listos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{orders.filter((o) => o.estado === "listo").length}</p>
            </CardContent>
          </Card>
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-amber-900">Total Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-pink-500">{orders.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-2 border-pink-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-amber-900">Pedido #{order.id}</CardTitle>
                    <p className="text-sm text-amber-700">
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
                    <h3 className="font-semibold mb-2 text-amber-900">Informacion del Cliente</h3>
                    <p className="text-sm text-amber-700">
                      <strong>Nombre:</strong> {order.clienteNombre}
                    </p>
                    <p className="text-sm text-amber-700">
                      <strong>Telefono:</strong> {order.clienteTelefono}
                    </p>
                    <p className="text-sm text-amber-700">
                      <strong>Correo:</strong> {order.clienteCorreo}
                    </p>
                    <p className="text-sm text-amber-700">
                      <strong>Tiempo de recogida:</strong> {order.tiempoRecogida} min
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-amber-900">Productos</h3>
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm mb-1">
                        {item.product.imagen && (
                          <img
                            src={item.product.imagen}
                            alt={item.product.nombre}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="text-amber-700">
                          {item.cantidad}x {item.product.nombre}
                        </span>
                      </div>
                    ))}
                    <p className="text-lg font-bold mt-2 text-pink-500">Total: ${order.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {order.estado === "pendiente" && (
                    <Button onClick={() => updateOrderStatus(order.id, "listo")} className="bg-green-500 hover:bg-green-600 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Listo
                    </Button>
                  )}
                  {order.estado === "listo" && (
                    <Button onClick={() => updateOrderStatus(order.id, "completado")} className="bg-pink-400 hover:bg-pink-500 text-white">
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
            <Card className="border-pink-100">
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-pink-300" />
                <p className="text-amber-700">No hay pedidos aun</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
