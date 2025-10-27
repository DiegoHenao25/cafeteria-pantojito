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

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("[v0] Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          precio: Number.parseFloat(formData.precio),
          categoryId: Number.parseInt(formData.categoryId),
          disponible: true,
        }),
      })

      if (response.ok) {
        await loadData()
        resetForm()
        setShowAddProduct(false)
        setEditingProduct(null)
      } else {
        const error = await response.json()
        alert(error.error || "Error al guardar producto")
      }
    } catch (error) {
      console.error("[v0] Error guardando producto:", error)
      alert("Error al guardar producto")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error("[v0] Error eliminando producto:", error)
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
      console.error("[v0] Error creando categoría:", error)
    }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida (JPG, PNG)")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar 5MB")
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
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
      console.error("[v0] Error subiendo imagen:", error)
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

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoryId: "",
  })

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Administración - Cafetería Pantojito</h1>
        <div className="hidden lg:flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/orders")}
            className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Ver Pedidos
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/menu")}
            className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
          >
            Volver al Menú
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAddCategory(true)}
            className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Categoría
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAddProduct(true)}
            className="border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
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
          onClick={() => setShowMobileMenu(true)}
          className="lg:hidden border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="right" className="w-[280px] bg-white">
          <SheetHeader>
            <SheetTitle className="text-amber-900">Menú Admin</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                router.push("/admin/orders")
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Ver Pedidos
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                router.push("/menu")
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              Volver al Menú
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                setShowAddCategory(true)
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Categoría
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false)
                setShowAddProduct(true)
              }}
              className="w-full justify-start border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Productos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.filter((p) => p.disponible).length}</p>
          </CardContent>
        </Card>
      </div>

      {categories.map((category) => {
        const categoryProducts = products.filter((p) => p.categoryId === category.id)
        if (categoryProducts.length === 0) return null

        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.nombre}</CardTitle>
              <CardDescription>{categoryProducts.length} productos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categoryProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
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
                        <h3 className="font-semibold text-xs line-clamp-1">{product.nombre}</h3>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-bold text-green-600">${product.precio.toLocaleString()}</p>
                          <Badge
                            variant={product.disponible ? "default" : "secondary"}
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            {product.disponible ? "Disp" : "No"}
                          </Badge>
                        </div>
                        <div className="flex gap-1 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(product)}
                            className="flex-1 h-6 px-1 text-xs"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#f5f0e6] border-2 border-amber-200">
          <DialogHeader className="border-b border-amber-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-amber-900">
              {editingProduct ? "Editar Producto" : "Agregar Producto"}
            </DialogTitle>
            <DialogDescription className="text-amber-700">
              {editingProduct ? "Modifica los datos del producto" : "Completa la información del nuevo producto"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-amber-900 font-semibold">
                Nombre del Producto
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Ej: Café Americano"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-amber-900 font-semibold">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500 min-h-[100px]"
                placeholder="Describe el producto..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio" className="text-amber-900 font-semibold">
                  Precio ($)
                </Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  required
                  className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-amber-900 font-semibold">
                  Categoría
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-amber-300">
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
              <Label htmlFor="imagen" className="text-amber-900 font-semibold">
                Imagen del Producto
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="imagen"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                  {uploadingImage && <Badge className="bg-amber-600 text-white">Subiendo...</Badge>}
                </div>
                {imagePreview && (
                  <div className="relative w-full h-48 border-2 border-amber-300 rounded-lg overflow-hidden bg-white">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-amber-700">Formatos: JPG, PNG, WEBP. Tamaño máximo: 5MB</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-amber-200">
              <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                {editingProduct ? "Actualizar Producto" : "Crear Producto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddProduct(false)
                  setEditingProduct(null)
                  resetForm()
                }}
                className="flex-1 border-amber-600 text-amber-900 hover:bg-amber-50"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="max-w-md bg-[#f5f0e6] border-2 border-amber-200">
          <DialogHeader className="border-b border-amber-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-amber-900">Agregar Categoría</DialogTitle>
            <DialogDescription className="text-amber-700">
              Crea una nueva categoría para organizar los productos
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-amber-900 font-semibold">
                Nombre de la Categoría
              </Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ej: Bebidas Calientes, Snacks, etc."
                required
                className="bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-3 pt-4 border-t border-amber-200">
              <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                Crear Categoría
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddCategory(false)
                  setNewCategoryName("")
                }}
                className="flex-1 border-amber-600 text-amber-900 hover:bg-amber-50"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
