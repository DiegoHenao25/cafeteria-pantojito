import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Error obteniendo usuario:", error)
    return NextResponse.json({ user: null })
  }
}
