'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CartItem } from '@/components/cart-item';
import { CartSummary } from '@/components/cart-summary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

export default function CarritoPage() {
  const { cart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className='min-h-screen'>
        <Navbar />
        <div className='container mx-auto px-4 py-12'>
          <div className='text-center py-16'>
            <ShoppingCart className='h-24 w-24 text-muted-foreground mx-auto mb-6' />
            <h1 className='text-3xl font-bold mb-4'>Tu carrito está vacío</h1>
            <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
              Parece que aún no has agregado ningún producto a tu carrito.
              ¡Explora nuestro catálogo y encuentra la silla perfecta para ti!
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
        <div className='flex items-start justify-between mb-8'>
          <div>
            <Link href='/catalogo'>
              <Button variant='ghost' size='sm' className='mb-4'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Continuar comprando
              </Button>
            </Link>
            <div className='flex items-center space-x-3'>
              <h1 className='text-3xl font-bold'>Carrito de compras</h1>
              <Badge variant='secondary' className='mt-2'>
                {cart.length} productos
              </Badge>
            </div>
          </div>
          <Button
            variant='outline'
            onClick={clearCart}
            className='bg-transparent text-destructive'
          >
            Vaciar carrito
          </Button>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className='lg:col-span-1'>
            <CartSummary />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
