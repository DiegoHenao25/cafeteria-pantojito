import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key")

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(payload: { userId: number; email: string; rol: string }) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: number; email: string; rol: string }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) return null

  return verifyToken(token.value)
}

export async function isAdmin() {
  const session = await getSession()
  return session?.rol === "admin"
}
