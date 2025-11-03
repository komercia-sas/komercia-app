'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useEffect } from 'react';

interface CartNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    quantity: number;
  } | null;
}

export function CartNotificationPanel({
  isOpen,
  onClose,
  product,
}: CartNotificationPanelProps) {
  // Auto-cerrar después de 10 segundos
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <div className='flex flex-col items-center space-y-4 p-2'>
          {/* Icono de éxito */}
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle className='h-6 w-6 text-green-600' />
          </div>

          {/* Mensaje */}
          <div className='text-center space-y-2'>
            <h3 className='text-lg font-semibold'>
              ¡Producto agregado al carrito!
            </h3>
            <p className='text-sm text-muted-foreground'>
              Tu producto se agregó correctamente
            </p>
          </div>

          {/* Información del producto */}
          <div className='w-full border rounded-lg p-4 bg-muted/30'>
            <div className='flex items-center space-x-4'>
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                className='h-16 w-16 rounded-md object-cover'
              />
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-sm truncate'>{product.name}</p>
                <p className='text-xs text-muted-foreground'>
                  Cantidad: {product.quantity}
                </p>
                <p className='text-sm font-semibold text-primary mt-1'>
                  {formatPrice(product.price * product.quantity)}
                </p>
              </div>
            </div>
          </div>

          {/* Botón para ir al carrito */}
          <Link href='/carrito' className='w-full' onClick={onClose}>
            <Button className='w-full btn-primary' size='lg'>
              <ShoppingBag className='h-4 w-4 mr-2' />
              Ver carrito
            </Button>
          </Link>

          {/* Botón para continuar comprando */}
          <button
            onClick={onClose}
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Continuar comprando
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
