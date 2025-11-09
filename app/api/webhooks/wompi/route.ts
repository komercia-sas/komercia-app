import { NextRequest, NextResponse } from 'next/server';
import {
  sendOrderEmailNotifications,
  SimpleNotificationData,
} from '@/lib/simple-notifications';
import { getCompanyInfo, getOrders, Order, saveOrder } from '@/lib/vercel-blob';

// Validar firma de Wompi de forma asíncrona
async function validateWompiSignature(
  signature: string | null,
  payload: string
): Promise<boolean> {
  if (!signature || !payload) return false;

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    console.log('hashHex', hashHex);

    // Comparar con la firma recibida
    return signature === hashHex || signature.includes(hashHex);
  } catch {
    // Si falla la validación, en desarrollo permitimos continuar
    // En producción deberíamos ser más estrictos
    return process.env.NODE_ENV === 'development';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transaction = body.data?.transaction;

    if (!transaction) {
      console.warn('⚠️ Webhook sin datos de transacción');
      return NextResponse.json({ received: true });
    }

    // Validar firma de Wompi
    const signature =
      request.headers.get('X-Event-Checksum') || body.signature?.checksum;

    const integrityKey = process.env.WOMPI_EVENTS_KEY;

    let bodyText = '';

    const properties = body?.signature?.properties || [];
    properties.forEach((property: string) => {
      let propertyValue: Record<string, any> = body.data;
      property.split('.').forEach((innerProperty: string) => {
        propertyValue =
          propertyValue[innerProperty as keyof typeof propertyValue];
      });
      bodyText += `${propertyValue}`;
    });

    bodyText += `${body.timestamp}${integrityKey}`;

    if (signature) {
      console.log('signature', signature);
      console.log('bodyText', bodyText);

      const isValid = await validateWompiSignature(signature, bodyText);

      if (!isValid) {
        console.warn(
          '⚠️ Firma de webhook inválida - continuando en modo desarrollo'
        );
        // En producción, deberíamos rechazar
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          );
        }
      }
    } else if (!integrityKey) {
      console.warn(
        '⚠️ WOMPI_INTEGRITY_KEY no configurada - webhook sin validación'
      );
    }

    // Extraer datos del webhook
    const orderNumber = transaction.reference;
    const customerEmail =
      transaction.customer_data?.email || transaction.customer_email;
    const customerName =
      transaction.customer_data?.full_name ||
      transaction.customer_name ||
      'Cliente';
    const shippingAddress = transaction.shipping_address;
    const shippingCity = transaction.shipping_address?.city || '';
    const customerPhone = transaction.customer_data?.phone_number || '';
    const idNumber = transaction.customer_data?.legal_id || '';
    const idType = transaction.customer_data?.legal_id_type || '';
    const totalAmount = transaction.amount_in_cents
      ? transaction.amount_in_cents / 100
      : 0;

    const companyInfo = await getCompanyInfo();
    const orders = await getOrders();
    const order = orders.find((order: Order) => order.id === orderNumber);

    if (!order) {
      return NextResponse.json(
        { received: true, status: transaction.status },
        { status: 401 }
      );
    }

    const newOrder = {
      id: orderNumber,
      products: order?.products || [],
      total: totalAmount,
      status: transaction.status,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: shippingAddress?.address_line_1 || '',
        city: shippingCity,
        department: shippingAddress?.region || '',
        idNumber: idNumber,
        idType: idType,
        notes: shippingAddress?.address_line_2 || '',
      },
      updatedAt: new Date().toISOString(),
    };

    await saveOrder(newOrder);

    // Solo procesar pagos aprobados
    if (transaction.status !== 'APPROVED') {
      return NextResponse.json({ received: true, status: transaction.status });
    }

    // Construir datos para el email
    // Nota: Los items del carrito no están disponibles en el webhook
    const notificationData: SimpleNotificationData = {
      customerEmail,
      customerName,
      customerPhone,
      idNumber,
      idType,
      orderId: orderNumber,
      orderItems: order?.products || [],
      totalAmount,
      deliveryAddress: shippingAddress,
      deliveryCity: shippingCity,
      deliveryNotes: '',
      companyName: companyInfo.name,
      companyPhone: companyInfo.contact.phone,
      companyEmail: companyInfo.contact.email,
    };

    // Enviar notificaciones de email
    const results = await sendOrderEmailNotifications(notificationData);

    // Siempre retornar 200 para que Wompi sepa que procesamos el webhook
    // Incluso si falla el email, no queremos que Wompi reintente
    return NextResponse.json({
      received: true,
      processed: true,
      orderId: orderNumber,
      emailSent: results.customerEmail.success,
      order,
    });
  } catch (error) {
    console.error('❌ Error procesando webhook de Wompi:', error);

    // Retornar 200 para evitar reintentos de Wompi en caso de errores internos
    // Solo retornar error si es un problema de formato/validación
    return NextResponse.json(
      {
        received: true,
        error: 'Error procesando webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}
