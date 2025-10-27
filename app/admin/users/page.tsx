"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, UserCircle } from "lucide-react"

interface UserInterface {
  id: number
  email: string
  nombre: string
  rol: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: newRole }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">Administra los roles de los usuarios del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Usuarios Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.nombre}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={user.rol === "admin" ? "default" : "secondary"}
                    className="min-w-[80px] justify-center"
                  >
                    {user.rol === "admin" ? "Admin" : "Cliente"}
                  </Badge>

                  <Select value={user.rol} onValueChange={(value) => updateUserRole(user.id, value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No hay usuarios registrados</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Roles disponibles:</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Badge variant="default">Admin</Badge>
            <span>Puede gestionar productos, órdenes y usuarios</span>
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="secondary">Cliente</Badge>
            <span>Puede hacer pedidos y ver su historial</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
