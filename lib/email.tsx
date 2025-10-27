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
}) {
  try {
    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.nombre}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.precio.toLocaleString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${(item.precio * item.cantidad).toLocaleString()}</td>
        </tr>
      `,
      )
      .join("")

    const mailOptions = {
      from: `"Cafetería Pantojito - Sistema" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Email del staff de la cafetería
      subject: `🔔 Nuevo Pedido #${orderData.orderNumber} - ${orderData.clienteNombre}`,
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
                max-width: 700px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                background: linear-gradient(135deg, #8b4513 0%, #d2691e 100%);
                padding: 30px;
                border-radius: 10px;
                color: white;
              }
              .logo {
                font-size: 48px;
                margin-bottom: 10px;
              }
              h1 {
                margin: 0;
                font-size: 28px;
              }
              .order-number {
                background-color: #fff;
                color: #8b4513;
                padding: 10px 20px;
                border-radius: 20px;
                display: inline-block;
                margin-top: 10px;
                font-weight: bold;
              }
              .section {
                margin: 25px 0;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
                border-left: 4px solid #8b4513;
              }
              .section-title {
                color: #8b4513;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 140px 1fr;
                gap: 10px;
              }
              .info-label {
                font-weight: bold;
                color: #666;
              }
              .info-value {
                color: #333;
              }
              .time-badge {
                background-color: #ff6b35;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                font-weight: bold;
                font-size: 16px;
              }
              .payment-badge {
                background-color: #4CAF50;
                color: white;
                padding: 6px 12px;
                border-radius: 15px;
                display: inline-block;
                font-size: 14px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
              }
              th {
                background-color: #8b4513;
                color: white;
                padding: 12px;
                text-align: left;
              }
              .total-row {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 18px;
              }
              .total-amount {
                color: #4CAF50;
                font-size: 24px;
              }
              .footer {
                text-align: center;
                color: #999;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
              }
              .urgent {
                background-color: #fff3cd;
                border: 2px solid #ffc107;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">☕</div>
                <h1>Nuevo Pedido Recibido</h1>
                <div class="order-number">Pedido #${orderData.orderNumber}</div>
              </div>
              
              <div class="urgent">
                <strong>⏰ TIEMPO DE PREPARACIÓN:</strong> 
                <span class="time-badge">${orderData.tiempoRecogida} MINUTOS</span>
              </div>

              <div class="section">
                <div class="section-title">
                  👤 Información del Cliente
                </div>
                <div class="info-grid">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">${orderData.clienteNombre}</span>
                  
                  <span class="info-label">Cédula:</span>
                  <span class="info-value">${orderData.clienteCedula}</span>
                  
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">${orderData.clienteTelefono}</span>
                  
                  <span class="info-label">Correo:</span>
                  <span class="info-value">${orderData.clienteCorreo}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">
                  🛍️ Detalles del Pedido
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th style="text-align: center;">Cantidad</th>
                      <th style="text-align: right;">Precio Unit.</th>
                      <th style="text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td colspan="3" style="padding: 15px; text-align: right;">TOTAL:</td>
                      <td style="padding: 15px; text-align: right;" class="total-amount">$${orderData.total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="section">
                <div class="section-title">
                  💳 Método de Pago
                </div>
                <div style="text-align: center; padding: 10px;">
                  <span class="payment-badge">${orderData.metodoPago.toUpperCase()}</span>
                </div>
              </div>

              <div class="footer">
                <p>Este es un correo automático del sistema de pedidos.</p>
                <p>Cafetería Pantojito - ${new Date().toLocaleString("es-CO")}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("[v0] Notificación enviada al staff:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error al enviar notificación al staff:", error)
    throw error
  }
}
