"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, LogOut, ClipboardList, Menu } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [userName, setUserName] = useState("")

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoryId: "",
  })

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (!data.user || data.user.rol !== "admin") {
        router.push("/login")
      } else {
        setUserName(data.user.nombre || "Admin")
      }
    } catch (error) {
      console.error("Error verificando autenticacion:", error)
      router.push("/login")
    }
  }

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const bodyData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        imagen: formData.imagen || editingProduct?.imagen || "",
        categoryId: formData.categoryId,
        disponible: true,
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      })

      const responseData = await response.json()

      if (response.ok) {
        await loadData()
        resetForm()
        setShowAddProduct(false)
        setEditingProduct(null)
      } else {
        alert(responseData.error || "Error al guardar producto")
      }
    } catch (error) {
      console.error("Error guardando producto:", error)
      alert("Error de conexion al guardar producto")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Estas seguro de eliminar este producto?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: newCategoryName }),
      })

      if (response.ok) {
        await loadData()
        setNewCategoryName("")
        setShowAddCategory(false)
      }
    } catch (error) {
      console.error("Error creando categoria:", error)
    }
  }

  const handleLogout = async () => {
    try {
      localStorage.clear()
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Error en logout:", error)
      window.location.href = "/login"
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen valida (JPG, PNG)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar 5MB")
      return
    }

    setUploadingImage(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, imagen: data.url })
        setImagePreview(data.url)
      } else {
        const error = await response.json()
        alert(error.error || "Error al subir imagen")
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error)
      alert("Error al subir imagen")
    } finally {
      setUploadingImage(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      categoryId: "",
    })
    setImagePreview(null)
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio.toString(),
      imagen: product.imagen || "",
      categoryId: product.categoryId.toString(),
    })
    setImagePreview(product.imagen)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-pink-200" />
          <p className="text-amber-900">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Pantojitos" className="w-10 h-10 rounded-full object-cover border-2 border-pink-200" />
              <div>
                <h1 className="text-xl font-bold text-amber-900">Pantojitos</h1>
                <p className="text-sm text-pink-400">Panel de Administracion</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-amber-700">Bienvenido</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-amber-900">Panel de Administracion - Pantojitos</h2>
          <div className="hidden lg:flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/orders")}
              className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Ver Pedidos
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/menu")}
              className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              Volver al Menu
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddCategory(true)}
              className="border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Categoria
            </Button>
            <Button
              onClick={() => setShowAddProduct(true)}
              className="bg-pink-400 hover:bg-pink-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetContent side="right" className="w-[280px] bg-white">
            <SheetHeader>
              <SheetTitle className="text-amber-900 flex items-center gap-2">
                <img src="/logo.jpeg" alt="Pantojitos" className="w-8 h-8 rounded-full border-2 border-pink-200" />
                Menu Admin
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-amber-700 px-2">Bienvenido</p>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); router.push("/admin/orders") }}
                className="w-full justify-start border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Ver Pedidos
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); router.push("/menu") }}
                className="w-full justify-start border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                Volver al Menu
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); setShowAddCategory(true) }}
                className="w-full justify-start border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Categoria
              </Button>
              <Button
                onClick={() => { setShowMobileMenu(false); setShowAddProduct(true) }}
                className="w-full justify-start bg-pink-400 hover:bg-pink-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); handleLogout() }}
                className="w-full justify-start border-2 border-pink-300 text-amber-900 hover:bg-pink-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-amber-900">Total Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-pink-500">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-amber-900">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-pink-500">{categories.length}</p>
            </CardContent>
          </Card>
          <Card className="border-pink-100">
            <CardHeader>
              <CardTitle className="text-amber-900">Productos Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-pink-500">{products.filter((p) => p.disponible).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Products by Category */}
        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.categoryId === category.id)
          if (categoryProducts.length === 0) return null

          return (
            <Card key={category.id} className="border-pink-100">
              <CardHeader>
                <CardTitle className="text-amber-900">{category.nombre}</CardTitle>
                <CardDescription className="text-amber-700">{categoryProducts.length} productos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        {product.imagen && (
                          <div className="relative w-full h-24 overflow-hidden rounded-t-lg">
                            <img
                              src={product.imagen || "/placeholder.svg"}
                              alt={product.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-1.5 space-y-0.5">
                          <h3 className="font-semibold text-xs line-clamp-1 text-amber-900">{product.nombre}</h3>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-bold text-pink-500">${product.precio.toLocaleString()}</p>
                            <Badge
                              variant={product.disponible ? "default" : "secondary"}
                              className={`text-[10px] px-1 py-0 h-4 ${product.disponible ? 'bg-green-100 text-green-700' : ''}`}
                            >
                              {product.disponible ? "Disp" : "No"}
                            </Badge>
                          </div>
                          <div className="flex gap-1 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(product)}
                              className="flex-1 h-6 px-1 text-xs border-pink-200 text-amber-900 hover:bg-pink-50"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 h-6 px-1 text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add/Edit Product Modal */}
        <Dialog
          open={showAddProduct || !!editingProduct}
          onOpenChange={(open) => {
            if (!open) {
              setShowAddProduct(false)
              setEditingProduct(null)
              resetForm()
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-pink-200">
            <DialogHeader className="border-b border-pink-200 pb-4">
              <DialogTitle className="text-2xl font-bold text-amber-900">
                {editingProduct ? "Editar Producto" : "Agregar Producto"}
              </DialogTitle>
              <DialogDescription className="text-amber-700">
                {editingProduct ? "Modifica los datos del producto" : "Completa la informacion del nuevo producto"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-amber-900 font-semibold">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="bg-white border-pink-200 focus:border-pink-400"
                  placeholder="Ej: Cafe Americano"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-amber-900 font-semibold">Descripcion</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400 min-h-[100px]"
                  placeholder="Describe el producto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-amber-900 font-semibold">Precio ($)</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    className="bg-white border-pink-200 focus:border-pink-400"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-amber-900 font-semibold">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className="bg-white border-pink-200 focus:border-pink-400">
                      <SelectValue placeholder="Selecciona una categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-pink-200">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imagen" className="text-amber-900 font-semibold">Imagen del Producto</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id="imagen"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="bg-white border-pink-200 focus:border-pink-400"
                    />
                    {uploadingImage && <Badge className="bg-pink-400 text-white">Subiendo...</Badge>}
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-48 border-2 border-pink-200 rounded-lg overflow-hidden bg-white">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <p className="text-xs text-amber-700">Formatos: JPG, PNG, WEBP. Tamano maximo: 5MB</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-pink-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowAddProduct(false); setEditingProduct(null); resetForm() }}
                  className="border-pink-200 text-amber-900 hover:bg-pink-50"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-pink-400 hover:bg-pink-500 text-white">
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Category Modal */}
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogContent className="bg-white border-2 border-pink-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-900">Agregar Categoria</DialogTitle>
              <DialogDescription className="text-amber-700">Crea una nueva categoria para organizar los productos</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-amber-900 font-semibold">Nombre de la Categoria</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej: Bebidas Calientes, Snacks, etc."
                  required
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCategory(false)}
                  className="border-pink-200 text-amber-900 hover:bg-pink-50"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-pink-400 hover:bg-pink-500 text-white">
                  Crear Categoria
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
