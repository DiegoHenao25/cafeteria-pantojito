"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: string
  createdAt: string
}

export default function PerfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Estados para editar nombre/apellido
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // Estados para cambiar contrasena
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // Estados para cambiar email
  const [newEmail, setNewEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [emailStep, setEmailStep] = useState<"input" | "verify">("input")
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        credentials: "include"
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setNombre(data.user.nombre || "")
        setApellido(data.user.apellido || "")
      }
      // No redirigir automaticamente - dejar que el usuario vea la pagina
      // Si no esta autenticado, simplemente no mostrara sus datos
    } catch {
      // Error de red - no hacer nada, mostrar la pagina sin datos
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMessage(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido }),
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, nombre, apellido } : null)
        setProfileMessage({ type: "success", text: "Perfil actualizado correctamente" })
      } else {
        setProfileMessage({ type: "error", text: data.error || "Error al actualizar" })
      }
    } catch (error) {
      setProfileMessage({ type: "error", text: "Error de conexion" })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Las contrasenas no coinciden" })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "La contrasena debe tener al menos 6 caracteres" })
      return
    }

    setSavingPassword(true)

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordMessage({ type: "success", text: "Contrasena actualizada correctamente" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordMessage({ type: "error", text: data.error || "Error al actualizar" })
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "Error de conexion" })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleRequestEmailCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailMessage(null)

    if (!newEmail || !newEmail.includes("@")) {
      setEmailMessage({ type: "error", text: "Ingresa un correo valido" })
      return
    }

    setSavingEmail(true)

    try {
      const response = await fetch("/api/profile/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmailStep("verify")
        setEmailMessage({ type: "success", text: "Codigo enviado a tu correo actual" })
        if (data.devCode) {
          setDevCode(data.devCode)
        }
      } else {
        setEmailMessage({ type: "error", text: data.error || "Error al enviar codigo" })
      }
    } catch (error) {
      setEmailMessage({ type: "error", text: "Error de conexion" })
    } finally {
      setSavingEmail(false)
    }
  }

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailMessage(null)
    setSavingEmail(true)

    try {
      const response = await fetch("/api/profile/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, email: newEmail } : null)
        setEmailMessage({ type: "success", text: "Correo actualizado correctamente" })
        setNewEmail("")
        setVerificationCode("")
        setEmailStep("input")
        setDevCode(null)
      } else {
        setEmailMessage({ type: "error", text: data.error || "Error al verificar" })
      }
    } catch (error) {
      setEmailMessage({ type: "error", text: "Error de conexion" })
    } finally {
      setSavingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-[#d38488]/30" />
          <p className="text-[#655642]">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#d38488]/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-[#d38488]/30" />
              <div>
                <h1 className="text-xl font-bold text-[#655642]">Pantojitos</h1>
                <p className="text-sm text-[#d38488]">Mi Perfil</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/menu")}
              className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Menu
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-2xl space-y-6">
        {!profile ? (
          <Card className="border-[#d38488]/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-[#e9e076]/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-[#e9e076]" />
              </div>
              <h3 className="text-lg font-semibold text-[#655642] mb-2">No se pudo cargar el perfil</h3>
              <p className="text-[#655642]/70 mb-4">Puede que tu sesion haya expirado</p>
              <Button
                onClick={() => router.push("/login")}
                className="bg-[#d38488] hover:bg-[#d38488]/90 text-white"
              >
                Iniciar Sesion
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Info del usuario */}
            <Card className="border-[#d38488]/20">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 bg-[#d38488]/20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-[#d38488]" />
                </div>
                <CardTitle className="text-[#655642]">
                  {profile.nombre || "Usuario"} {profile.apellido || ""}
                </CardTitle>
                <CardDescription className="text-[#655642]/70">{profile.email}</CardDescription>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  profile.rol === "admin" 
                    ? "bg-[#7BB39C]/20 text-[#7BB39C]" 
                    : "bg-[#d38488]/20 text-[#d38488]"
                }`}>
                  {profile.rol === "admin" ? "Administrador" : "Cliente"}
                </span>
              </CardHeader>
            </Card>

        {/* Editar nombre y apellido */}
        <Card className="border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642] flex items-center gap-2">
              <User className="w-5 h-5 text-[#d38488]" />
              Informacion personal
            </CardTitle>
            <CardDescription className="text-[#655642]/70">
              Actualiza tu nombre y apellido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#655642] mb-1">Nombre</label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#655642] mb-1">Apellido</label>
                  <Input
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Tu apellido"
                    className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20"
                  />
                </div>
              </div>
              
              {profileMessage && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  profileMessage.type === "success" 
                    ? "bg-[#7BB39C]/10 text-[#7BB39C]" 
                    : "bg-red-50 text-red-600"
                }`}>
                  {profileMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm">{profileMessage.text}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={savingProfile}
                className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white"
              >
                {savingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Guardar cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar contrasena */}
        <Card className="border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#d38488]" />
              Cambiar contrasena
            </CardTitle>
            <CardDescription className="text-[#655642]/70">
              Actualiza tu contrasena de acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-[#655642]">Contrasena actual</label>
                  <Link href="/forgot-password" className="text-xs text-[#d38488] hover:underline">
                    Olvide mi contrasena
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Tu contrasena actual"
                    className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#655642]/50 hover:text-[#655642]"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#655642] mb-1">Nueva contrasena</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#655642]/50 hover:text-[#655642]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#655642] mb-1">Confirmar nueva contrasena</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contrasena"
                  className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20"
                />
              </div>

              {passwordMessage && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  passwordMessage.type === "success" 
                    ? "bg-[#7BB39C]/10 text-[#7BB39C]" 
                    : "bg-red-50 text-red-600"
                }`}>
                  {passwordMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm">{passwordMessage.text}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white"
              >
                {savingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Cambiar contrasena
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar email */}
        <Card className="border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#d38488]" />
              Cambiar correo electronico
            </CardTitle>
            <CardDescription className="text-[#655642]/70">
              Se enviara un codigo de verificacion a tu correo actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailStep === "input" ? (
              <form onSubmit={handleRequestEmailCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#655642] mb-1">Correo actual</label>
                  <Input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="border-[#d38488]/30 bg-[#fdf6f6] text-[#655642]/70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#655642] mb-1">Nuevo correo</label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nuevo@correo.com"
                    className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20"
                  />
                </div>

                {emailMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    emailMessage.type === "success" 
                      ? "bg-[#7BB39C]/10 text-[#7BB39C]" 
                      : "bg-red-50 text-red-600"
                  }`}>
                    {emailMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="text-sm">{emailMessage.text}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={savingEmail || !newEmail}
                  className="w-full bg-[#d38488] hover:bg-[#d38488]/90 text-white"
                >
                  {savingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Enviar codigo de verificacion
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailCode} className="space-y-4">
                <div className="text-center p-4 bg-[#e9e076]/20 rounded-lg border border-[#e9e076]">
                  <p className="text-[#655642] text-sm">
                    Hemos enviado un codigo de 6 digitos a <strong>{profile?.email}</strong>
                  </p>
                  {devCode && (
                    <p className="mt-2 text-xs text-[#655642]/70">
                      (Modo desarrollo - Codigo: <strong className="text-[#d38488]">{devCode}</strong>)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#655642] mb-1">Codigo de verificacion</label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="border-[#d38488]/30 focus:border-[#d38488] focus:ring-[#d38488]/20 text-center text-2xl tracking-widest"
                  />
                </div>

                {emailMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    emailMessage.type === "success" 
                      ? "bg-[#7BB39C]/10 text-[#7BB39C]" 
                      : "bg-red-50 text-red-600"
                  }`}>
                    {emailMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="text-sm">{emailMessage.text}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => { setEmailStep("input"); setEmailMessage(null); setDevCode(null); }}
                    className="flex-1 border-[#d38488]/30 text-[#655642] hover:bg-[#d38488]/10"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={savingEmail || verificationCode.length !== 6}
                    className="flex-1 bg-[#d38488] hover:bg-[#d38488]/90 text-white"
                  >
                    {savingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Verificar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  )
}
