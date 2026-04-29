"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
  Package,
  CreditCard,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from "recharts"

interface Estadisticas {
  resumen: {
    pedidosHoy: number
    pedidosSemana: number
    pedidosMes: number
    pedidosTotales: number
    ingresosHoy: number
    ingresosSemana: number
    ingresosMes: number
    ingresosTotales: number
    totalUsuarios: number
    usuariosHoy: number
    pedidosPendientes: number
    pedidosEnProceso: number
  }
  topProductos: {
    id: number
    nombre: string
    imagen: string | null
    cantidad: number
    ingresos: number
  }[]
  topClientes: {
    id: number
    nombre: string
    email: string
    pedidos: number
    totalGastado: number
  }[]
  ventasPorDia: { fecha: string; pedidos: number; ingresos: number }[]
  ventasPorHora: { hora: string; pedidos: number }[]
  distribucionMetodos: { metodo: string; cantidad: number }[]
  ultimaActualizacion: string
}

const COLORES_GRAFICO = ["#d38488", "#e9e076", "#7BB39C", "#655642", "#a8d5ba", "#f4b183"]

export default function EstadisticasPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadStats, 30000) // Actualizar cada 30 segundos
    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadStats = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/estadisticas")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else if (response.status === 401 || response.status === 403) {
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error cargando estadisticas:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return formatCurrency(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff9f0] to-[#ffe4e6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#d38488]/30 border-t-[#d38488] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#655642]">Cargando estadisticas...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff9f0] to-[#ffe4e6] flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-[#655642] mb-4">No se pudieron cargar las estadisticas</p>
          <Button onClick={loadStats} className="bg-[#d38488] hover:bg-[#d38488]/90">
            Reintentar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f0] to-[#ffe4e6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#d38488]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin")}
                className="text-[#655642] hover:bg-[#d38488]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-bold text-[#655642] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#d38488]" />
                  Dashboard de Estadisticas
                </h1>
                <p className="text-sm text-[#655642]/70">
                  Actualizado: {new Date(stats.ultimaActualizacion).toLocaleTimeString("es-CO")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`border-2 ${autoRefresh ? "border-[#7BB39C] text-[#7BB39C]" : "border-[#e9e076] text-[#655642]"}`}
              >
                <Activity className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-pulse" : ""}`} />
                {autoRefresh ? "Auto" : "Manual"}
              </Button>
              <Button
                variant="outline"
                onClick={loadStats}
                disabled={refreshing}
                className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Tarjetas de resumen principal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#d38488]/20 bg-gradient-to-br from-white to-[#d38488]/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/70">Ingresos Hoy</p>
                  <p className="text-2xl font-bold text-[#d38488]">{formatCurrency(stats.resumen.ingresosHoy)}</p>
                  <p className="text-xs text-[#655642]/60">{stats.resumen.pedidosHoy} pedidos</p>
                </div>
                <div className="w-12 h-12 bg-[#d38488]/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#d38488]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e9e076]/30 bg-gradient-to-br from-white to-[#e9e076]/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/70">Esta Semana</p>
                  <p className="text-2xl font-bold text-[#655642]">{formatCurrency(stats.resumen.ingresosSemana)}</p>
                  <p className="text-xs text-[#655642]/60">{stats.resumen.pedidosSemana} pedidos</p>
                </div>
                <div className="w-12 h-12 bg-[#e9e076]/30 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#655642]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7BB39C]/30 bg-gradient-to-br from-white to-[#7BB39C]/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/70">Este Mes</p>
                  <p className="text-2xl font-bold text-[#7BB39C]">{formatCurrency(stats.resumen.ingresosMes)}</p>
                  <p className="text-xs text-[#655642]/60">{stats.resumen.pedidosMes} pedidos</p>
                </div>
                <div className="w-12 h-12 bg-[#7BB39C]/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#7BB39C]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#655642]/20 bg-gradient-to-br from-white to-[#655642]/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/70">Total Historico</p>
                  <p className="text-2xl font-bold text-[#655642]">{formatCurrencyShort(stats.resumen.ingresosTotales)}</p>
                  <p className="text-xs text-[#655642]/60">{stats.resumen.pedidosTotales} pedidos</p>
                </div>
                <div className="w-12 h-12 bg-[#655642]/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#655642]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado actual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#e9e076]/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#e9e076]" />
                <div>
                  <p className="text-2xl font-bold text-[#655642]">{stats.resumen.pedidosPendientes}</p>
                  <p className="text-xs text-[#655642]/70">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-[#d38488]" />
                <div>
                  <p className="text-2xl font-bold text-[#655642]">{stats.resumen.pedidosEnProceso}</p>
                  <p className="text-xs text-[#655642]/70">En Proceso</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#7BB39C]/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#7BB39C]" />
                <div>
                  <p className="text-2xl font-bold text-[#655642]">{stats.resumen.totalUsuarios}</p>
                  <p className="text-xs text-[#655642]/70">Usuarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#d38488]" />
                <div>
                  <p className="text-2xl font-bold text-[#655642]">+{stats.resumen.usuariosHoy}</p>
                  <p className="text-xs text-[#655642]/70">Nuevos Hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graficos principales */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ventas por dia */}
          <Card className="border-[#d38488]/20">
            <CardHeader>
              <CardTitle className="text-[#655642] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#d38488]" />
                Ventas Ultimos 7 Dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={stats.ventasPorDia}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d38488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d38488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fecha" tick={{ fill: "#655642", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#655642", fontSize: 12 }} tickFormatter={(v) => formatCurrencyShort(v)} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                    contentStyle={{ backgroundColor: "white", border: "1px solid #d38488" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#d38488"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIngresos)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pedidos por hora */}
          <Card className="border-[#e9e076]/30">
            <CardHeader>
              <CardTitle className="text-[#655642] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#e9e076]" />
                Pedidos de Hoy por Hora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hora" tick={{ fill: "#655642", fontSize: 10 }} interval={1} />
                  <YAxis tick={{ fill: "#655642", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number) => [value, "Pedidos"]}
                    contentStyle={{ backgroundColor: "white", border: "1px solid #e9e076" }}
                  />
                  <Bar dataKey="pedidos" fill="#e9e076" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top productos y clientes */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top productos */}
          <Card className="border-[#7BB39C]/30 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#655642] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#7BB39C]" />
                Productos Mas Vendidos (30 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topProductos.length === 0 ? (
                <p className="text-center text-[#655642]/70 py-8">No hay datos de productos</p>
              ) : (
                <div className="space-y-4">
                  {stats.topProductos.map((producto, index) => (
                    <div key={producto.id} className="flex items-center gap-4">
                      <span className="text-lg font-bold text-[#d38488] w-6">#{index + 1}</span>
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#d38488]/20 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#d38488]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-[#655642]">{producto.nombre}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-[#7BB39C] h-2 rounded-full"
                            style={{
                              width: `${(producto.cantidad / stats.topProductos[0].cantidad) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#655642]">{producto.cantidad} uds</p>
                        <p className="text-sm text-[#7BB39C]">{formatCurrency(producto.ingresos)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metodos de pago */}
          <Card className="border-[#d38488]/20">
            <CardHeader>
              <CardTitle className="text-[#655642] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#d38488]" />
                Metodos de Pago
              </CardTitle>
              <CardDescription>Distribucion este mes</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.distribucionMetodos.length === 0 ? (
                <p className="text-center text-[#655642]/70 py-8">Sin datos</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.distribucionMetodos}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="cantidad"
                      nameKey="metodo"
                      label={({ metodo, percent }) => `${metodo} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {stats.distribucionMetodos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES_GRAFICO[index % COLORES_GRAFICO.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top clientes */}
        <Card className="border-[#e9e076]/30">
          <CardHeader>
            <CardTitle className="text-[#655642] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#e9e076]" />
              Clientes Mas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topClientes.length === 0 ? (
              <p className="text-center text-[#655642]/70 py-8">No hay datos de clientes</p>
            ) : (
              <div className="grid md:grid-cols-5 gap-4">
                {stats.topClientes.map((cliente, index) => (
                  <Card key={cliente.id} className="border-[#d38488]/10 bg-gradient-to-br from-white to-[#d38488]/5">
                    <CardContent className="pt-4 text-center">
                      <div className="w-12 h-12 bg-[#d38488]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-bold text-[#d38488]">#{index + 1}</span>
                      </div>
                      <p className="font-medium text-[#655642] truncate">{cliente.nombre}</p>
                      <p className="text-xs text-[#655642]/60 truncate">{cliente.email}</p>
                      <div className="mt-3 space-y-1">
                        <Badge className="bg-[#7BB39C]/20 text-[#7BB39C] border-0">
                          {cliente.pedidos} pedidos
                        </Badge>
                        <p className="text-sm font-bold text-[#d38488]">{formatCurrency(cliente.totalGastado)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
