"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Coffee, CreditCard, Banknote, Smartphone, ArrowLeft, CheckCircle, Clock } from "lucide-react"

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
  const [tiempoRecogida, setTiempoRecogida] = useState("15")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
  })

  useEffect(() => {
    checkAuth()
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
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
      console.error("[v0] Error verificando autenticación:", error)
    }
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
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

      if (metodoPago === "nequi" || metodoPago === "pse" || metodoPago === "tarjeta") {
        const reference = `ORDER-${Date.now()}`

        // Create order first
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            metodoPago,
            tiempoRecogida: Number.parseInt(tiempoRecogida),
            clienteInfo: formData,
            paymentStatus: "pending",
            reference,
          }),
        })

        if (!orderResponse.ok) {
          alert("Error al crear el pedido. Intenta de nuevo.")
          setLoading(false)
          return
        }

        const order = await orderResponse.json()

        // Create Mercado Pago payment
        const paymentResponse = await fetch("/api/create-mercadopago-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: getTotal(),
            orderId: order.id,
            customerEmail: formData.correo,
            customerName: `${formData.nombre} ${formData.apellido}`,
            customerPhone: formData.telefono,
          }),
        })

        if (!paymentResponse.ok) {
          alert("Error al iniciar el pago. Intenta de nuevo.")
          setLoading(false)
          return
        }

        const paymentData = await paymentResponse.json()

        // Redirect to Mercado Pago checkout
        window.location.href = paymentData.initPoint
        return
      }

      // Cash payment - create order directly
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          metodoPago,
          tiempoRecogida: Number.parseInt(tiempoRecogida),
          clienteInfo: formData,
          paymentStatus: "completed",
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderNumber(order.id)
        setSuccess(true)
        localStorage.removeItem("cart")

        setTimeout(() => {
          router.push("/menu")
        }, 5000)
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado</h2>
            <p className="text-gray-600 mb-2">Tu pedido #{orderNumber} ha sido recibido y está siendo preparado.</p>
            <p className="text-lg font-semibold text-amber-600 mb-4">Tiempo estimado: {tiempoRecogida} minutos</p>
            <p className="text-sm text-gray-500">Serás redirigido al menú en unos segundos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
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
                <p className="text-sm text-gray-600">Cafetería Pantojito</p>
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
                  <CardTitle>Información Personal</CardTitle>
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
                        placeholder="Pérez"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula o Documento de Identidad *</Label>
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
                      <Label htmlFor="telefono">Número de Teléfono *</Label>
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
                      <Label htmlFor="correo">Correo Electrónico *</Label>
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
                  <CardDescription>¿En cuánto tiempo necesitas tu pedido?</CardDescription>
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

              {/* Método de Pago */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                  <CardDescription>Selecciona cómo deseas pagar</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={metodoPago} onValueChange={setMetodoPago}>
                    <div className="space-y-3">
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
                        <RadioGroupItem value="nequi" id="nequi" />
                        <Label htmlFor="nequi" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Smartphone className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Nequi</p>
                            <p className="text-sm text-gray-600">Pago rápido con tu cuenta Nequi</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="pse" id="pse" />
                        <Label htmlFor="pse" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Smartphone className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">PSE</p>
                            <p className="text-sm text-gray-600">Bancolombia, Davivienda, BBVA, etc.</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="tarjeta" id="tarjeta" />
                        <Label htmlFor="tarjeta" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="font-medium">Tarjeta de Crédito/Débito</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>Nota:</strong> Los pagos electrónicos serán procesados de forma segura a través de Mercado
                      Pago. Para efectivo, paga al momento de recoger tu pedido.
                    </p>
                  </div>
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
                      <span className="font-medium">${getTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiempo de recogida:</span>
                      <span className="font-medium">{tiempoRecogida} min</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">${getTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 mt-6"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? "Procesando..." : `Confirmar Pedido`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
