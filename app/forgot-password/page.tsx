"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
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
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        }, 2000)
      } else {
        setError(data.error || "Error al enviar codigo")
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
          <p className="text-[#655642]/80 mt-1">Recupera tu contrasena</p>
        </div>

        <Card className="shadow-lg border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642]">Olvidaste tu contrasena?</CardTitle>
            <CardDescription className="text-[#655642]/80">Ingresa tu correo electronico y te enviaremos un codigo de verificacion</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-[#7BB39C]/10 border border-[#7BB39C]/30 text-[#7BB39C] px-4 py-3 rounded-md text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Codigo enviado exitosamente a <strong>{email}</strong>. Revisa tu bandeja de entrada.
                  </p>
                </div>
                <p className="text-sm text-[#655642]/80 text-center">Redirigiendo...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#655642]">Correo electronico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#d38488]/30 focus:border-[#d38488]"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#d38488] hover:bg-[#d38488] text-[#655642]" disabled={loading}>
                  <Mail className="w-4 h-4 mr-2" />
                  {loading ? "Enviando codigo..." : "Enviar codigo de verificacion"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-[#d38488] hover:text-[#d38488] font-medium inline-flex items-center gap-1"
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
