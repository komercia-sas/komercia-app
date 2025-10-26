'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    shortDescription: string;
    images: string[];
    category: string;
    inStock: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card className='group overflow-hidden card-shadow hover:shadow-lg transition-all duration-300'>
      <div className='relative overflow-hidden'>
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className='w-full h-64 object-cover product-image'
        />
        {!product.inStock && (
          <Badge className='absolute top-3 left-3 bg-destructive text-destructive-foreground'>
            Agotado
          </Badge>
        )}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />
        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <Link href={`/producto/${product.id}`}>
            <Button size='sm' variant='secondary' className='h-8 w-8 p-0'>
              <Eye className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className='p-6'>
        <div className='space-y-3'>
          <div>
            <Badge variant='outline' className='text-xs mb-2'>
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Badge>
            <h3 className='font-semibold text-lg text-balance'>
              {product.name}
            </h3>
            <p className='text-sm text-muted-foreground text-pretty line-clamp-2'>
              {product.shortDescription}
            </p>
          </div>

          <div className='flex items-center justify-between'>
            <div className='text-2xl font-bold text-primary'>
              {formatPrice(product.price)}
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className='btn-primary'
              size='sm'
            >
              <ShoppingCart className='h-4 w-4 mr-2' />
              {product.inStock ? 'Agregar' : 'Agotado'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
