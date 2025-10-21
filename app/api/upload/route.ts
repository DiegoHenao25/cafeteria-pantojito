import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

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
          },
          (error, result) => {
            if (error) {
              console.error("[v0] Error subiendo a Cloudinary:", error)
              resolve(NextResponse.json({ error: "Error al subir archivo" }, { status: 500 }))
            } else {
              resolve(NextResponse.json({ url: result?.secure_url }, { status: 200 }))
            }
          },
        )
        .end(buffer)
    })
  } catch (error) {
    console.error("[v0] Error subiendo archivo:", error)
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 })
  }
}
