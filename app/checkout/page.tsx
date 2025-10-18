'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CheckoutForm } from '@/components/checkout-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/carrito');
    }
  }, [cart, router]);

  const handleOrderSubmit = async (orderData: any) => {
    setIsLoading(true);

    try {
      // Simular procesamiento del pedido
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar número de pedido
      const orderNumber = `CK-${Date.now()}`;

      // Limpiar carrito
      clearCart();

      // Redirigir a página de confirmación
      router.push(`/confirmacion?pedido=${orderNumber}`);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className='min-h-screen'>
        <Navbar />
        <div className='container mx-auto px-4 py-12'>
          <div className='text-center py-16'>
            <ShoppingCart className='h-24 w-24 text-muted-foreground mx-auto mb-6' />
            <h1 className='text-3xl font-bold mb-4'>
              No hay productos en el carrito
            </h1>
            <p className='text-muted-foreground mb-8'>
              Agrega productos a tu carrito antes de proceder al checkout.
            </p>
            <Link href='/catalogo'>
              <Button className='btn-primary' size='lg'>
                Ver catálogo
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Link href='/carrito'>
            <Button variant='ghost' size='sm' className='mb-4'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver al carrito
            </Button>
          </Link>
          <div className='flex items-center space-x-3'>
            <h1 className='text-3xl font-bold'>Finalizar Compra</h1>
            <Badge variant='secondary'>Paso 2 de 2</Badge>
          </div>
          <p className='text-muted-foreground mt-2'>
            Completa la información para procesar tu pedido de forma segura
          </p>
        </div>

        {/* Progress Steps */}
        <div className='flex items-center justify-center mb-8'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                ✓
              </div>
              <span className='text-sm font-medium'>Carrito</span>
            </div>
            <div className='w-12 h-0.5 bg-primary' />
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                2
              </div>
              <span className='text-sm font-medium'>Checkout</span>
            </div>
            <div className='w-12 h-0.5 bg-muted' />
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold'>
                3
              </div>
              <span className='text-sm font-medium text-muted-foreground'>
                Confirmación
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className='max-w-2xl mx-auto'>
          {isLoading ? (
            <div className='text-center py-16'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
              <h3 className='text-lg font-semibold mb-2'>
                Procesando tu pedido...
              </h3>
              <p className='text-muted-foreground'>
                Por favor espera mientras confirmamos tu compra
              </p>
            </div>
          ) : (
            <CheckoutForm onSubmit={handleOrderSubmit} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
