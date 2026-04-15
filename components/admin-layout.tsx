"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  nombre: string
  email: string
  rol: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d38488] border-t-[#d38488] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#655642]/80">Cargando...</p>
        </div>
      </div>
    )
  }

  // Solo retorna los children, el header ya esta en cada pagina de admin
  return <>{children}</>
}
