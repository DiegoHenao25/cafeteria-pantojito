"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Coffee, CreditCard, Banknote, Smartphone, ArrowLeft, CheckCircle } from "lucide-react"

interface CartItem {
  productId: number
  nombre: string
  precio: number
  cantidad: number
  imagen: string | null
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [metodoPago, setMetodoPago] = useState("efectivo")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      router.push("/menu")
    }
  }, [router])

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          metodoPago,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderNumber(order.id)
        setSuccess(true)
        localStorage.removeItem("cart")

        // Redirigir después de 3 segundos
        setTimeout(() => {
          router.push("/menu")
        }, 3000)
      } else {
        const error = await response.json()
        alert(error.error || "Error al procesar el pedido")
      }
    } catch (error) {
      console.error("[v0] Error en checkout:", error)
      alert("Error al procesar el pedido")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h2>
            <p className="text-gray-600 mb-4">Tu pedido #{orderNumber} ha sido recibido y está siendo preparado.</p>
            <p className="text-sm text-gray-500">Serás redirigido al menú en unos segundos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 p-2 rounded-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Finalizar Pedido</h1>
                <p className="text-sm text-gray-600">Cafetería UCP</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Resumen del Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
              <CardDescription>Revisa los productos de tu pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={
                        item.imagen || `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(item.nombre)}`
                      }
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.precio.toLocaleString()} x {item.cantidad}
                      </p>
                    </div>
                    <div className="font-medium">${(item.precio * item.cantidad).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
              <CardDescription>Selecciona cómo deseas pagar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup value={metodoPago} onValueChange={setMetodoPago}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="efectivo" id="efectivo" />
                    <Label htmlFor="efectivo" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Efectivo</p>
                        <p className="text-sm text-gray-600">Paga al recoger tu pedido</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <Label htmlFor="tarjeta" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Tarjeta</p>
                        <p className="text-sm text-gray-600">Débito o crédito</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <Label htmlFor="transferencia" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Transferencia</p>
                        <p className="text-sm text-gray-600">Nequi, Daviplata, etc.</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Nota:</strong> Este es un sistema de pago simulado. Tu pedido será registrado y podrás
                    recogerlo en la cafetería.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading} size="lg">
                  {loading ? "Procesando..." : `Confirmar Pedido - $${getTotal().toLocaleString()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
