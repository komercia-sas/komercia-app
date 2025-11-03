// Sistema de notificaciones simplificado - Solo email
// lib/simple-notifications.ts

import { Resend } from 'resend';

export interface SimpleNotificationData {
  // Datos del comprador
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  idNumber: string;
  idType: string;

  // Datos del pedido
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;

  // Datos de entrega
  deliveryAddress: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    phone_number: string;
    region: string;
    country: string;
  };
  deliveryCity: string;
  deliveryNotes?: string;

  // Datos de la empresa
  companyName: string;
  companyPhone: string;
  companyEmail: string;
}

export interface SimpleNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  attempts: number;
}

// Configuración simple de reintentos
const RETRY_CONFIG = {
  maxAttempts: 3,
  delayMs: 2000, // 2 segundos entre reintentos
};

// Función para enviar email usando Resend
export async function sendSimpleEmailNotification(
  data: SimpleNotificationData
): Promise<SimpleNotificationResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailTemplate = generateSimpleEmailTemplate(data);

    const result = await resend.emails.send({
      from: `${data.companyName} <${process.env.FROM_EMAIL}>`,
      to: [data.customerEmail],
      subject: `Confirmación de Pedido #${data.orderId}`,
      html: emailTemplate,
    });

    console.log('Email sent successfully', result);

    return {
      success: true,
      messageId: result.data?.id,
      attempts: 1,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      attempts: 1,
    };
  }
}

// Función para enviar email con reintentos locales
export async function sendEmailWithRetries(
  data: SimpleNotificationData
): Promise<SimpleNotificationResult> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
    console.log(
      `📧 Intento ${attempt}/${RETRY_CONFIG.maxAttempts} para pedido ${data.orderId}`
    );

    const result = await sendSimpleEmailNotification(data);

    if (result.success) {
      console.log(`✅ Email enviado exitosamente en intento ${attempt}`);
      return {
        ...result,
        attempts: attempt,
      };
    }

    lastError = result.error;
    console.log(`❌ Intento ${attempt} falló: ${lastError}`);

    // Si no es el último intento, esperar antes del siguiente
    if (attempt < RETRY_CONFIG.maxAttempts) {
      console.log(
        `⏳ Esperando ${RETRY_CONFIG.delayMs}ms antes del siguiente intento...`
      );
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delayMs));
    }
  }

  console.log(`❌ Todos los intentos fallaron para pedido ${data.orderId}`);
  return {
    success: false,
    error: lastError || 'Todos los intentos fallaron',
    attempts: RETRY_CONFIG.maxAttempts,
  };
}

// Función para enviar notificación a la empresa
export async function sendCompanyEmailNotification(
  data: SimpleNotificationData
): Promise<SimpleNotificationResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const companyTemplate = generateSimpleCompanyEmailTemplate(data);

    const result = await resend.emails.send({
      from: `Sistema Komercia <${process.env.FROM_EMAIL}>`,
      to: [data.companyEmail],
      subject: `Nuevo Pedido #${data.orderId} - ${data.customerName}`,
      html: companyTemplate,
    });

    return {
      success: true,
      messageId: result.data?.id,
      attempts: 1,
    };
  } catch (error) {
    console.error('Error sending company email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      attempts: 1,
    };
  }
}

// Función principal para enviar todas las notificaciones de email
export async function sendOrderEmailNotifications(
  data: SimpleNotificationData
): Promise<{
  customerEmail: SimpleNotificationResult;
  companyEmail: SimpleNotificationResult;
}> {
  console.log(
    `📧 Enviando notificaciones de email para pedido ${data.orderId}`
  );

  // Enviar notificaciones en paralelo
  const [customerResult, companyResult] = await Promise.allSettled([
    sendEmailWithRetries(data),
    sendCompanyEmailNotification(data),
  ]);

  return {
    customerEmail:
      customerResult.status === 'fulfilled'
        ? customerResult.value
        : {
            success: false,
            error: 'Customer email notification failed',
            attempts: 0,
          },
    companyEmail:
      companyResult.status === 'fulfilled'
        ? companyResult.value
        : {
            success: false,
            error: 'Company email notification failed',
            attempts: 0,
          },
  };
}

