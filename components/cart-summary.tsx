'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';

export function CartSummary() {
  const { cart, total, itemCount } = useCart();

  if (cart.length === 0) {
    return null;
  }

  return (
    <Card className='card-shadow sticky top-24'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <ShoppingBag className='h-5 w-5' />
          <span>Resumen del pedido</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Productos ({itemCount})</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='flex items-center space-x-1'>
              <Truck className='h-4 w-4' />
              <span>Envío</span>
            </span>
            <span className='text-green-600 font-medium'>CONTRA ENTREGA</span>
          </div>
          <p className='text-xs text-muted-foreground'>
            El costo de envío se paga al recibir el pedido y varía según la
            ubicación
          </p>
        </div>

        <Separator />

        <div className='flex justify-between text-lg font-bold'>
          <span>Total Productos</span>
          <span className='text-primary'>{formatPrice(total)}</span>
        </div>
        <p className='text-xs text-muted-foreground text-center'>
          + Envío contra entrega (costo variable según ubicación)
        </p>

        <Link href='/checkout' className='block'>
          <Button className='w-full btn-primary' size='lg'>
            Proceder al pago
          </Button>
        </Link>

        <div className='text-center'>
          <Link
            href='/catalogo'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Continuar comprando
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
