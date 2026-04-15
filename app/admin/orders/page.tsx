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
        return <Badge className="bg-[#e9e076]/30 text-[#655642] border border-[#e9e076]">Pendiente</Badge>
      case "en_proceso":
        return <Badge className="bg-[#d38BB6]/20 text-[#d38BB6] border border-[#d38BB6]">En Proceso</Badge>
      case "listo":
        return <Badge className="bg-[#7BB39C]/20 text-[#7BB39C] border border-[#7BB39C]">Listo</Badge>
      case "entregado":
        return <Badge className="bg-[#655642]/20 text-[#655642] border border-[#655642]">Entregado</Badge>
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-[#d38488]/30" />
          <p className="text-[#655642]">Cargando ordenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#d38488]/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-[#d38488]/30" />
              <div>
                <h1 className="text-xl font-bold text-[#655642]">Pantojitos</h1>
                <p className="text-sm text-[#d38488]">Gestion de Pedidos</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[#655642]/80">Bienvenido, {userName}</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#655642]">Gestion de Pedidos</h2>
          <div className="hidden lg:flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
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
              <SheetTitle className="text-[#655642] flex items-center gap-2">
                <img src="/logo.jpeg" alt="Pantojitos" className="w-8 h-8 rounded-full border-2 border-[#d38488]/30" />
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-[#655642]/80 px-2">Bienvenido, {userName}</p>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); router.push("/admin") }}
                className="w-full justify-start border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Panel
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); handleLogout() }}
                className="w-full justify-start border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="border-[#e9e076]/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#655642]">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#e9e076]">{orders.filter((o) => o.estado === "pendiente").length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#d38BB6]/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#655642]">En Proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#d38BB6]">{orders.filter((o) => o.estado === "en_proceso").length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#7BB39C]/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#655642]">Listos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#7BB39C]">{orders.filter((o) => o.estado === "listo").length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#655642]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#655642]">Entregados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#655642]">{orders.filter((o) => o.estado === "entregado").length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#655642]">Total Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#d38488]">{orders.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-2 border-[#d38488]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#655642]">Pedido #{order.id}</CardTitle>
                    <p className="text-sm text-[#655642]/80">
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
                    <h3 className="font-semibold mb-2 text-[#655642]">Informacion del Cliente</h3>
                    <p className="text-sm text-[#655642]/80">
                      <strong>Nombre:</strong> {order.clienteNombre}
                    </p>
                    <p className="text-sm text-[#655642]/80">
                      <strong>Telefono:</strong> {order.clienteTelefono}
                    </p>
                    <p className="text-sm text-[#655642]/80">
                      <strong>Correo:</strong> {order.clienteCorreo}
                    </p>
                    <p className="text-sm text-[#655642]/80">
                      <strong>Tiempo de recogida:</strong> {order.tiempoRecogida} min
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-[#655642]">Productos</h3>
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm mb-1">
                        {item.product.imagen && (
                          <img
                            src={item.product.imagen}
                            alt={item.product.nombre}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="text-[#655642]/80">
                          {item.cantidad}x {item.product.nombre}
                        </span>
                      </div>
                    ))}
                    <p className="text-lg font-bold mt-2 text-[#d38488]">Total: ${order.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                  {/* Indicador de progreso */}
                  <div className="flex items-center gap-1 mr-4">
                    <div className={`w-3 h-3 rounded-full ${order.estado === "pendiente" || order.estado === "en_proceso" || order.estado === "listo" || order.estado === "entregado" ? "bg-[#e9e076]" : "bg-gray-300"}`} />
                    <div className={`w-8 h-1 ${order.estado === "en_proceso" || order.estado === "listo" || order.estado === "entregado" ? "bg-[#d38BB6]" : "bg-gray-300"}`} />
                    <div className={`w-3 h-3 rounded-full ${order.estado === "en_proceso" || order.estado === "listo" || order.estado === "entregado" ? "bg-[#d38BB6]" : "bg-gray-300"}`} />
                    <div className={`w-8 h-1 ${order.estado === "listo" || order.estado === "entregado" ? "bg-[#7BB39C]" : "bg-gray-300"}`} />
                    <div className={`w-3 h-3 rounded-full ${order.estado === "listo" || order.estado === "entregado" ? "bg-[#7BB39C]" : "bg-gray-300"}`} />
                    <div className={`w-8 h-1 ${order.estado === "entregado" ? "bg-[#655642]" : "bg-gray-300"}`} />
                    <div className={`w-3 h-3 rounded-full ${order.estado === "entregado" ? "bg-[#655642]" : "bg-gray-300"}`} />
                  </div>

                  {/* Botones de accion */}
                  {order.estado === "pendiente" && (
                    <Button onClick={() => updateOrderStatus(order.id, "en_proceso")} className="bg-[#d38BB6] hover:bg-[#d38BB6]/80 text-white">
                      <Clock className="w-4 h-4 mr-2" />
                      En Proceso
                    </Button>
                  )}
                  {order.estado === "en_proceso" && (
                    <Button onClick={() => updateOrderStatus(order.id, "listo")} className="bg-[#7BB39C] hover:bg-[#7BB39C]/80 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar Listo
                    </Button>
                  )}
                  {order.estado === "listo" && (
                    <Button onClick={() => updateOrderStatus(order.id, "entregado")} className="bg-[#655642] hover:bg-[#655642]/80 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Entregado
                    </Button>
                  )}
                  {order.estado === "entregado" && (
                    <span className="text-[#7BB39C] font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Pedido Completado
                    </span>
                  )}
                  {(order.estado === "pendiente" || order.estado === "en_proceso" || order.estado === "listo") && (
                    <Button onClick={() => updateOrderStatus(order.id, "cancelado")} variant="destructive" size="sm">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card className="border-[#d38488]/20">
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-[#d38488]" />
                <p className="text-[#655642]/80">No hay pedidos aun</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
