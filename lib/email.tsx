import nodemailer from "nodemailer"

// Configuración del transportador de correo
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Función para enviar código de verificación
export async function sendVerificationCode(email: string, code: string) {
  try {
    const mailOptions = {
      from: `"Cafetería Pantojito" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de verificación - Cafetería Pantojito",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f0e6;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 48px;
                margin-bottom: 10px;
              }
              h1 {
                color: #8b4513;
                margin: 0;
              }
              .code-box {
                background-color: #f5f0e6;
                border: 2px dashed #8b4513;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
              }
              .code {
                font-size: 36px;
                font-weight: bold;
                color: #8b4513;
                letter-spacing: 8px;
              }
              .message {
                color: #666;
                line-height: 1.6;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">☕</div>
                <h1>Cafetería Pantojito</h1>
              </div>
              
              <p class="message">
                ¡Hola! Gracias por registrarte en Cafetería Pantojito.
              </p>
              
              <p class="message">
                Tu código de verificación es:
              </p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p class="message">
                Este código expirará en <strong>10 minutos</strong>.
              </p>
              
              <p class="message">
                Si no solicitaste este código, puedes ignorar este correo.
              </p>
              
              <div class="footer">
                <p>Este es un correo automático, por favor no respondas.</p>
                <p>&copy; 2025 Cafetería Pantojito. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("[v0] Correo enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error al enviar correo:", error)
    throw error
  }
}

// Función para verificar la conexión
export async function verifyEmailConnection() {
  try {
    await transporter.verify()
    console.log("[v0] Servidor de correo listo para enviar mensajes")
    return true
  } catch (error) {
    console.error("[v0] Error al verificar conexión de correo:", error)
    return false
  }
}
