"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Coffee, ArrowLeft, Clock, CreditCard, Info } from "lucide-react"
import Script from "next/script"

interface CartItem {
  productId: number
  nombre: string
  precio: number
  cantidad: number
  imagen: string | null
}

interface PriceBreakdown {
  subtotal: number
  comisionPago: number
  comisionPorcentaje: string
  total: number
}

declare global {
  interface Window {
    WidgetCheckout?: {
      open: (config: WompiConfig) => void
    }
  }
}

interface WompiConfig {
  currency: string
  amountInCents: number
  reference: string
  publicKey: string
  redirectUrl: string
  signature?: { integrity: string }
  customerData?: {
    email: string
    fullName: string
    phoneNumber: string
    phoneNumberPrefix: string
    legalId: string
    legalIdType: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [tiempoRecogida, setTiempoRecogida] = useState("15")
  const [loading, setLoading] = useState(false)
  const [wompiLoaded, setWompiLoaded] = useState(false)
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
  })

  // Calcular subtotal del carrito
  const getSubtotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }, [cart])

  // Calcular comisión Wompi (1.98%)
  const getComision = useCallback(() => {
    return Math.ceil(getSubtotal() * 0.0198)
  }, [getSubtotal])

  // Calcular total
  const getTotal = useCallback(() => {
    return getSubtotal() + getComision()
  }, [getSubtotal, getComision])

  useEffect(() => {
    checkAuth()
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)
      // Calcular breakdown inicial
      const subtotal = parsedCart.reduce((total: number, item: CartItem) => total + item.precio * item.cantidad, 0)
      const comision = Math.ceil(subtotal * 0.0198)
      setPriceBreakdown({
        subtotal,
        comisionPago: comision,
        comisionPorcentaje: "1.98%",
        total: subtotal + comision,
      })
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
      console.error("Error verificando autenticación:", error)
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

    if (!wompiLoaded || !window.WidgetCheckout) {
      alert("El sistema de pagos está cargando, por favor espera un momento")
      return
    }

    setLoading(true)

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
      }))

      // Crear orden y obtener datos de Wompi
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

      // Actualizar breakdown con datos del backend
      setPriceBreakdown(data.breakdown)

      // Configurar y abrir widget de Wompi
      const wompiConfig: WompiConfig = {
        currency: data.currency,
        amountInCents: data.amountInCents,
        reference: data.wompiReference,
        publicKey: data.publicKey,
        redirectUrl: data.redirectUrl,
      }

      // Agregar firma si está disponible
      if (data.signature) {
        wompiConfig.signature = { integrity: data.signature }
      }

      // Agregar datos del cliente
      wompiConfig.customerData = {
        email: formData.correo,
        fullName: `${formData.nombre} ${formData.apellido}`,
        phoneNumber: formData.telefono,
        phoneNumberPrefix: "57",
        legalId: formData.cedula,
        legalIdType: "CC",
      }

      // Limpiar carrito antes de abrir Wompi
      localStorage.removeItem("cart")

      // Abrir widget de Wompi
      window.WidgetCheckout?.open(wompiConfig)
    } catch (error) {
      console.error("Error en checkout:", error)
      alert(`Error al procesar el pedido: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Script de Wompi */}
      <Script
        src="https://checkout.wompi.co/widget.js"
        onLoad={() => setWompiLoaded(true)}
        strategy="lazyOnload"
      />

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
                <p className="text-sm text-gray-600">Cafeteria Pantojito</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle>Informacion Personal</CardTitle>
                  <CardDescription>Completa tus datos para el pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Juan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        placeholder="Perez"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cedula o Documento de Identidad *</Label>
                    <Input
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Numero de Telefono *</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="3001234567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correo">Correo Electronico *</Label>
                      <Input
                        id="correo"
                        name="correo"
                        type="email"
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tiempo de Recogida */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Tiempo de Recogida
                  </CardTitle>
                  <CardDescription>En cuanto tiempo necesitas tu pedido?</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={tiempoRecogida} onValueChange={setTiempoRecogida}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="15" id="15min" />
                        <Label htmlFor="15min" className="cursor-pointer flex-1 text-center font-medium">
                          15 min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="20" id="20min" />
                        <Label htmlFor="20min" className="cursor-pointer flex-1 text-center font-medium">
                          20 min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="30" id="30min" />
                        <Label htmlFor="30min" className="cursor-pointer flex-1 text-center font-medium">
                          30 min
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="45" id="45min" />
                        <Label htmlFor="45min" className="cursor-pointer flex-1 text-center font-medium">
                          45 min
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del Pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                  <CardDescription>{cart.length} producto(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <img
                          src={
                            item.imagen ||
                            `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(item.nombre) || "/placeholder.svg"}`
                          }
                          alt={item.nombre}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.nombre}</h4>
                          <p className="text-xs text-gray-600">
                            ${item.precio.toLocaleString()} x {item.cantidad}
                          </p>
                        </div>
                        <div className="font-medium text-sm">${(item.precio * item.cantidad).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${getSubtotal().toLocaleString()}</span>
                    </div>
                    
                    {/* Comisión Wompi */}
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        Comision Wompi (1.98%):
                        <span className="relative group">
                          <Info className="w-3 h-3 text-gray-400 cursor-help" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Cargo por procesamiento de pago
                          </span>
                        </span>
                      </span>
                      <span className="font-medium text-amber-600">${getComision().toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiempo de recogida:</span>
                      <span className="font-medium">{tiempoRecogida} min</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>Total a pagar:</span>
                      <span className="text-green-600">${getTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 mt-6"
                    disabled={loading || !wompiLoaded}
                    size="lg"
                  >
                    {loading ? "Procesando..." : !wompiLoaded ? "Cargando..." : "Pagar con Wompi"}
                  </Button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 text-center">
                      <CreditCard className="w-4 h-4 inline-block mr-1" />
                      Paga con Nequi, Bancolombia, PSE, tarjetas de credito/debito y mas
                    </p>
                  </div>

                  <p className="text-xs text-center text-gray-500 mt-3">
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
