"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Search, Users, Shield, ShieldCheck, RefreshCw, Mail, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Usuario {
  id: number
  email: string
  nombre: string
  rol: string
  createdAt: string
}

const SUPER_ADMIN_EMAIL = "diegohenao.cortes@gmail.com"

export default function AdminUsuariosPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [updating, setUpdating] = useState<number | null>(null)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuthorization()
  }, [])

  const checkAuthorization = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        
        if (!data.user) {
          router.push("/login")
          return
        }
        
        setCurrentUserEmail(data.user.email)
        
        if (data.user.email === SUPER_ADMIN_EMAIL) {
          setAuthorized(true)
          loadUsuarios()
        } else {
          router.push("/admin")
        }
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminRole = async (userId: number, currentRol: string) => {
    setUpdating(userId)
    try {
      const newRol = currentRol === "admin" ? "cliente" : "admin"
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rol: newRol }),
      })

      if (response.ok) {
        setUsuarios(usuarios.map(u => 
          u.id === userId ? { ...u, rol: newRol } : u
        ))
      } else {
        alert("Error al actualizar el rol")
      }
    } catch (error) {
      console.error("Error actualizando rol:", error)
      alert("Error de conexion")
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsuarios = usuarios.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const adminCount = usuarios.filter(u => u.rol === "admin").length
  const clienteCount = usuarios.filter(u => u.rol === "cliente").length

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d38488]/30 border-t-[#d38488] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#655642]/80">Verificando autorizacion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#d38488]/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="text-[#655642]/80 hover:bg-[#d38488]/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Image
                src="/logo.jpeg"
                alt="Pantojitos"
                width={40}
                height={40}
                className="rounded-full border-2 border-[#d38488]/30"
              />
              <div>
                <h1 className="text-xl font-bold text-[#655642]">Gestion de Usuarios</h1>
                <p className="text-sm text-[#d38488]">Super Administrador</p>
              </div>
            </div>
            <Badge className="bg-[#d38488]/20 text-[#d38488] border-[#d38488]/30">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Super Admin
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-[#d38488]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/80">Total Usuarios</p>
                  <p className="text-3xl font-bold text-[#d38488]">{usuarios.length}</p>
                </div>
                <Users className="w-10 h-10 text-[#d38488]/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/80">Administradores</p>
                  <p className="text-3xl font-bold text-[#7BB39C]">{adminCount}</p>
                </div>
                <ShieldCheck className="w-10 h-10 text-[#7BB39C]/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#655642]/80">Clientes</p>
                  <p className="text-3xl font-bold text-[#e9e076]">{clienteCount}</p>
                </div>
                <User className="w-10 h-10 text-[#e9e076]/70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Refresh */}
        <Card className="border-[#d38488]/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d38488]/50" />
                <Input
                  placeholder="Buscar por correo o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#d38488]/30 focus:border-[#d38488]"
                />
              </div>
              <Button
                onClick={loadUsuarios}
                variant="outline"
                className="border-[#d38488]/30 text-[#d38488] hover:bg-[#d38488]/10"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-[#d38488]/20">
          <CardHeader>
            <CardTitle className="text-[#655642]">Usuarios Registrados</CardTitle>
            <CardDescription className="text-[#655642]/80">
              Activa o desactiva el rol de administrador para cada usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-[#d38488]/30 border-t-[#d38488] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#655642]/80">Cargando usuarios...</p>
              </div>
            ) : filteredUsuarios.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-[#d38488]/30 mx-auto mb-4" />
                <p className="text-[#655642]/80">No se encontraron usuarios</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      usuario.rol === "admin" 
                        ? "bg-[#7BB39C]/10 border-[#7BB39C]/30" 
                        : "bg-white border-[#d38488]/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        usuario.rol === "admin" ? "bg-[#7BB39C]/20" : "bg-[#d38488]/20"
                      }`}>
                        {usuario.rol === "admin" ? (
                          <ShieldCheck className="w-6 h-6 text-[#7BB39C]" />
                        ) : (
                          <User className="w-6 h-6 text-[#d38488]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#655642]">{usuario.nombre}</p>
                        <div className="flex items-center gap-2 text-sm text-[#655642]/70">
                          <Mail className="w-4 h-4" />
                          {usuario.email}
                        </div>
                        <p className="text-xs text-[#e9e076] mt-1">
                          Registrado: {new Date(usuario.createdAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={
                        usuario.rol === "admin" 
                          ? "bg-[#7BB39C]/20 text-[#7BB39C] border-[#7BB39C]/30" 
                          : "bg-[#e9e076]/30 text-[#655642]/70 border-[#e9e076]/50"
                      }>
                        {usuario.rol === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                      {usuario.email !== SUPER_ADMIN_EMAIL && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#655642]/80">Admin</span>
                          <Switch
                            checked={usuario.rol === "admin"}
                            onCheckedChange={() => toggleAdminRole(usuario.id, usuario.rol)}
                            disabled={updating === usuario.id}
                            className="data-[state=checked]:bg-[#7BB39C]"
                          />
                        </div>
                      )}
                      {usuario.email === SUPER_ADMIN_EMAIL && (
                        <Badge className="bg-[#d38488]/20 text-[#d38488] border-[#d38488]/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Super Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
