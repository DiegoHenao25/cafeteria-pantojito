"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coffee, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirigir a la página de reset después de 2 segundos
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        }, 2000)
      } else {
        setError(data.error || "Error al enviar código")
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
          <p className="text-gray-600 mt-2">Recupera tu contraseña</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription>Ingresa tu correo electrónico y te enviaremos un código de verificación</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Código enviado exitosamente a <strong>{email}</strong>. Revisa tu bandeja de entrada.
                  </p>
                </div>
                <p className="text-sm text-gray-600 text-center">Redirigiendo...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Mail className="w-4 h-4 mr-2" />
                  {loading ? "Enviando código..." : "Enviar código de verificación"}
                </Button>
              </form>
            )}

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
