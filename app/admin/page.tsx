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
import { Trash2, Edit, Plus, LogOut, ClipboardList, Menu, Users, User, FileText, Coffee, BarChart3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [userEmail, setUserEmail] = useState("")
  
  const SUPER_ADMIN_EMAIL = "diegohenao.cortes@gmail.com"

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
        setUserEmail(data.user.email || "")
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

  const handleDeleteCategory = async (id: number, categoryName: string) => {
    const categoryProducts = products.filter((p) => p.categoryId === id)
    
    if (categoryProducts.length > 0) {
      alert(`No puedes eliminar "${categoryName}" porque tiene ${categoryProducts.length} productos asociados. Elimina o mueve los productos primero.`)
      return
    }

    if (!confirm(`Estas seguro de eliminar la categoria "${categoryName}"?`)) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadData()
      } else {
        const data = await response.json()
        alert(data.error || "Error al eliminar categoria")
      }
    } catch (error) {
      console.error("Error eliminando categoria:", error)
      alert("Error de conexion al eliminar categoria")
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdf6f6] to-white">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Pantojitos" className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-[#d38488]/30" />
          <p className="text-[#655642]">Cargando...</p>
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
                <p className="text-sm text-[#d38488]">Panel de Administracion</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-sm text-[#655642] hover:bg-[#d38488]/10 px-3 py-2 rounded-lg transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-[#d38488]/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#d38488]" />
                    </div>
                    <span>{userName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-[#d38488]/20">
                  <DropdownMenuLabel className="text-[#655642]">
                    <div className="flex flex-col">
                      <span className="font-medium">{userName}</span>
                      <span className="text-xs text-[#d38488]">Administrador</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => router.push("/perfil")}
                    className="cursor-pointer text-[#655642] hover:bg-[#d38488]/10 focus:bg-[#d38488]/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => router.push("/menu")}
                    className="cursor-pointer text-[#655642] hover:bg-[#d38488]/10 focus:bg-[#d38488]/10"
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Ver Menu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#655642]">Panel de Administracion - Pantojitos</h2>
          <div className="hidden lg:flex gap-2 flex-wrap">
{userEmail === SUPER_ADMIN_EMAIL && (
              <Button
                variant="outline"
                onClick={() => router.push("/admin/usuarios")}
                className="border-[#7BB39C]/30 text-[#7BB39C] hover:bg-[#7BB39C]/10"
              >
                <Users className="w-4 h-4 mr-2" />
                Gestionar Admins
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/admin/orders")}
              className="border-[#d38488]/30 text-[#655642]/80 hover:bg-[#d38488]/10"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Ver Pedidos
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/clientes")}
              className="border-[#e9e076] text-[#655642] hover:bg-[#e9e076]/20"
            >
              <Users className="w-4 h-4 mr-2" />
              Historial Clientes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/estadisticas")}
              className="border-[#7BB39C] text-[#7BB39C] hover:bg-[#7BB39C]/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadisticas
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/menu")}
              className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
            >
              Volver al Menu
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddCategory(true)}
              className="border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Categoria
            </Button>
            <Button
              onClick={() => setShowAddProduct(true)}
              variant="outline"
              className="border-2 border-[#d38488] text-[#d38488]/100 hover:bg-[#d38488]/10 hover:text-[#d38488]"
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
              <SheetTitle className="text-[#655642] flex items-center gap-2">
                <img src="/logo.jpeg" alt="Pantojitos" className="w-8 h-8 rounded-full border-2 border-[#d38488]/30" />
                Menu Admin
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <Button
                variant="ghost"
                onClick={() => { setShowMobileMenu(false); router.push("/perfil") }}
                className="w-full justify-start text-[#655642] hover:bg-[#d38488]/10 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-[#d38488]/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#d38488]" />
                </div>
                <span className="text-sm">{userName}</span>
              </Button>
              {userEmail === SUPER_ADMIN_EMAIL && (
                <Button
                  variant="outline"
                  onClick={() => { setShowMobileMenu(false); router.push("/admin/usuarios") }}
                  className="w-full justify-start border-2 border-[#7BB39C]/50 text-[#7BB39C] hover:bg-[#7BB39C]/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Admins
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); router.push("/admin/orders") }}
                className="w-full justify-start border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Ver Pedidos
              </Button>
<Button
                variant="ghost"
                onClick={() => { setShowMobileMenu(false); router.push("/admin/clientes") }}
                className="w-full justify-start text-[#655642] hover:bg-[#e9e076]/20"
              >
                <Users className="w-4 h-4 mr-2" />
                Historial Clientes
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setShowMobileMenu(false); router.push("/admin/estadisticas") }}
                className="w-full justify-start text-[#7BB39C] hover:bg-[#7BB39C]/20"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Estadisticas
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); router.push("/menu") }}
                className="w-full justify-start border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                Volver al Menu
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); setShowAddCategory(true) }}
                className="w-full justify-start border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Categoria
              </Button>
              <Button
                onClick={() => { setShowMobileMenu(false); setShowAddProduct(true) }}
                variant="outline"
                className="w-full justify-start border-2 border-[#d38488] text-[#d38488]/100 hover:bg-[#d38488]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Producto
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowMobileMenu(false); handleLogout() }}
                className="w-full justify-start border-2 border-[#d38488] text-[#655642] hover:bg-[#d38488]/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesion
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#d38488]/20">
            <CardHeader>
              <CardTitle className="text-[#655642]">Total Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d38488]/100">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/20">
            <CardHeader>
              <CardTitle className="text-[#655642]">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d38488]/100">{categories.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#d38488]/20">
            <CardHeader>
              <CardTitle className="text-[#655642]">Productos Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d38488]/100">{products.filter((p) => p.disponible).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Products by Category */}
        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.categoryId === category.id)
          if (categoryProducts.length === 0) return null

          return (
            <Card key={category.id} className="border-[#d38488]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#655642]">{category.nombre}</CardTitle>
                    <CardDescription className="text-[#655642]/80">{categoryProducts.length} productos</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category.id, category.nombre)}
                    className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-[#d38488]/20 shadow-sm hover:shadow-md transition-shadow">
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
                          <h3 className="font-semibold text-xs line-clamp-1 text-[#655642]">{product.nombre}</h3>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-bold text-[#d38488]/100">${product.precio.toLocaleString()}</p>
                            <Badge
                              variant={product.disponible ? "default" : "secondary"}
                              className={`text-[10px] px-1 py-0 h-4 ${product.disponible ? 'bg-[#7BB39C]/20 text-[#7BB39C]' : ''}`}
                            >
                              {product.disponible ? "Disp" : "No"}
                            </Badge>
                          </div>
                          <div className="flex gap-1 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(product)}
                              className="flex-1 h-6 px-1 text-xs border-[#d38488]/30 text-[#655642] hover:bg-[#d38488]/10"
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-[#d38488]/30">
            <DialogHeader className="border-b border-[#d38488]/30 pb-4">
              <DialogTitle className="text-2xl font-bold text-[#655642]">
                {editingProduct ? "Editar Producto" : "Agregar Producto"}
              </DialogTitle>
              <DialogDescription className="text-[#655642]/80">
                {editingProduct ? "Modifica los datos del producto" : "Completa la informacion del nuevo producto"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-[#655642] font-semibold">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="bg-white border-[#d38488]/30 focus:border-[#d38488]"
                  placeholder="Ej: Cafe Americano"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-[#655642] font-semibold">Descripcion</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="bg-white border-[#d38488]/30 focus:border-[#d38488] min-h-[100px]"
                  placeholder="Describe el producto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-[#655642] font-semibold">Precio ($)</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    className="bg-white border-[#d38488]/30 focus:border-[#d38488]"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-[#655642] font-semibold">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className="bg-white border-[#d38488]/30 focus:border-[#d38488]">
                      <SelectValue placeholder="Selecciona una categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#d38488]/30">
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
                <Label htmlFor="imagen" className="text-[#655642] font-semibold">Imagen del Producto</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id="imagen"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="bg-white border-[#d38488]/30 focus:border-[#d38488]"
                    />
                    {uploadingImage && <Badge className="bg-[#d38488] text-white">Subiendo...</Badge>}
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-48 border-2 border-[#d38488]/30 rounded-lg overflow-hidden bg-white">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <p className="text-xs text-[#655642]/80">Formatos: JPG, PNG, WEBP. Tamano maximo: 5MB</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[#d38488]/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowAddProduct(false); setEditingProduct(null); resetForm() }}
                  className="border-[#d38488]/30 text-[#655642] hover:bg-[#d38488]/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#d38488] hover:bg-[#d38488]/100 text-white">
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Category Modal */}
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogContent className="bg-white border-2 border-[#d38488]/30">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#655642]">Agregar Categoria</DialogTitle>
              <DialogDescription className="text-[#655642]/80">Crea una nueva categoria para organizar los productos</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-[#655642] font-semibold">Nombre de la Categoria</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej: Bebidas Calientes, Snacks, etc."
                  required
                  className="bg-white border-[#d38488]/30 focus:border-[#d38488]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCategory(false)}
                  className="border-[#d38488]/30 text-[#655642] hover:bg-[#d38488]/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#d38488] hover:bg-[#d38488]/100 text-white">
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
