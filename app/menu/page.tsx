"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Coffee, LogOut, User, Settings, FileText, Menu, Search } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

interface Category {
  id: number
  nombre: string
}

interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  imagen: string | null
  disponible: boolean
  categoryId: number
  category: Category
}

interface CartItem {
  product: Product
  cantidad: number
}

export default function MenuPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkAuth()
    loadData()
  }, [])

  useEffect(() => {
    if (products.length > 0 && mounted) {
      loadCartFromStorage()
    }
  }, [products, mounted])

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const cartData = JSON.parse(savedCart)
        const validCartItems: CartItem[] = []

        for (const item of cartData) {
          const product = products.find((p) => p.id === item.productId)
          if (product && product.disponible) {
            validCartItems.push({
              product: product,
              cantidad: item.cantidad || 1,
            })
          }
        }

        setCart(validCartItems)
        if (validCartItems.length !== cartData.length) {
          saveCartToStorage(validCartItems)
        }
      }
    } catch (error) {
      console.error("[v0] Error loading cart:", error)
      localStorage.removeItem("cart")
    }
  }

  const saveCartToStorage = (cartItems: CartItem[]) => {
    const cartData = cartItems.map((item) => ({
      productId: item.product.id,
      nombre: item.product.nombre,
      precio: Number(item.product.precio),
      cantidad: item.cantidad,
      imagen: item.product.imagen,
    }))
    localStorage.setItem("cart", JSON.stringify(cartData))
  }

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (!data.user) {
        router.push("/login")
      } else {
        setUser(data.user)
      }
    } catch (error) {
      console.error("[v0] Error verificando autenticación:", error)
      router.push("/login")
    }
  }

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData.filter((p: Product) => p.disponible))
      setCategories(categoriesData)
    } catch (error) {
      console.error("[v0] Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      let newCart
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.product.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      } else {
        newCart = [...prevCart, { product, cantidad: 1 }]
      }
      saveCartToStorage(newCart)
      return newCart
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === productId)
      let newCart
      if (existingItem && existingItem.cantidad > 1) {
        newCart = prevCart.map((item) =>
          item.product.id === productId ? { ...item, cantidad: item.cantidad - 1 } : item,
        )
      } else {
        newCart = prevCart.filter((item) => item.product.id !== productId)
      }
      saveCartToStorage(newCart)
      return newCart
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + Number(item.product.precio) * item.cantidad, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0)
  }

  const handleLogout = async () => {
    try {
      localStorage.clear()
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("[v0] Error en logout:", error)
      window.location.href = "/login"
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true
    const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading || !mounted) {
    return <div className="flex items-center justify-center min-h-screen">Cargando menú...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden bg-amber-600 p-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div className="bg-amber-600 p-2 rounded-lg hidden lg:block">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cafetería Pantojito</h1>
                <p className="text-sm text-gray-600">Menú</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.nombre}</span>
                  {user.rol === "admin" && <Badge className="bg-purple-600 text-white">Admin</Badge>}
                </div>
              )}
              {user?.rol === "admin" && (
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Panel Admin
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/pedidos")}
                className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
              >
                <FileText className="w-4 h-4 mr-2" />
                Mis Pedidos
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCart(true)}
                className="relative border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-amber-600">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCart(true)}
              className="lg:hidden relative border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <ShoppingCart className="w-4 h-4" />
              {getCartItemCount() > 0 && <Badge className="ml-auto bg-amber-600">{getCartItemCount()}</Badge>}
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="left" className="w-[280px] bg-white">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-amber-900">
              <Coffee className="w-5 h-5" />
              Menú
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {user && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <User className="w-5 h-5 text-amber-900" />
                <div>
                  <p className="font-semibold text-amber-900">{user.nombre}</p>
                  {user.rol === "admin" && <Badge className="bg-purple-600 text-white text-xs">Admin</Badge>}
                </div>
              </div>
            )}
            {user?.rol === "admin" && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowMobileMenu(false)
                  router.push("/admin")
                }}
                className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
              >
                <Settings className="w-4 h-4 mr-2" />
                Panel Admin
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                router.push("/pedidos")
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <FileText className="w-4 h-4 mr-2" />
              Mis Pedidos
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                setShowCart(true)
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrito
              {getCartItemCount() > 0 && <Badge className="ml-auto bg-amber-600">{getCartItemCount()}</Badge>}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                handleLogout()
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuestro Menú</h2>
          <p className="text-gray-600">Descubre nuestros deliciosos productos frescos</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar productos... (ej: limón)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-amber-200 focus:border-amber-500 rounded-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.nombre}
              </Button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {searchQuery
                  ? `No se encontraron productos con "${searchQuery}"`
                  : "No hay productos disponibles en este momento."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative w-full h-32 overflow-hidden rounded-t-lg">
                    <img
                      src={
                        product.imagen ||
                        `/placeholder.svg?height=128&width=200&query=${encodeURIComponent(product.nombre) || "/placeholder.svg"}`
                      }
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=128&width=200&query=${encodeURIComponent(product.nombre)}`
                      }}
                    />
                    <Badge className="absolute top-1.5 right-1.5 bg-amber-600 text-[10px] px-1.5 py-0.5">
                      {product.category.nombre}
                    </Badge>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <h3 className="font-semibold text-xs line-clamp-2 leading-tight">{product.nombre}</h3>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                        ${Number(product.precio).toLocaleString()}
                      </span>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 h-7 px-2 text-[10px]"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-[#f5f0e6] border-2 border-amber-200">
          <DialogHeader className="border-b border-amber-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Carrito de Compras
            </DialogTitle>
            <DialogDescription className="text-amber-700">
              Revisa tu pedido antes de continuar al pago
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-amber-300 mb-4" />
                <p className="text-amber-700 text-lg">Tu carrito está vacío</p>
                <p className="text-amber-600 text-sm mt-2">Agrega productos para comenzar tu pedido</p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-amber-200 shadow-sm"
                    >
                      <img
                        src={
                          item.product.imagen ||
                          `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.product.nombre) || "/placeholder.svg"}`
                        }
                        alt={item.product.nombre}
                        className="w-20 h-20 object-cover rounded-md border border-amber-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.product.nombre)}`
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-amber-900 truncate">{item.product.nombre}</h4>
                        <p className="text-sm text-amber-700">${Number(item.product.precio).toLocaleString()} c/u</p>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1 border border-amber-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-8 w-8 p-0 hover:bg-amber-100"
                        >
                          <Minus className="w-4 h-4 text-amber-900" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-amber-900">{item.cantidad}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addToCart(item.product)}
                          className="h-8 w-8 p-0 hover:bg-amber-100"
                        >
                          <Plus className="w-4 h-4 text-amber-900" />
                        </Button>
                      </div>
                      <div className="font-bold text-green-700 whitespace-nowrap text-lg">
                        ${(Number(item.product.precio) * item.cantidad).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-amber-300 pt-4 bg-amber-50 -mx-6 px-6 py-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-900 font-medium">Subtotal:</span>
                    <span className="text-amber-900 font-semibold text-lg">${getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold border-t border-amber-300 pt-2 mt-2">
                    <span className="text-amber-900">Total:</span>
                    <span className="text-green-700">${getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCart(false)}
                    className="flex-1 border-amber-600 text-amber-900 hover:bg-amber-50 font-semibold"
                  >
                    Seguir Comprando
                  </Button>
                  <Button
                    onClick={() => {
                      saveCartToStorage(cart)
                      setShowCart(false)
                      router.push("/checkout")
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  >
                    Ir a Pagar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
