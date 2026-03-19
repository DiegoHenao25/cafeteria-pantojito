"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coffee, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          codigo: formData.code,
          newPassword: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Mostrar mensaje de éxito y redirigir al login
        alert("Contraseña actualizada exitosamente")
        router.push("/login")
      } else {
        setError(data.error || "Error al restablecer contraseña")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-600 p-3 rounded-full">
              <Coffee className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Cafetería UCP</h1>
          <p className="text-gray-600 mt-2">Restablece tu contraseña</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Nueva contraseña</CardTitle>
            <CardDescription>Ingresa el código que recibiste y tu nueva contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
                <p>
                  Código enviado a: <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código de verificación</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || formData.code.length !== 6}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? "Restableciendo..." : "Restablecer contraseña"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
