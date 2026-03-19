"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Coffee } from "lucide-react"

interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.rol !== "admin") {
      router.push("/menu")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cafetería UCP</h1>
                <p className="text-sm text-gray-600">Panel de Administración</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bienvenido, <span className="font-medium">{user.nombre}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
