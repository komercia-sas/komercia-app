'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Phone, Mail, Home } from 'lucide-react';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';

export default function ConfirmacionPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const { companyInfo, loading } = useCompany();

  useEffect(() => {
    const pedido = searchParams.get('pedido');
    if (pedido) {
      setOrderNumber(pedido);
    }
  }, [searchParams]);

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

  return (
    <main className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto text-center'>
          {/* Success Icon */}
          <div className='mb-8'>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='h-10 w-10 text-green-600' />
            </div>
            <h1 className='text-3xl font-bold mb-2'>¡Pedido Confirmado!</h1>
            <p className='text-muted-foreground'>
              Gracias por tu compra. Hemos recibido tu pedido y lo procesaremos
              pronto.
            </p>
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
                <Badge className='bg-green-100 text-green-800'>
                  Confirmado
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Progress */}
          <Card className='card-shadow mb-8'>
            <CardHeader>
              <CardTitle>Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {nextSteps.map((step, index) => (
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
                  <div className='text-center p-4 bg-muted/30 rounded-lg'>
                    <Home className='h-6 w-6 text-primary mx-auto mb-2' />
                    <div className='text-sm font-medium'>Tienda</div>
                    <div className='text-xs text-muted-foreground'>
                      Lun-Vie 8AM-6PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/catalogo'>
              <Button variant='outline' className='bg-transparent'>
                Seguir Comprando
              </Button>
            </Link>
            <Link href='/'>
              <Button className='btn-primary'>Volver al Inicio</Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className='mt-8 p-6 bg-muted/30 rounded-lg'>
            <h3 className='font-semibold mb-2'>Información Importante</h3>
            <ul className='text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto'>
              <li>
                • Recibirás un email de confirmación con los detalles de tu
                pedido
              </li>
              <li>• Te notificaremos cuando tu pedido esté listo para envío</li>
              <li>• El tiempo de entrega es de 2-4 días hábiles en Bogotá</li>
              <li>• Puedes rastrear tu pedido con el número proporcionado</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
