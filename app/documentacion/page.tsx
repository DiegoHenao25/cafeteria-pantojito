"use client"

import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DocumentacionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Header para no imprimir */}
      <div className="print:hidden bg-[#d38488] text-white p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="font-bold">Documentacion del Proyecto</h1>
          <Button onClick={() => window.print()} className="bg-white text-[#d38488] hover:bg-white/90">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir PDF
          </Button>
        </div>
      </div>

      {/* Contenido del documento */}
      <div className="max-w-4xl mx-auto p-8 print:p-4">
        
        {/* Portada */}
        <div className="text-center mb-12 print:mb-8 border-b-4 border-[#d38488] pb-8">
          <h1 className="text-4xl font-bold text-[#655642] mb-4">GUIA TECNICA DEL PROYECTO</h1>
          <h2 className="text-2xl text-[#d38488] mb-2">Sistema de Pedidos en Linea</h2>
          <h3 className="text-xl text-[#655642]">Cafeteria Pantojitos</h3>
          <p className="text-gray-500 mt-4">Universidad Catolica de Pereira</p>
        </div>

        {/* Indice */}
        <div className="mb-12 print:mb-8 bg-gray-50 p-6 rounded-lg print:bg-white print:border">
          <h2 className="text-xl font-bold text-[#655642] mb-4">INDICE</h2>
          <ol className="list-decimal list-inside space-y-2 text-[#655642]">
            <li>Base de Datos (Prisma + MySQL)</li>
            <li>Autenticacion (Login/Registro)</li>
            <li>Integracion con Wompi (Pagos)</li>
            <li>Integracion con Cloudinary (Imagenes)</li>
            <li>Interfaz Principal (Frontend)</li>
            <li>Panel de Administracion</li>
            <li>APIs de Datos (CRUD)</li>
            <li>Notificaciones y Temporizadores</li>
            <li>Contextos y Hooks Globales</li>
            <li>Estructura de Carpetas</li>
            <li>Variables de Entorno</li>
          </ol>
        </div>

        {/* Seccion 1 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            1. BASE DE DATOS (Prisma + MySQL)
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">prisma/schema.prisma</td>
                <td className="border border-gray-300 p-2">Define todas las tablas: User, Product, Category, Order, OrderItem</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">lib/prisma.ts</td>
                <td className="border border-gray-300 p-2">Crea la conexion a MySQL. Se importa en todas las APIs</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">.env</td>
                <td className="border border-gray-300 p-2">Contiene DATABASE_URL con la conexion a Railway</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-[#655642] mb-2">Tablas principales:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li><strong>User</strong> - Usuarios (id, nombre, email, password, telefono, rol)</li>
            <li><strong>Category</strong> - Categorias de productos (id, nombre, imagen)</li>
            <li><strong>Product</strong> - Productos (id, nombre, descripcion, precio, imagen, categoryId, disponible)</li>
            <li><strong>Order</strong> - Pedidos (id, total, estado, metodoPago, tiempoRecogida, userId)</li>
            <li><strong>OrderItem</strong> - Items de cada pedido (id, cantidad, precio, orderId, productId)</li>
          </ul>
        </section>

        {/* Seccion 2 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            2. AUTENTICACION (Login/Registro)
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/auth/login/route.ts</td>
                <td className="border border-gray-300 p-2">API para iniciar sesion. Verifica email y password con bcrypt, genera JWT</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/auth/register/route.ts</td>
                <td className="border border-gray-300 p-2">API para registrar usuarios. Encripta password con bcrypt</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/auth/logout/route.ts</td>
                <td className="border border-gray-300 p-2">API para cerrar sesion. Elimina la cookie del token</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/auth/me/route.ts</td>
                <td className="border border-gray-300 p-2">API para obtener datos del usuario logueado desde el token</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">lib/auth.ts</td>
                <td className="border border-gray-300 p-2">Funciones: createToken(), verifyToken(), getSession(), isAdmin()</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">context/auth-context.tsx</td>
                <td className="border border-gray-300 p-2">Context de React que maneja el estado del usuario en toda la app</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-[#655642] mb-2">Flujo de autenticacion:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li>Usuario envia email/password</li>
            <li>API verifica con bcrypt (comparacion de hash)</li>
            <li>Si es correcto, genera JWT y lo guarda en cookie HTTP-only</li>
            <li>El token se envia automaticamente en cada request</li>
          </ol>
        </section>

        {/* Seccion 3 */}
        <section className="mb-10 print:mb-6 print:break-before-page">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            3. INTEGRACION CON WOMPI (Pagos)
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/create-payment/route.ts</td>
                <td className="border border-gray-300 p-2">Crea la sesion de pago en Wompi. Genera el link de checkout</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/verify-payment/route.ts</td>
                <td className="border border-gray-300 p-2">Verifica el estado del pago con Wompi. Actualiza el pedido</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/webhooks/wompi/route.ts</td>
                <td className="border border-gray-300 p-2">Recibe notificaciones automaticas de Wompi cuando un pago se completa</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/checkout/page.tsx</td>
                <td className="border border-gray-300 p-2">Pagina de checkout donde el usuario ve su pedido</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/payment-status/page.tsx</td>
                <td className="border border-gray-300 p-2">Pagina que muestra el resultado del pago (exitoso/fallido)</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-[#655642] mb-2">Variables de entorno:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4 mb-4">
            <li><code className="bg-gray-100 px-1">WOMPI_PUBLIC_KEY</code> - Llave publica de Wompi</li>
            <li><code className="bg-gray-100 px-1">WOMPI_PRIVATE_KEY</code> - Llave privada de Wompi</li>
            <li><code className="bg-gray-100 px-1">WOMPI_EVENTS_SECRET</code> - Secreto para validar webhooks</li>
          </ul>

          <h4 className="font-bold text-[#655642] mb-2">Flujo de pago:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li>Usuario llega a /checkout con su carrito</li>
            <li>Selecciona tiempo de recogida y da clic en &quot;Pagar&quot;</li>
            <li>Se crea el pedido en BD con estado pendiente_pago</li>
            <li>Se llama a /api/create-payment que genera link de Wompi</li>
            <li>Usuario paga en Wompi (Nequi, PSE, tarjeta)</li>
            <li>Wompi redirige a /payment-status</li>
            <li>Se verifica el pago y actualiza estado a pendiente</li>
          </ol>
        </section>

        {/* Seccion 4 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            4. INTEGRACION CON CLOUDINARY (Imagenes)
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/upload/route.ts</td>
                <td className="border border-gray-300 p-2">API que recibe imagen y la sube a Cloudinary. Devuelve la URL</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/admin/page.tsx</td>
                <td className="border border-gray-300 p-2">Panel admin donde se suben imagenes al crear/editar productos</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-[#655642] mb-2">Variables de entorno:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4 mb-4">
            <li><code className="bg-gray-100 px-1">CLOUDINARY_CLOUD_NAME</code> - Nombre del cloud</li>
            <li><code className="bg-gray-100 px-1">CLOUDINARY_API_KEY</code> - API key</li>
            <li><code className="bg-gray-100 px-1">CLOUDINARY_API_SECRET</code> - API secret</li>
          </ul>

          <h4 className="font-bold text-[#655642] mb-2">Flujo de subida:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li>Admin selecciona imagen en el formulario</li>
            <li>Se envia a /api/upload como FormData</li>
            <li>API sube a Cloudinary y devuelve URL</li>
            <li>URL se guarda en el producto/categoria</li>
          </ol>
        </section>

        {/* Seccion 5 */}
        <section className="mb-10 print:mb-6 print:break-before-page">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            5. INTERFAZ PRINCIPAL (Frontend)
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/page.tsx</td>
                <td className="border border-gray-300 p-2">Pagina principal - Landing con hero, categorias y productos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/menu/page.tsx</td>
                <td className="border border-gray-300 p-2">Catalogo completo de productos con filtros por categoria</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/cart/page.tsx</td>
                <td className="border border-gray-300 p-2">Carrito de compras con lista de productos y total</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/pedidos/page.tsx</td>
                <td className="border border-gray-300 p-2">Historial de pedidos del usuario con estados y temporizadores</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/profile/page.tsx</td>
                <td className="border border-gray-300 p-2">Perfil del usuario donde puede editar sus datos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/layout.tsx</td>
                <td className="border border-gray-300 p-2">Layout principal con fuentes, metadata y providers</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/globals.css</td>
                <td className="border border-gray-300 p-2">Estilos globales y tokens de colores del tema</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Seccion 6 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            6. PANEL DE ADMINISTRACION
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/admin/page.tsx</td>
                <td className="border border-gray-300 p-2">Panel principal - CRUD de productos y categorias</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/admin/orders/page.tsx</td>
                <td className="border border-gray-300 p-2">Gestion de pedidos - Ver, cambiar estados, temporizadores</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/admin/estadisticas/page.tsx</td>
                <td className="border border-gray-300 p-2">Dashboard de estadisticas con graficos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/admin/estadisticas/route.ts</td>
                <td className="border border-gray-300 p-2">API que calcula todas las estadisticas</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-[#655642] mb-2">Funcionalidades del admin:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li>Crear/editar/eliminar productos y categorias</li>
            <li>Subir imagenes a Cloudinary</li>
            <li>Ver pedidos en tiempo real con temporizadores</li>
            <li>Cambiar estados (Pendiente → En proceso → Listo → Entregado)</li>
            <li>Ver estadisticas de ventas, productos mas vendidos, clientes frecuentes</li>
          </ul>
        </section>

        {/* Seccion 7 */}
        <section className="mb-10 print:mb-6 print:break-before-page">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            7. APIs DE DATOS (CRUD)
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/products/route.ts</td>
                <td className="border border-gray-300 p-2">GET (listar) y POST (crear) productos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/products/[id]/route.ts</td>
                <td className="border border-gray-300 p-2">GET, PUT, DELETE producto especifico</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/categories/route.ts</td>
                <td className="border border-gray-300 p-2">GET y POST categorias</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/categories/[id]/route.ts</td>
                <td className="border border-gray-300 p-2">GET, PUT, DELETE categoria especifica</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/orders/route.ts</td>
                <td className="border border-gray-300 p-2">GET pedidos del usuario, POST crear pedido</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/orders/[id]/route.ts</td>
                <td className="border border-gray-300 p-2">GET, PUT (cambiar estado) pedido especifico</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">app/api/profile/route.ts</td>
                <td className="border border-gray-300 p-2">GET y PUT perfil del usuario logueado</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Seccion 8 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            8. NOTIFICACIONES Y TEMPORIZADORES
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">hooks/use-global-timer.ts</td>
                <td className="border border-gray-300 p-2">Hook que maneja el temporizador global para todos los pedidos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">hooks/use-order-notifications.ts</td>
                <td className="border border-gray-300 p-2">Hook que envia notificaciones cuando quedan X minutos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">components/countdown-badge.tsx</td>
                <td className="border border-gray-300 p-2">Componente visual del temporizador con colores segun urgencia</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-bold text-[#655642] mb-2">Funcionamiento:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
            <li>Cada pedido tiene tiempoRecogida (15, 20, 30 min)</li>
            <li>El hook calcula tiempo restante desde createdAt</li>
            <li>Cambia colores: Verde ({'>'}10min) → Amarillo (5-10min) → Rojo ({'<'}5min)</li>
            <li>Envia notificaciones del navegador en intervalos</li>
          </ul>
        </section>

        {/* Seccion 9 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            9. CONTEXTOS Y HOOKS GLOBALES
          </h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead className="bg-[#d38488]/10">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Archivo</th>
                <th className="border border-gray-300 p-2 text-left">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">context/auth-context.tsx</td>
                <td className="border border-gray-300 p-2">Estado global del usuario (login, logout, datos)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">context/cart-context.tsx</td>
                <td className="border border-gray-300 p-2">Estado global del carrito (agregar, quitar, total)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">hooks/use-mobile.tsx</td>
                <td className="border border-gray-300 p-2">Detecta si es dispositivo movil</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-mono text-xs">hooks/use-toast.ts</td>
                <td className="border border-gray-300 p-2">Muestra notificaciones toast</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Seccion 10 */}
        <section className="mb-10 print:mb-6 print:break-before-page">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            10. ESTRUCTURA DE CARPETAS
          </h2>
          
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto print:text-[10px] print:bg-gray-100 print:text-gray-800">
{`cafeteria-ucp/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── categories/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── admin/
│   │   │   └── estadisticas/route.ts
│   │   ├── create-payment/route.ts
│   │   ├── verify-payment/route.ts
│   │   ├── webhooks/wompi/route.ts
│   │   ├── upload/route.ts
│   │   └── profile/route.ts
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   └── estadisticas/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── menu/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── payment-status/page.tsx
│   ├── pedidos/page.tsx
│   ├── profile/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── navbar.tsx
│   └── countdown-badge.tsx
├── context/
│   ├── auth-context.tsx
│   └── cart-context.tsx
├── hooks/
│   ├── use-global-timer.ts
│   ├── use-order-notifications.ts
│   └── use-mobile.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── next.config.mjs`}
          </pre>
        </section>

        {/* Seccion 11 */}
        <section className="mb-10 print:mb-6 page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-[#d38488] mb-4 border-b-2 border-[#d38488] pb-2">
            11. VARIABLES DE ENTORNO (.env)
          </h2>
          
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto print:text-[10px] print:bg-gray-100 print:text-gray-800">
{`# Base de datos
DATABASE_URL="mysql://root:xxx@host:port/railway"

# JWT
JWT_SECRET="tu-secreto-jwt-seguro"

# Wompi
WOMPI_PUBLIC_KEY="pub_prod_xxx"
WOMPI_PRIVATE_KEY="prv_prod_xxx"
WOMPI_EVENTS_SECRET="xxx"
NEXT_PUBLIC_WOMPI_PUBLIC_KEY="pub_prod_xxx"

# Cloudinary
CLOUDINARY_CLOUD_NAME="xxx"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"

# App
NEXT_PUBLIC_BASE_URL="https://cafeteria-pantojito.vercel.app"`}
          </pre>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t pt-4 mt-8">
          <p>Documentacion del Sistema de Pedidos - Cafeteria Pantojitos</p>
          <p>Universidad Catolica de Pereira - 2024</p>
        </div>

      </div>

      {/* Estilos de impresion */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:break-before-page {
            break-before: page;
          }
          .page-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
