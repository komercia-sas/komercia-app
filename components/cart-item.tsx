'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    images: string[];
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card className='card-shadow'>
      <CardContent className='p-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Product Image */}
          <div className='flex-shrink-0'>
            <Link href={`/producto/${item.id}`}>
              <img
                src={item.images[0] || '/placeholder.svg'}
                alt={item.name}
                className='w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity'
              />
            </Link>
          </div>

          {/* Product Info */}
          <div className='flex-1 space-y-2'>
            <Link
              href={`/producto/${item.id}`}
              className='hover:text-primary transition-colors'
            >
              <h3 className='font-semibold text-lg text-balance'>
                {item.name}
              </h3>
            </Link>
            <div className='text-xl font-bold text-primary'>
              {formatPrice(item.price)}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <div className='flex items-center border rounded-lg'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className='h-10 w-10 p-0'
              >
                <Minus className='h-4 w-4' />
              </Button>
              <span className='px-4 py-2 min-w-[3rem] text-center'>
                {item.quantity}
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className='h-10 w-10 p-0'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {/* Subtotal and Remove */}
            <div className='flex flex-col items-end space-y-2'>
              <div className='text-lg font-semibold'>
                {formatPrice(item.price * item.quantity)}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeFromCart(item.id)}
                className='text-destructive hover:text-destructive hover:bg-destructive/10'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
