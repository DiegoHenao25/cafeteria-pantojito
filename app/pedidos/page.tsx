"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Coffee } from "lucide-react"
import { useRouter } from "next/navigation"

interface Pedido {
  id: number
  total: number
  estado: string
  created_at: string
  detalles: Array<{
    producto_nombre: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }>
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/pedidos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPedidos(data)
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "preparando":
        return "bg-blue-100 text-blue-800"
      case "listo":
        return "bg-green-100 text-green-800"
      case "entregado":
        return "bg-gray-100 text-gray-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando pedidos...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mis Pedidos</h1>
                <p className="text-sm text-gray-600">Historial de pedidos</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No tienes pedidos aún.</p>
              <Button onClick={() => router.push("/menu")}>Ver Menú</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Pedido #{pedido.id}</CardTitle>
                      <CardDescription>{new Date(pedido.created_at).toLocaleString()}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getEstadoColor(pedido.estado)}>{pedido.estado.toUpperCase()}</Badge>
                      <p className="text-xl font-bold mt-1">${pedido.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Productos:</h4>
                    {pedido.detalles.map((detalle, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <span className="font-medium">{detalle.producto_nombre}</span>
                          <span className="text-gray-500 ml-2">x{detalle.cantidad}</span>
                        </div>
                        <span className="font-medium">${detalle.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
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
