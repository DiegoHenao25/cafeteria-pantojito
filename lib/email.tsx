import { Resend } from "resend"

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email de origen - usa onboarding@resend.dev para pruebas
// Para produccion, necesitas verificar tu dominio en Resend
const FROM_EMAIL = process.env.EMAIL_FROM || "Pantojitos <onboarding@resend.dev>"

// Funcion para enviar codigo de verificacion (registro)
export async function sendVerificationCode(email: string, code: string) {
  try {
    console.log("[v0] Enviando codigo de verificacion a:", email)
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Codigo de verificacion - Pantojitos",
      html: `
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
      `,
    })

    if (error) {
      console.error("[v0] Error de Resend:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Correo enviado exitosamente:", data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("[v0] Error al enviar correo:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

// Funcion para enviar codigo de recuperacion de contrasena
export async function sendPasswordResetCode(email: string, code: string) {
  try {
    console.log("[v0] Enviando codigo de recuperacion a:", email)
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Recuperacion de contrasena - Pantojitos",
      html: `
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
                <strong>Importante:</strong> Si no solicitaste restablecer tu contrasena, ignora este correo. Tu cuenta permanecera segura.
              </div>
              <div class="footer">
                <p>Este es un correo automatico, por favor no respondas.</p>
                <p>2025 Pantojitos. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Error de Resend:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Correo de recuperacion enviado:", data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("[v0] Error al enviar correo de recuperacion:", error)
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
}) {
  try {
    const staffEmail = process.env.STAFF_EMAIL || process.env.EMAIL_USER
    if (!staffEmail) {
      console.log("[v0] No hay email de staff configurado")
      return { success: false, error: "No staff email configured" }
    }

    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.nombre}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.precio.toLocaleString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${(item.precio * item.cantidad).toLocaleString()}</td>
        </tr>
      `
      )
      .join("")

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: staffEmail,
      subject: `Nuevo Pedido #${orderData.orderNumber} - ${orderData.clienteNombre}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #fff5f5; margin: 0; padding: 20px; }
              .container { max-width: 700px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #92400e 0%, #f472b6 100%); padding: 30px; border-radius: 10px; color: white; }
              h1 { margin: 0; font-size: 28px; }
              .order-number { background-color: #fff; color: #92400e; padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-weight: bold; }
              .section { margin: 25px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #f472b6; }
              .section-title { color: #92400e; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
              .info-grid { display: grid; grid-template-columns: 140px 1fr; gap: 10px; }
              .info-label { font-weight: bold; color: #666; }
              .info-value { color: #333; }
              .time-badge { background-color: #f472b6; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; font-size: 16px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th { background-color: #92400e; color: white; padding: 12px; text-align: left; }
              .total-row { background-color: #f0f0f0; font-weight: bold; font-size: 18px; }
              .total-amount { color: #4CAF50; font-size: 24px; }
              .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
              .urgent { background-color: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Nuevo Pedido Recibido</h1>
                <div class="order-number">Pedido #${orderData.orderNumber}</div>
              </div>
              
              <div class="urgent">
                <strong>TIEMPO DE PREPARACION:</strong> 
                <span class="time-badge">${orderData.tiempoRecogida} MINUTOS</span>
              </div>

              <div class="section">
                <div class="section-title">Informacion del Cliente</div>
                <div class="info-grid">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">${orderData.clienteNombre}</span>
                  <span class="info-label">Cedula:</span>
                  <span class="info-value">${orderData.clienteCedula}</span>
                  <span class="info-label">Telefono:</span>
                  <span class="info-value">${orderData.clienteTelefono}</span>
                  <span class="info-label">Correo:</span>
                  <span class="info-value">${orderData.clienteCorreo}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Detalles del Pedido</div>
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
                <div class="section-title">Metodo de Pago</div>
                <div style="text-align: center; padding: 10px;">
                  <span style="background-color: #4CAF50; color: white; padding: 6px 12px; border-radius: 15px;">${orderData.metodoPago.toUpperCase()}</span>
                </div>
              </div>

              <div class="footer">
                <p>Este es un correo automatico del sistema de pedidos.</p>
                <p>Pantojitos - ${new Date().toLocaleString("es-CO")}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Error de Resend:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Notificacion enviada al staff:", data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("[v0] Error al enviar notificacion al staff:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}
