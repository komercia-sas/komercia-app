'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Package,
  Truck,
  Phone,
  Mail,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';

export default function ConfirmacionPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    | 'Pago Pendiente'
    | 'Pagado'
    | 'Pago Rechazado'
    | 'Pendiente de Pago'
    | 'Pago Expirado'
    | 'Pago Cancelado'
    | 'Pago Fallido'
    | 'Pago aún en proceso'
  >('Pago Pendiente');
  const { companyInfo, loading } = useCompany();

  useEffect(() => {
    const transactionId = searchParams.get('id');

    if (transactionId) {
      validatePayment(transactionId);
    }
  }, [searchParams]);

  const statusToText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Pagado';
      case 'DECLINED':
        return 'Pago Rechazado';
      case 'PENDING':
        return 'Pago aún en proceso';
      case 'EXPIRED':
        return 'Pago Expirado';
      case 'VOIDED':
        return 'Pago Cancelado';
      case 'FAILED':
        return 'Pago Fallido';
      default:
        return 'Pago Pendiente';
    }
  };

  const validatePayment = async (transactionId: string) => {
    try {
      const response = await fetch(
        `https://sandbox.wompi.co/v1/transactions/${transactionId}`
      );
      const transaction = await response.json();
      setOrderInfo(transaction.data);
      setOrderNumber(transaction.data.reference);
      setPaymentStatus(statusToText(transaction.data.status));
    } catch (error) {
      console.error('Error validating payment:', error);
      setPaymentStatus('Pago Fallido');
    }
  };

  const nextSteps = [
    {
      icon: CheckCircle,
      title: 'Pedido Confirmado',
      description: 'Hemos recibido tu pedido y lo estamos procesando',
      status: 'completed',
    },
    {
      icon: Package,
      title: 'Preparación',
      description: 'Preparamos tu pedido para el envío (1-2 días hábiles)',
      status: 'current',
    },
    {
      icon: Truck,
      title: 'Envío',
      description: 'Tu pedido está en camino (1-2 días hábiles)',
      status: 'upcoming',
    },
  ];

  // Función para obtener el icono según el estado del pago
  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'Pagado':
        return <CheckCircle className='h-10 w-10 text-green-600' />;
      case 'Pago Rechazado':
      case 'Pago Cancelado':
      case 'Pago Fallido':
        return <XCircle className='h-10 w-10 text-red-600' />;
      case 'Pago aún en proceso':
        return <Clock className='h-10 w-10 text-yellow-600' />;
      case 'Pago Expirado':
        return <AlertCircle className='h-10 w-10 text-orange-600' />;
      default:
        return <Clock className='h-10 w-10 text-yellow-600' />;
    }
  };

  // Función para obtener el color de fondo del icono
  const getStatusIconBg = () => {
    switch (paymentStatus) {
      case 'Pagado':
        return 'bg-green-100';
      case 'Pago Rechazado':
      case 'Pago Cancelado':
      case 'Pago Fallido':
        return 'bg-red-100';
      case 'Pago aún en proceso':
        return 'bg-yellow-100';
      case 'Pago Expirado':
        return 'bg-orange-100';
      default:
        return 'bg-yellow-100';
    }
  };

  // Función para obtener el título según el estado
  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'Pagado':
        return '¡Pedido Confirmado!';
      case 'Pago Rechazado':
        return 'Pago Rechazado';
      case 'Pago Cancelado':
        return 'Pago Cancelado';
      case 'Pago Fallido':
        return 'Error en el Pago';
      case 'Pago aún en proceso':
        return 'Pago en Proceso';
      case 'Pago Expirado':
        return 'Pago Expirado';
      default:
        return 'Procesando Pago...';
    }
  };

  // Función para obtener la descripción según el estado
  const getStatusDescription = () => {
    switch (paymentStatus) {
      case 'Pagado':
        return 'Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos pronto.';
      case 'Pago Rechazado':
        return 'Tu pago fue rechazado. Por favor, intenta nuevamente o contacta con tu banco.';
      case 'Pago Cancelado':
        return 'El pago fue cancelado. Puedes intentar realizar el pago nuevamente.';
      case 'Pago Fallido':
        return 'Hubo un error procesando tu pago. Por favor, intenta nuevamente.';
      case 'Pago aún en proceso':
        return 'Tu pago está siendo procesado. Te notificaremos cuando se complete.';
      case 'Pago Expirado':
        return 'El tiempo para completar el pago ha expirado. Por favor, intenta nuevamente.';
      default:
        return 'Estamos procesando tu pago. Por favor, espera un momento.';
    }
  };

  // Función para obtener los pasos según el estado del pago
  const getOrderSteps = () => {
    if (paymentStatus === 'Pagado') {
      return nextSteps;
    }

    // Para estados de pago no exitoso, solo mostrar el primer paso
    return [
      {
        icon: CheckCircle,
        title: 'Pedido Recibido',
        description: 'Hemos recibido tu solicitud de pedido',
        status: 'completed',
      },
      {
        icon: Clock,
        title: 'Esperando Pago',
        description: 'Esperando confirmación del pago',
        status: 'current',
      },
      {
        icon: Package,
        title: 'Preparación',
        description: 'Se iniciará una vez confirmado el pago',
        status: 'upcoming',
      },
    ];
  };

  return (
    <main className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='mb-8'>
            <div
              className={`w-20 h-20 ${getStatusIconBg()} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {getStatusIcon()}
            </div>
            <h1 className='text-3xl font-bold mb-2'>{getStatusTitle()}</h1>
            <p className='text-muted-foreground'>{getStatusDescription()}</p>
          </div>

          {/* Order Details */}
          <Card className='card-shadow mb-8'>
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Número de Pedido:</span>
                <Badge variant='secondary' className='text-lg px-3 py-1'>
                  {orderNumber}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Fecha:</span>
                <span>{new Date().toLocaleDateString('es-CO')}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Estado:</span>
                <Badge
                  className={
                    paymentStatus === 'Pagado'
                      ? 'bg-green-100 text-green-800'
                      : paymentStatus === 'Pago Rechazado' ||
                          paymentStatus === 'Pago Cancelado' ||
                          paymentStatus === 'Pago Fallido'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {paymentStatus}
                </Badge>
              </div>
              {orderInfo?.amount_in_cents && (
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>Total:</span>
                  <span className='font-bold text-lg'>
                    ${orderInfo.amount_in_cents.toLocaleString('es-CO')} COP
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Progress */}
          <Card className='card-shadow mb-8'>
            <CardHeader>
              <CardTitle>Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {getOrderSteps().map((step, index) => (
                  <div key={index} className='flex items-start space-x-4'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : step.status === 'current'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <step.icon className='h-5 w-5' />
                    </div>
                    <div className='flex-1 text-left'>
                      <h3 className='font-semibold'>{step.title}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {!loading && companyInfo && (
            <Card className='card-shadow mb-8'>
              <CardHeader>
                <CardTitle>¿Necesitas ayuda?</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>
                  Si tienes alguna pregunta sobre tu pedido, no dudes en
                  contactarnos:
                </p>
                <div className='grid md:grid-cols-3 gap-4'>
                  <div className='text-center p-4 bg-muted/30 rounded-lg'>
                    <Phone className='h-6 w-6 text-primary mx-auto mb-2' />
                    <div className='text-sm font-medium'>Teléfono</div>
                    <div className='text-xs text-muted-foreground'>
                      {companyInfo.contact.phone}
                    </div>
                  </div>
                  <div className='text-center p-4 bg-muted/30 rounded-lg'>
                    <Mail className='h-6 w-6 text-primary mx-auto mb-2' />
                    <div className='text-sm font-medium'>Email</div>
                    <div className='text-xs text-muted-foreground'>
                      {companyInfo.contact.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            {paymentStatus === 'Pagado' ? (
              <>
                <Link href='/catalogo'>
                  <Button variant='outline' className='bg-transparent'>
                    Seguir Comprando
                  </Button>
                </Link>
                <Link href='/'>
                  <Button className='btn-primary'>Volver al Inicio</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href='/checkout'>
                  <Button className='btn-primary'>
                    {paymentStatus === 'Pago Rechazado' ||
                    paymentStatus === 'Pago Cancelado' ||
                    paymentStatus === 'Pago Fallido' ||
                    paymentStatus === 'Pago Expirado'
                      ? 'Intentar Pago Nuevamente'
                      : 'Volver al Checkout'}
                  </Button>
                </Link>
                <Link href='/catalogo'>
                  <Button variant='outline' className='bg-transparent'>
                    Seguir Comprando
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className='mt-8 p-6 bg-muted/30 rounded-lg'>
            <h3 className='font-semibold mb-2'>Información Importante</h3>
            <ul className='text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto'>
              {paymentStatus === 'Pagado' ? (
                <>
                  <li>
                    • Recibirás un email de confirmación con los detalles de tu
                    pedido
                  </li>
                  <li>
                    • Te notificaremos cuando tu pedido esté listo para envío
                  </li>
                  <li>
                    • El tiempo de entrega es de 2-4 días hábiles en Bucaramanga
                  </li>
                  <li>
                    • El costo de envío se paga contra entrega y varía según la
                    ubicación
                  </li>
                  <li>
                    • Puedes rastrear tu pedido con el número proporcionado
                  </li>
                </>
              ) : (
                <>
                  <li>• Tu pedido está pendiente de confirmación de pago</li>
                  <li>
                    • Una vez confirmado el pago, comenzaremos la preparación
                  </li>
                  <li>• Recibirás notificaciones por email sobre el estado</li>
                  <li>
                    • Si tienes problemas con el pago, contacta con tu banco
                  </li>
                  <li>
                    • Puedes intentar el pago nuevamente desde el checkout
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
