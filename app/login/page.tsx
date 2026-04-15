"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
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
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        if (data.user.rol === "admin") {
          router.push("/admin")
        } else {
          router.push("/menu")
        }
      } else {
        setError(data.error || "Error al iniciar sesion")
      }
    } catch (error) {
      setError("Error de conexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y titulo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.jpeg" alt="Pantojitos Logo" className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-[#d38488]/30" />
          </div>
          <h1 className="text-3xl font-bold text-[#655642]">Pantojitos</h1>
          <p className="text-[#d38488] mt-2 font-medium">Dulce Tradicion</p>
          <p className="text-[#655642]/70 mt-1">Inicia sesion para continuar</p>
        </div>

        <Card className="shadow-lg border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642]">Iniciar Sesion</CardTitle>
            <CardDescription className="text-[#655642]/60">Ingresa tus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#655642]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-[#d38488]/30 focus:border-[#d38488]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#655642]">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="border-[#d38488]/30 focus:border-[#d38488]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#655642]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white" disabled={loading}>
                {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/forgot-password" 
                className="inline-block px-4 py-2 text-sm text-[#d38488] font-medium border-2 border-[#d38488]/30 rounded-full hover:bg-[#d38488]/10 hover:border-[#d38488] transition-all"
              >
                Olvidaste tu contrasena?
              </Link>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block px-4 py-2 border-2 border-[#7BB39C]/30 rounded-full bg-[#7BB39C]/10">
                <p className="text-sm text-[#655642]">
                  No tienes cuenta?{" "}
                  <Link href="/register" className="text-[#d38488] hover:text-[#d38488]/80 font-semibold">
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
