"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coffee, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar token y datos del usuario
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        if (data.user.rol === "admin") {
          router.push("/admin")
        } else {
          router.push("/menu")
        }
      } else {
        setError(data.error || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y titulo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.jpeg" alt="Pantojitos Logo" className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-pink-200" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Pantojitos</h1>
          <p className="text-pink-400 mt-2 font-medium">Dulce Tradicion</p>
          <p className="text-amber-700 mt-1">Inicia sesion para continuar</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-pink-400 hover:bg-pink-500 text-white" disabled={loading}>
                {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/forgot-password" 
                className="inline-block px-4 py-2 text-sm text-pink-500 font-medium border-2 border-pink-200 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-all"
              >
                Olvidaste tu contrasena?
              </Link>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block px-4 py-2 border-2 border-amber-200 rounded-full bg-amber-50/50">
                <p className="text-sm text-amber-700">
                  No tienes cuenta?{" "}
                  <Link href="/register" className="text-pink-500 hover:text-pink-600 font-semibold">
                    Registrate aqui
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
