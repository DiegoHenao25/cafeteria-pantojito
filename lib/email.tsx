import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

interface EmailResponse {
  success: boolean
  error?: string
}

async function sendEmail(to: string, subject: string, html: string): Promise<EmailResponse> {
  try {
    await transporter.sendMail({
      from: `☕ Cafetería Pantojito <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("Correo enviado correctamente")
    return { success: true }
  } catch (error) {
    console.error("Error enviando correo:", error)
    return { success: false, error: "Error al enviar correo" }
  }
}

// ================== VERIFICACIÓN ==================
export async function sendVerificationCode(email: string, code: string): Promise<EmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #fff5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #92400e; margin: 0; }
          .subtitle { color: #f472b6; font-size: 14px; margin-top: 5px; }
          .code-box { background-color: #fff5f5; border: 2px dashed #f9a8d4; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #92400e; letter-spacing: 8px; }
          .message { color: #666; line-height: 1.6; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pantojitos</h1>
            <p class="subtitle">Dulce Tradicion</p>
          </div>
          <p class="message">Hola! Gracias por registrarte en Pantojitos.</p>
          <p class="message">Tu codigo de verificacion es:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p class="message">Este codigo expirara en <strong>10 minutos</strong>.</p>
          <p class="message">Si no solicitaste este codigo, puedes ignorar este correo.</p>
          <div class="footer">
            <p>Este es un correo automatico, por favor no respondas.</p>
            <p>2025 Pantojitos. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail(email, "Codigo de verificacion - Pantojitos", html)
}

// ================== RECUPERACIÓN ==================
export async function sendPasswordResetCode(email: string, code: string): Promise<EmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #fff5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #92400e; margin: 0; }
          .subtitle { color: #f472b6; font-size: 14px; margin-top: 5px; }
          .code-box { background-color: #fff5f5; border: 2px dashed #f9a8d4; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 36px; font-weight: bold; color: #92400e; letter-spacing: 8px; }
          .message { color: #666; line-height: 1.6; margin: 20px 0; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pantojitos</h1>
            <p class="subtitle">Dulce Tradicion</p>
          </div>
          <p class="message">Hola, recibimos una solicitud para restablecer tu contrasena.</p>
          <p class="message">Tu codigo de verificacion es:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p class="message">Este codigo expirara en <strong>10 minutos</strong>.</p>
          <div class="warning">
            <strong>Importante:</strong> Si no solicitaste restablecer tu contrasena, ignora este correo.
          </div>
          <div class="footer">
            <p>Este es un correo automatico, por favor no respondas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail(email, "Recuperacion de contrasena - Pantojitos", html)
}

// ================== PEDIDOS ==================
export async function sendOrderNotificationToStaff(orderData: any): Promise<EmailResponse> {
  const staffEmail = process.env.STAFF_EMAIL || process.env.EMAIL_USER

  const html = `<h1>Nuevo pedido #${orderData.orderNumber}</h1>`

  return sendEmail(staffEmail!, "Nuevo pedido", html)
}