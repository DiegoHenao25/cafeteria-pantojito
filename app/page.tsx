"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario ya esta logueado
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      const userData = JSON.parse(user)
      if (userData.rol === "admin") {
        router.push("/admin")
      } else {
        router.push("/menu")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-pink-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos Logo" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h1 className="text-xl font-bold text-amber-900">Pantojitos</h1>
                <p className="text-sm text-pink-400">Dulce Tradicion</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline" className="border-amber-800 text-amber-900 hover:bg-amber-50">
                  Iniciar Sesion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-pink-300 hover:bg-pink-400 text-amber-900">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/logo.jpeg" 
              alt="Pantojitos Logo" 
              className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-pink-200" 
            />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
            Bienvenido a
            <span className="text-pink-400 block">Pantojitos</span>
          </h2>
          <p className="text-xl text-amber-700 mb-10 max-w-2xl mx-auto">
            Dulce Tradicion! Disfruta de los mejores productos frescos en el campus. Ordena en linea y recoge en nuestra cafeteria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 bg-pink-300 hover:bg-pink-400 text-amber-900">
                Comenzar a Ordenar
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 border-amber-800 text-amber-900 hover:bg-amber-50">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
