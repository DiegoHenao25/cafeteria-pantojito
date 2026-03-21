"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle, ArrowLeft, PartyPopper } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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
      setError("Las contrasenas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres")
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
        setShowSuccessModal(true)
      } else {
        setError(data.error || "Error al restablecer contrasena")
      }
    } catch (error) {
      setError("Error de conexion")
    } finally {
      setLoading(false)
    }
  }

  const handleGoToLogin = () => {
    setShowSuccessModal(false)
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      {/* Modal de exito */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-pink-200">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="flex items-center gap-2">
              <PartyPopper className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-amber-900">Cambio Exitoso</h2>
              <PartyPopper className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-center text-amber-700">
              Tu contrasena ha sido actualizada correctamente. Ya puedes iniciar sesion con tu nueva contrasena.
            </p>
            <div className="flex justify-center mb-4">
              <img src="/logo.jpeg" alt="Pantojitos Logo" className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-pink-200" />
            </div>
            <Button 
              onClick={handleGoToLogin}
              className="w-full bg-pink-300 hover:bg-pink-400 text-amber-900 font-semibold"
            >
              Ir a Iniciar Sesion
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.jpeg" alt="Pantojitos Logo" className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-pink-200" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900">Pantojitos</h1>
          <p className="text-pink-400 mt-2 font-medium">Dulce Tradicion</p>
          <p className="text-amber-700 mt-1">Restablece tu contrasena</p>
        </div>

        <Card className="shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle className="text-amber-900">Nueva contrasena</CardTitle>
            <CardDescription className="text-amber-700">Ingresa el codigo que recibiste y tu nueva contrasena</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              <div className="bg-pink-50 border border-pink-200 text-pink-700 px-4 py-3 rounded-md text-sm">
                <p>
                  Codigo enviado a: <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-amber-900">Codigo de verificacion</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  required
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-900">Nueva contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="border-pink-200 focus:border-pink-400"
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
                <Label htmlFor="confirmPassword" className="text-amber-900">Confirmar nueva contrasena</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="border-pink-200 focus:border-pink-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-pink-300 hover:bg-pink-400 text-amber-900" disabled={loading || formData.code.length !== 6}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? "Restableciendo..." : "Restablecer contrasena"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-pink-400 hover:text-pink-500 font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesion
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
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
