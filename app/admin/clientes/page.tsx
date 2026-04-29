"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Search, Users, ShoppingBag, DollarSign, RefreshCw, CreditCard, Calendar, Mail, User, Clock, Package } from "lucide-react"

interface Cliente {
  id: number
  nombre: string
  email: string
  fechaRegistro: string
  totalPedidos: number
  pedidosPagados: number
  totalGastado: number
  metodoPagoFavorito: string
  ultimaCompra: string | null
}

interface Estadisticas {
  totalClientes: number
  clientesConCompras: number
  totalVentas: number
  totalPedidos: number
}

interface PedidoDetalle {
  id: number
  total: number
  estado: string
  metodoPago: string
  createdAt: string
  items: {
    nombre: string
    cantidad: number
    precio: number
  }[]
}

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [pedidosCliente, setPedidosCliente] = useState<PedidoDetalle[]>([])
  const [loadingPedidos, setLoadingPedidos] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        loadClientes()
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [loading])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (!data.user || data.user.rol !== "admin") {
          router.push("/login")
          return
        }
        loadClientes()
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const loadClientes = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/clientes")
      if (response.ok) {
        const data = await response.json()
        setClientes(data.clientes)
        setEstadisticas(data.estadisticas)
      }
    } catch (error) {
      console.error("Error cargando clientes:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const loadPedidosCliente = async (clienteId: number) => {
    setLoadingPedidos(true)
    try {
      const response = await fetch(`/api/admin/clientes/${clienteId}/pedidos`)
      if (response.ok) {
        const data = await response.json()
        setPedidosCliente(data.pedidos)
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoadingPedidos(false)
    }
  }

  const handleVerHistorial = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    loadPedidosCliente(cliente.id)
  }

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pendiente: { bg: "bg-[#e9e076]/30", text: "text-[#655642]", label: "Pendiente" },
      pendiente_pago: { bg: "bg-[#e9e076]/50", text: "text-[#655642]", label: "Esperando Pago" },
      pagado: { bg: "bg-[#7BB39C]/20", text: "text-[#7BB39C]", label: "Pagado" },
      en_proceso: { bg: "bg-[#d38488]/20", text: "text-[#d38488]", label: "En Proceso" },
      listo: { bg: "bg-[#7BB39C]/30", text: "text-[#7BB39C]", label: "Listo" },
      entregado: { bg: "bg-[#7BB39C]/40", text: "text-[#7BB39C]", label: "Entregado" },
      completado: { bg: "bg-[#7BB39C]/40", text: "text-[#7BB39C]", label: "Completado" },
      cancelado: { bg: "bg-red-100", text: "text-red-600", label: "Cancelado" },
    }
    const style = badges[estado] || badges.pendiente
    return <Badge className={`${style.bg} ${style.text} border-0`}>{style.label}</Badge>
  }

  const getMetodoPagoColor = (metodo: string) => {
    const colores: Record<string, string> = {
      Nequi: "bg-[#E6007E]/20 text-[#E6007E]",
      PSE: "bg-blue-100 text-blue-700",
      Bancolombia: "bg-yellow-100 text-yellow-700",
      Daviplata: "bg-red-100 text-red-700",
      Tarjeta: "bg-purple-100 text-purple-700",
      Wompi: "bg-indigo-100 text-indigo-700",
      Efectivo: "bg-green-100 text-green-700",
      wompi: "bg-indigo-100 text-indigo-700",
    }
    return colores[metodo] || "bg-gray-100 text-gray-700"
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca"
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#d38488] border-t-[#d38488] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#655642]/80">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d38488]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin")}
                className="text-[#655642]/80 hover:bg-[#d38488]/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Panel
              </Button>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-[#655642]">Historial de Clientes</h1>
                <p className="text-sm text-[#d38488]">Estadisticas de compras</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#d38488] hidden md:block">Auto-actualiza cada 30s</span>
              <Button
                variant="outline"
                onClick={loadClientes}
                disabled={refreshing}
                className="border-[#d38488]/30 text-[#655642]/80 hover:bg-[#d38488]/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Estadisticas generales */}
        {estadisticas && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-[#d38488]/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d38488]/20 rounded-lg">
                    <Users className="w-5 h-5 text-[#d38488]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#655642]/80">Total Clientes</p>
                    <p className="text-2xl font-bold text-[#655642]">{estadisticas.totalClientes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#d38488]/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7BB39C]/20 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-[#7BB39C]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#655642]/80">Con Compras</p>
                    <p className="text-2xl font-bold text-[#7BB39C]">{estadisticas.clientesConCompras}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#d38488]/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#e9e076]/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#e9e076]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#655642]/80">Total Ventas</p>
                    <p className="text-xl font-bold text-[#655642]">{formatCurrency(estadisticas.totalVentas)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#d38488]/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d38488]/20 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-[#d38488]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#655642]/80">Total Pedidos</p>
                    <p className="text-2xl font-bold text-[#d38488]">{estadisticas.totalPedidos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Buscador */}
        <Card className="border-[#d38488]/20 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d38488] w-5 h-5" />
              <Input
                placeholder="Buscar por correo o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#d38488]/30 focus:border-[#d38488]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de clientes */}
        <Card className="border-[#d38488]/20">
          <CardHeader className="border-b border-[#d38488]/20">
            <CardTitle className="text-[#655642] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#d38488]" />
              Clientes Registrados ({filteredClientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredClientes.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-[#d38488]/30 mx-auto mb-4" />
                <p className="text-[#655642]/80">No se encontraron clientes</p>
              </div>
            ) : (
              <div className="divide-y divide-[#d38488]/20">
                {filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="p-4 hover:bg-[#d38488]/10/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Info del cliente */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-[#d38488]" />
                          <span className="font-semibold text-[#655642]">{cliente.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#655642]/80">
                          <Mail className="w-4 h-4 text-[#d38488]" />
                          <span>{cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#655642]/70 mt-1">
                          <Calendar className="w-3 h-3 text-[#d38488]" />
                          <span>Registrado: {formatDate(cliente.fechaRegistro)}</span>
                        </div>
                      </div>

                      {/* Estadisticas del cliente */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        <div className="text-center">
                          <p className="text-xs text-[#655642]/70">Pedidos</p>
                          <p className="font-bold text-[#655642]">{cliente.pedidosPagados}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-[#655642]/70">Gastado</p>
                          <p className="font-bold text-[#7BB39C]">{formatCurrency(cliente.totalGastado)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-[#655642]/70">Metodo favorito</p>
                          <div className="flex items-center justify-center gap-1">
                            <CreditCard className="w-3 h-3 text-[#d38488]" />
                            <p className="font-medium text-[#655642] text-sm">{cliente.metodoPagoFavorito}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-[#655642]/70">Ultima compra</p>
                          <p className="font-medium text-[#655642] text-sm">{formatDate(cliente.ultimaCompra)}</p>
                        </div>
                      </div>

                      {/* Boton ver historial */}
                      {cliente.pedidosPagados > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerHistorial(cliente)}
                          className="border-[#d38488]/30 text-[#d38488] hover:bg-[#d38488]/10 mt-3 md:mt-0"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Ver Historial
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modal de historial de pedidos */}
      <Dialog open={!!selectedCliente} onOpenChange={() => setSelectedCliente(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#655642] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d38488]" />
              Historial de {selectedCliente?.nombre}
            </DialogTitle>
          </DialogHeader>
          
          {loadingPedidos ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-[#d38488]/30 border-t-[#d38488] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#655642]/80">Cargando pedidos...</p>
            </div>
          ) : pedidosCliente.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-[#d38488]/30 mx-auto mb-4" />
              <p className="text-[#655642]/80">No hay pedidos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidosCliente.map((pedido) => (
                <Card key={pedido.id} className="border-[#d38488]/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#655642]">Pedido #{pedido.id}</span>
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      <span className="font-bold text-[#d38488]">{formatCurrency(pedido.total)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#655642]/70 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(pedido.createdAt)}
                      </span>
                      <Badge className={getMetodoPagoColor(pedido.metodoPago)}>
                        {pedido.metodoPago}
                      </Badge>
                    </div>
                    {pedido.items && pedido.items.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-[#655642]/60 mb-2">Productos:</p>
                        <ul className="space-y-1">
                          {pedido.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span className="text-[#655642]">
                                {item.cantidad}x {item.nombre}
                              </span>
                              <span className="text-[#655642]/70">
                                {formatCurrency(item.precio * item.cantidad)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
