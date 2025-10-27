import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME || ""),
  api_key: String(process.env.CLOUDINARY_API_KEY || ""),
  api_secret: String(process.env.CLOUDINARY_API_SECRET || ""),
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload request received")
    console.log("[v0] Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    })

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] No file provided")
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    console.log("[v0] File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Solo se permiten imágenes JPG, PNG o WEBP" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo no debe superar 5MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "cafeteria-productos",
            transformation: [{ width: 800, height: 800, crop: "limit" }],
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          },
          (error, result) => {
            if (error) {
              console.error("[v0] Cloudinary upload error:", {
                message: error.message,
                http_code: error.http_code,
                name: error.name,
                error: error,
              })
              resolve(NextResponse.json({ error: `Error al subir archivo: ${error.message}` }, { status: 500 }))
            } else {
              console.log("[v0] Upload successful:", result?.secure_url)
              resolve(NextResponse.json({ url: result?.secure_url }, { status: 200 }))
            }
          },
        )
        .end(buffer)
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      { error: `Error al subir archivo: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
