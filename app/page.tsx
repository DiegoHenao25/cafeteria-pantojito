"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Users, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario ya está logueado
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cafetería UCP</h1>
                <p className="text-sm text-gray-600">Universidad Católica Luis Amigó</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-600 p-4 rounded-full">
              <Coffee className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Bienvenido a la
            <span className="text-amber-600 block">Cafetería UCP</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Disfruta de los mejores cafés, snacks y comidas en el campus. Ordena en línea y recoge en nuestra cafetería.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Comenzar a Ordenar
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-amber-600" />
              </div>
              <CardTitle>Ordena Fácil</CardTitle>
              <CardDescription>Navega nuestro menú y ordena desde tu dispositivo</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Coffee className="w-12 h-12 text-amber-600" />
              </div>
              <CardTitle>Productos Frescos</CardTitle>
              <CardDescription>Café recién preparado y alimentos frescos todos los días</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-amber-600" />
              </div>
              <CardTitle>Para la Comunidad UCP</CardTitle>
              <CardDescription>Diseñado especialmente para estudiantes, profesores y personal</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-amber-600 text-white text-center">
          <CardContent className="p-8">
            <Star className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">¿Listo para empezar?</h3>
            <p className="text-amber-100 mb-6">
              Únete a la comunidad UCP y disfruta de la mejor experiencia gastronómica en el campus.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-amber-600">
                Crear mi cuenta gratis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coffee className="w-6 h-6 text-amber-600" />
            <span className="font-semibold text-gray-900">Cafetería UCP</span>
          </div>
          <p className="text-gray-600">© 2025 Universidad Católica Luis Amigó. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
