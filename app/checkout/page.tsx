"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Clock, CreditCard, Info } from "lucide-react"

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
  const [tiempoRecogida, setTiempoRecogida] = useState("15")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
  })

  const getSubtotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }, [cart])

  const getComision = useCallback(() => {
    return Math.ceil(getSubtotal() * 0.0198)
  }, [getSubtotal])

  const getTotal = useCallback(() => {
    return getSubtotal() + getComision()
  }, [getSubtotal, getComision])

  useEffect(() => {
    checkAuth()
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)
    } else {
      router.push("/menu")
    }
  }, [router])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (data.user) {
        setFormData((prev) => ({
          ...prev,
          correo: data.user.email || "",
          nombre: data.user.nombre?.split(" ")[0] || "",
          apellido: data.user.nombre?.split(" ").slice(1).join(" ") || "",
        }))
      }
    } catch (error) {
      console.error("Error verificando autenticacion:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.apellido || !formData.cedula || !formData.telefono || !formData.correo) {
      alert("Por favor completa todos los campos personales")
      return
    }

    setLoading(true)

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
      }))

      const response = await fetch("/api/create-wompi-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          tiempoRecogida: Number.parseInt(tiempoRecogida),
          clienteInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(`Error: ${data.error || "Error al procesar el pago"}`)
        setLoading(false)
        return
      }

      // Limpiar carrito antes de redirigir
      localStorage.removeItem("cart")

      // Construir URL de checkout de Wompi (redireccion directa)
      const wompiUrl = new URL("https://checkout.wompi.co/p/")
      wompiUrl.searchParams.append("public-key", data.publicKey)
      wompiUrl.searchParams.append("currency", data.currency)
      wompiUrl.searchParams.append("amount-in-cents", data.amountInCents.toString())
      wompiUrl.searchParams.append("reference", data.wompiReference)
      wompiUrl.searchParams.append("redirect-url", data.redirectUrl)
      
      // Datos del cliente
      wompiUrl.searchParams.append("customer-data:email", formData.correo)
      wompiUrl.searchParams.append("customer-data:full-name", `${formData.nombre} ${formData.apellido}`)
      wompiUrl.searchParams.append("customer-data:phone-number", formData.telefono)
      wompiUrl.searchParams.append("customer-data:phone-number-prefix", "57")
      wompiUrl.searchParams.append("customer-data:legal-id", formData.cedula)
      wompiUrl.searchParams.append("customer-data:legal-id-type", "CC")

      // Agregar firma si existe
      if (data.signature) {
        wompiUrl.searchParams.append("signature:integrity", data.signature)
      }

      // Redirigir a Wompi
      window.location.href = wompiUrl.toString()

    } catch (error) {
      console.error("Error en checkout:", error)
      alert(`Error al procesar el pedido: ${error instanceof Error ? error.message : "Error desconocido"}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.back()} className="text-amber-900 hover:bg-pink-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-pink-200" />
              <div>
                <h1 className="text-xl font-bold text-amber-900">Finalizar Pedido</h1>
                <p className="text-sm text-pink-400">Pantojitos - Dulce Tradicion</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-pink-100">
                <CardHeader>
                  <CardTitle className="text-amber-900">Informacion Personal</CardTitle>
                  <CardDescription className="text-amber-700">Completa tus datos para el pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-amber-900">Nombre *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Juan"
                        required
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido" className="text-amber-900">Apellido *</Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        placeholder="Perez"
                        required
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula" className="text-amber-900">Cedula o Documento de Identidad *</Label>
                    <Input
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-amber-900">Numero de Telefono *</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="3001234567"
                        required
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correo" className="text-amber-900">Correo Electronico *</Label>
                      <Input
                        id="correo"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="correo@ejemplo.com"
                        required
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-pink-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Clock className="w-5 h-5 text-pink-400" />
                    Tiempo de Recogida
                  </CardTitle>
                  <CardDescription className="text-amber-700">En cuanto tiempo necesitas tu pedido?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={tiempoRecogida} onValueChange={setTiempoRecogida}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center space-x-2 p-3 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer">
                        <RadioGroupItem value="15" id="15min" />
                        <Label htmlFor="15min" className="cursor-pointer flex-1 text-center font-medium text-amber-900">
                          15 min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer">
                        <RadioGroupItem value="20" id="20min" />
                        <Label htmlFor="20min" className="cursor-pointer flex-1 text-center font-medium text-amber-900">
                          20 min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer">
                        <RadioGroupItem value="30" id="30min" />
                        <Label htmlFor="30min" className="cursor-pointer flex-1 text-center font-medium text-amber-900">
                          30 min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-pink-200 rounded-lg hover:bg-pink-50 cursor-pointer">
                        <RadioGroupItem value="45" id="45min" />
                        <Label htmlFor="45min" className="cursor-pointer flex-1 text-center font-medium text-amber-900">
                          45 min
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-pink-100">
                <CardHeader>
                  <CardTitle className="text-amber-900">Resumen del Pedido</CardTitle>
                  <CardDescription className="text-amber-700">{cart.length} producto(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-pink-50 rounded-lg">
                        <img
                          src={item.imagen || `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(item.nombre)}`}
                          alt={item.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate text-amber-900">{item.nombre}</h4>
                          <p className="text-xs text-amber-700">
                            ${item.precio.toLocaleString()} x {item.cantidad}
                          </p>
                        </div>
                        <div className="font-medium text-sm text-amber-900">${(item.precio * item.cantidad).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-pink-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Subtotal:</span>
                      <span className="font-medium text-amber-900">${getSubtotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-amber-700 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        Comision Wompi (1.98%):
                        <span className="relative group">
                          <Info className="w-3 h-3 text-pink-400 cursor-help" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-amber-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Cargo por procesamiento de pago
                          </span>
                        </span>
                      </span>
                      <span className="font-medium text-pink-500">${getComision().toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Tiempo de recogida:</span>
                      <span className="font-medium text-amber-900">{tiempoRecogida} min</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-bold border-t border-pink-200 pt-2">
                      <span className="text-amber-900">Total a pagar:</span>
                      <span className="text-green-600">${getTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-pink-400 hover:bg-pink-500 text-white mt-6"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? "Redirigiendo a Wompi..." : "Pagar con Wompi"}
                  </Button>

                  <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <p className="text-xs text-pink-600 text-center">
                      <CreditCard className="w-4 h-4 inline-block mr-1" />
                      Paga con Nequi, Bancolombia, PSE, tarjetas de credito/debito y mas
                    </p>
                  </div>

                  <p className="text-xs text-center text-amber-600 mt-3">
                    Pago seguro procesado por Wompi
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
