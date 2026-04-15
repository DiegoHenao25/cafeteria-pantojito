"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "verify">("form")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
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
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("verify")
      } else {
        setError(data.error || "Error al enviar codigo")
      }
    } catch (error) {
      setError("Error de conexion")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          codigo: verificationCode,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setError(verifyData.error || "Codigo invalido")
        setLoading(false)
        return
      }

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
        }),
      })

      const registerData = await registerResponse.json()

      if (registerResponse.ok) {
        localStorage.setItem("user", JSON.stringify(registerData.user))

        if (registerData.user.rol === "admin") {
          router.push("/admin")
        } else {
          router.push("/menu")
        }
      } else {
        setError(registerData.error || "Error al registrar usuario")
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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.jpeg" alt="Pantojitos Logo" className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-[#d38488]/30" />
          </div>
          <h1 className="text-3xl font-bold text-[#655642]">Pantojitos</h1>
          <p className="text-[#d38488] mt-2 font-medium">Dulce Tradicion</p>
          <p className="text-[#655642]/70 mt-1">Crea tu cuenta para comenzar</p>
        </div>

        <Card className="shadow-lg border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642]">{step === "form" ? "Crear Cuenta" : "Verificar Email"}</CardTitle>
            <CardDescription className="text-[#655642]/60">
              {step === "form" ? "Completa tus datos para registrarte" : "Ingresa el codigo que enviamos a tu correo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "form" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-[#655642]">Nombre completo</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="border-[#d38488]/30 focus:border-[#d38488]"
                  />
                </div>

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
                      minLength={6}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#655642]">Confirmar contrasena</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="border-[#d38488]/30 focus:border-[#d38488]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#655642]"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white" disabled={loading}>
                  <Mail className="w-4 h-4 mr-2" />
                  {loading ? "Enviando codigo..." : "Enviar codigo de verificacion"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-[#7BB39C]/20 border border-[#7BB39C]/40 text-[#655642] px-4 py-3 rounded-md text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#7BB39C]" />
                  <p>
                    Hemos enviado un codigo de 6 digitos a <strong>{formData.email}</strong>. Revisa tu bandeja de
                    entrada.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-[#655642]">Codigo de verificacion</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono border-[#d38488]/30 focus:border-[#d38488]"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#7BB39C] hover:bg-[#7BB39C]/90 text-white" disabled={loading || verificationCode.length !== 6}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {loading ? "Verificando..." : "Verificar y crear cuenta"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-[#655642] hover:bg-[#d38488]/10"
                  onClick={() => setStep("form")}
                  disabled={loading}
                >
                  Volver atras
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <div className="inline-block px-4 py-2 border-2 border-[#d38488]/30 rounded-full bg-[#d38488]/10">
                <p className="text-sm text-[#655642]">
                  Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-[#d38488] hover:text-[#d38488]/80 font-semibold">
                    Inicia sesion aqui
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
