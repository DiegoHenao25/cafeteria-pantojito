import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Rutas públicas que no requieren autenticación
  const isPublicPath = path === "/" || path === "/login" || path === "/register"

  // Obtener token de las cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // Redirigir a login si intenta acceder a rutas protegidas sin token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirigir a menu si ya está autenticado e intenta acceder a login/register
  if (isPublicPath && token && path !== "/") {
    return NextResponse.redirect(new URL("/menu", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/register", "/menu", "/admin", "/checkout"],
}