// Template de email simplificado para el cliente
function generateSimpleEmailTemplate(data: SimpleNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Pedido</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .content { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #2c5aa0; margin-top: 10px; }
        .footer { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; }
        .highlight { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>¡Pedido Confirmado!</h1>
        <h2>Hola ${data.customerName},</h2>
      </div>
      <div class="customer-info">
        <h3>👤 Información de facturación:</h3>
        <p><strong>Nombre:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Teléfono:</strong> ${data.customerPhone}</p>
        <p><strong>Número de identificación:</strong> ${data.idNumber}</p>
        <p><strong>Tipo de identificación:</strong> ${data.idType}</p>
      </div>
      <div class="content">
        <h2>Pedido #${data.orderId}</h2>
        
        <div class="highlight">
          <h3>📦 Productos:</h3>
          ${
            data.orderItems && data.orderItems.length > 0
              ? data.orderItems
                  .map(
                    item => `
            <div class="item">
              <span>${item.name} x ${item.quantity}UNIDADES = ${item.quantity * item.price}</span>
            </div>
          `
                  )
                  .join('')
              : '<p><em>Los detalles de los productos serán procesados y confirmados próximamente.</em></p>'
          }
          
          ${
            data.totalAmount > 0
              ? `
          <div class="item total">
            <span>Total:</span>
            <span>$${data.totalAmount.toLocaleString()}</span>
          </div>
          `
              : ''
          }
        </div>
        
        <div class="highlight">
          <h3>📍 Información de Entrega:</h3>
          <p><strong>Dirección:</strong> ${data.deliveryAddress?.address_line_1}</p>
          <p><strong>Datos adicionales:</strong> ${data.deliveryAddress?.address_line_2}</p>
          <p><strong>Ciudad:</strong> ${data.deliveryCity}</p>
          <p><strong>Teléfono:</strong> ${data.deliveryAddress?.phone_number}</p>
          <p><strong>Departamento:</strong> ${data.deliveryAddress?.region}</p>
          ${data.deliveryNotes ? `<p><strong>Notas:</strong> ${data.deliveryNotes}</p>` : ''}
        </div>
      </div>
      
      <div class="footer">
        <p><strong>${data.companyName}</strong></p>
        <p>📞 Teléfono: ${data.companyPhone}</p>
        <p>📧 Email: ${data.companyEmail}</p>
        <p><em>El envío es gratuito en Bucaramanga y área metropolitana,
                    en otras ciudades se paga contra entrega y varía según la
                    ubicación.</em></p>
      </div>
    </body>
    </html>
  `;
}

// Template de email simplificado para la empresa
function generateSimpleCompanyEmailTemplate(
  data: SimpleNotificationData
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nuevo Pedido</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .content { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #2c5aa0; margin-top: 10px; }
        .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛒 Nuevo Pedido Recibido</h1>
        <p>Se ha recibido un nuevo pedido en tu tienda online.</p>
      </div>
      
      <div class="content">
        <h2>Pedido #${data.orderId}</h2>
        
        <div class="customer-info">
          <h3>👤 Información del Cliente:</h3>
          <p><strong>Nombre:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Teléfono:</strong> ${data.customerPhone}</p>
          <p><strong>Número de identificación:</strong> ${data.idNumber}</p>
          <p><strong>Tipo de identificación:</strong> ${data.idType}</p>
        </div>
        
        <div class="highlight">
          <h3>📦 Productos Solicitados:</h3>
          ${
            data.orderItems && data.orderItems.length > 0
              ? data.orderItems
                  .map(
                    item => `
            <div class="item">
              <span>${item.name} x ${item.quantity} UNIDADES = ${item.quantity * item.price}</span>
            </div>
          `
                  )
                  .join('')
              : '<p><em>Revisa el pedido en el dashboard para ver los detalles completos de los productos.</em></p>'
          }
          
          ${
            data.totalAmount > 0
              ? `
          <div class="item total">
            <span>Total:</span>
            <span>$${data.totalAmount.toLocaleString()}</span>
          </div>
          `
              : ''
          }
        </div>
        
        <div class="highlight">
          <h3>📍 Dirección de Entrega:</h3>
          <p><strong>Dirección:</strong> ${data.deliveryAddress?.address_line_1}</p>
          <p><strong>Datos adicionales:</strong> ${data.deliveryAddress?.address_line_2 ?? 'No hay datos adicionales'}</p>
          <p><strong>Teléfono:</strong> ${data.deliveryAddress?.phone_number}</p>
          <p><strong>Departamento:</strong> ${data.deliveryAddress?.region}</p>
          <p><strong>Ciudad:</strong> ${data.deliveryCity}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
