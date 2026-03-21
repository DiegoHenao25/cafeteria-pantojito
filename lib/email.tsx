import nodemailer from "nodemailer"

// Configuracion del transportador de correo con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Logo de Pantojitos en base64 o URL publica
const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-17%20at%209.43.58%20AM-rqx7cCrXfX7bDLplcnsvtpje8FMfho.jpeg"

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

// Template base para todos los emails
function getEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #fdf2f8 0%, #fff7ed 100%);
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white; 
            border-radius: 20px; 
            padding: 40px; 
            box-shadow: 0 10px 40px rgba(244, 114, 182, 0.15);
            border: 1px solid #fce7f3;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #fce7f3;
          }
          .logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid #fbcfe8;
            box-shadow: 0 4px 15px rgba(244, 114, 182, 0.3);
          }
          .brand-name { 
            color: #92400e; 
            margin: 15px 0 5px 0;
            font-size: 28px;
            font-weight: bold;
          }
          .subtitle { 
            color: #f472b6; 
            font-size: 16px; 
            margin: 0;
            font-style: italic;
          }
          .content {
            padding: 20px 0;
          }
          .code-box { 
            background: linear-gradient(135deg, #fdf2f8 0%, #fff7ed 100%);
            border: 3px dashed #f9a8d4; 
            border-radius: 15px; 
            padding: 30px; 
            text-align: center; 
            margin: 30px 0; 
          }
          .code { 
            font-size: 42px; 
            font-weight: bold; 
            color: #92400e; 
            letter-spacing: 12px;
            text-shadow: 2px 2px 4px rgba(146, 64, 14, 0.1);
          }
          .message { 
            color: #78716c; 
            line-height: 1.8; 
            margin: 15px 0;
            font-size: 15px;
          }
          .highlight {
            color: #92400e;
            font-weight: bold;
          }
          .warning { 
            background-color: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 15px 20px; 
            margin: 25px 0; 
            color: #92400e;
            border-radius: 0 10px 10px 0;
          }
          .footer { 
            text-align: center; 
            color: #a8a29e; 
            font-size: 12px; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 2px solid #fce7f3;
          }
          .footer p {
            margin: 5px 0;
          }
          .social-text {
            color: #f472b6;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${LOGO_URL}" alt="Pantojitos Logo" class="logo">
            <h1 class="brand-name">Pantojitos</h1>
            <p class="subtitle">Dulce Tradicion!</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p class="social-text">Gracias por ser parte de Pantojitos</p>
            <p>Este es un correo automatico, por favor no respondas.</p>
            <p>2025 Pantojitos - Universidad Catolica de Pereira</p>
            <p>Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Funcion para enviar codigo de verificacion (registro)
export async function sendVerificationCode(email: string, code: string): Promise<EmailResponse> {
  const content = `
    <p class="message">Hola! Gracias por registrarte en <span class="highlight">Pantojitos</span>.</p>
    <p class="message">Estamos emocionados de tenerte con nosotros. Para completar tu registro, ingresa el siguiente codigo de verificacion:</p>
    
    <div class="code-box">
      <p style="margin: 0 0 10px 0; color: #f472b6; font-size: 14px;">Tu codigo de verificacion</p>
      <div class="code">${code}</div>
    </div>
    
    <p class="message">Este codigo expirara en <span class="highlight">10 minutos</span>.</p>
    <p class="message">Si no solicitaste este codigo, puedes ignorar este correo de forma segura.</p>
  `

  const html = getEmailTemplate(content)

  try {
    const info = await transporter.sendMail({
      from: `"Pantojitos - Dulce Tradicion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Codigo de Verificacion - Pantojitos",
      html,
    })
    
    console.log("[v0] Correo de verificacion enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error al enviar correo:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Funcion para enviar codigo de recuperacion de contrasena
export async function sendPasswordResetCode(email: string, code: string): Promise<EmailResponse> {
  const content = `
    <p class="message">Hola! Recibimos una solicitud para restablecer la contrasena de tu cuenta en <span class="highlight">Pantojitos</span>.</p>
    <p class="message">Usa el siguiente codigo para continuar con el proceso:</p>
    
    <div class="code-box">
      <p style="margin: 0 0 10px 0; color: #f472b6; font-size: 14px;">Tu codigo de recuperacion</p>
      <div class="code">${code}</div>
    </div>
    
    <p class="message">Este codigo expirara en <span class="highlight">10 minutos</span>.</p>
    
    <div class="warning">
      <strong>Importante:</strong> Si no solicitaste restablecer tu contrasena, ignora este correo. Tu cuenta permanecera segura y no se realizara ningun cambio.
    </div>
  `

  const html = getEmailTemplate(content)

  try {
    const info = await transporter.sendMail({
      from: `"Pantojitos - Dulce Tradicion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperacion de Contrasena - Pantojitos",
      html,
    })
    
    console.log("[v0] Correo de recuperacion enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error al enviar correo:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Funcion para enviar notificacion de pedido al staff
export async function sendOrderNotificationToStaff(orderData: {
  orderNumber: number
  clienteNombre: string
  clienteCedula: string
  clienteTelefono: string
  clienteCorreo: string
  tiempoRecogida: number
  metodoPago: string
  total: number
  items: Array<{ nombre: string; cantidad: number; precio: number }>
}): Promise<EmailResponse> {
  const staffEmail = process.env.STAFF_EMAIL || process.env.EMAIL_USER
  if (!staffEmail) {
    return { success: false, error: "No staff email configured" }
  }

  const itemsHtml = orderData.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #fce7f3;">${item.nombre}</td>
        <td style="padding: 12px; border-bottom: 1px solid #fce7f3; text-align: center;">${item.cantidad}</td>
        <td style="padding: 12px; border-bottom: 1px solid #fce7f3; text-align: right;">$${item.precio.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #fce7f3; text-align: right; font-weight: bold;">$${(item.precio * item.cantidad).toLocaleString()}</td>
      </tr>
    `
    )
    .join("")

  const content = `
    <div style="background: linear-gradient(135deg, #92400e 0%, #f472b6 100%); padding: 25px; border-radius: 15px; color: white; text-align: center; margin-bottom: 25px;">
      <h2 style="margin: 0; font-size: 24px;">Nuevo Pedido Recibido!</h2>
      <div style="background-color: white; color: #92400e; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 15px; font-weight: bold; font-size: 18px;">
        Pedido #${orderData.orderNumber}
      </div>
    </div>
    
    <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
      <strong style="color: #92400e; font-size: 18px;">TIEMPO DE PREPARACION: ${orderData.tiempoRecogida} MINUTOS</strong>
    </div>

    <div style="background-color: #fdf2f8; padding: 20px; border-radius: 10px; border-left: 4px solid #f472b6; margin-bottom: 20px;">
      <h3 style="color: #92400e; margin-top: 0;">Informacion del Cliente</h3>
      <p style="margin: 8px 0; color: #78716c;"><strong>Nombre:</strong> ${orderData.clienteNombre}</p>
      <p style="margin: 8px 0; color: #78716c;"><strong>Cedula:</strong> ${orderData.clienteCedula}</p>
      <p style="margin: 8px 0; color: #78716c;"><strong>Telefono:</strong> ${orderData.clienteTelefono}</p>
      <p style="margin: 8px 0; color: #78716c;"><strong>Correo:</strong> ${orderData.clienteCorreo}</p>
    </div>

    <div style="background-color: #fdf2f8; padding: 20px; border-radius: 10px; border-left: 4px solid #f472b6; margin-bottom: 20px;">
      <h3 style="color: #92400e; margin-top: 0;">Detalles del Pedido</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #92400e; color: white;">
            <th style="padding: 12px; text-align: left; border-radius: 5px 0 0 0;">Producto</th>
            <th style="padding: 12px; text-align: center;">Cant.</th>
            <th style="padding: 12px; text-align: right;">P. Unit.</th>
            <th style="padding: 12px; text-align: right; border-radius: 0 5px 0 0;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr style="background-color: #fce7f3;">
            <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #92400e;">TOTAL:</td>
            <td style="padding: 15px; text-align: right; color: #16a34a; font-size: 22px; font-weight: bold;">$${orderData.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="text-align: center; padding: 15px; background-color: #f0fdf4; border-radius: 10px;">
      <p style="margin: 0; color: #78716c;">Metodo de Pago:</p>
      <span style="background-color: #16a34a; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-weight: bold;">
        ${orderData.metodoPago.toUpperCase()}
      </span>
    </div>
  `

  const html = getEmailTemplate(content)

  try {
    const info = await transporter.sendMail({
      from: `"Pantojitos - Sistema de Pedidos" <${process.env.EMAIL_USER}>`,
      to: staffEmail,
      subject: `Nuevo Pedido #${orderData.orderNumber} - ${orderData.clienteNombre}`,
      html,
    })
    
    console.log("[v0] Notificacion de pedido enviada:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error al enviar notificacion:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}
