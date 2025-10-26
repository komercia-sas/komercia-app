'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Truck,
  Shield,
  HeadphonesIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/lib/vercel-blob';

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setProduct(
          data.find(
            (product: Product) => product.id === parseInt(params.id as string)
          )
        );
      });
  }, [params.id]);

  if (!product) {
    return (
      <main className='min-h-screen'>
        <Navbar />
        <div className='flex flex-col items-center justify-center h-[calc(100vh-250px)]'>
          <h1 className='text-2xl font-bold mb-4'>Producto no encontrado</h1>
          <Link href='/catalogo'>
            <Button>Volver al catálogo</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const benefits = [
    {
      icon: Truck,
      title: 'Envío gratuito',
      description: 'En Bogotá y área metropolitana',
    },
    {
      icon: Shield,
      title: 'Garantía extendida',
      description: 'Hasta 5 años de garantía',
    },
    {
      icon: HeadphonesIcon,
      title: 'Soporte técnico',
      description: 'Asesoría especializada',
    },
  ];

  return (
    <main className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <div className='flex items-center space-x-2 text-sm text-muted-foreground mb-8'>
          <Link href='/catalogo' className='hover:text-foreground'>
            <Button variant='ghost' size='sm' className='p-0 h-auto'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver al catálogo
            </Button>
          </Link>
        </div>

        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Product Images */}
          <div className='space-y-4'>
            <div className='aspect-square overflow-hidden rounded-2xl card-shadow'>
              <img
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='grid grid-cols-3 gap-4'>
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`${product.name} ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <Badge variant='outline' className='mb-3'>
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </Badge>
              <h1 className='text-3xl font-bold mb-4 text-balance'>
                {product.name}
              </h1>
              <p className='text-lg text-muted-foreground text-pretty'>
                {product.shortDescription}
              </p>
            </div>

            <div className='text-4xl font-bold text-primary'>
              {formatPrice(product.price)}
            </div>

            {product.inStock ? (
              <div className='flex items-center space-x-2 text-green-600'>
                <Check className='h-5 w-5' />
                <span className='font-medium'>En stock</span>
              </div>
            ) : (
              <div className='text-destructive font-medium'>
                Producto agotado
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {product.inStock && (
              <div className='space-y-4'>
                <div className='flex items-center space-x-4'>
                  <label className='font-medium'>Cantidad:</label>
                  <div className='flex items-center border rounded-lg'>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-3 py-2 hover:bg-muted'
                    >
                      -
                    </button>
                    <span className='px-4 py-2 border-x'>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className='px-3 py-2 hover:bg-muted'
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size='lg'
                  className='w-full btn-primary'
                >
                  <ShoppingCart className='h-5 w-5 mr-2' />
                  Agregar al carrito
                </Button>
              </div>
            )}

            {/* Benefits */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className='text-center p-4 rounded-lg bg-muted/30'
                >
                  <benefit.icon className='h-6 w-6 text-primary mx-auto mb-2' />
                  <div className='text-sm font-medium'>{benefit.title}</div>
                  <div className='text-xs text-muted-foreground'>
                    {benefit.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className='mt-16 space-y-8'>
          <Separator />

          <div className='grid lg:grid-cols-2 gap-12'>
            <Card className='card-shadow'>
              <CardContent className='p-6'>
                <h2 className='text-2xl font-bold mb-4'>Descripción</h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {product.longDescription}
                </p>
              </CardContent>
            </Card>

            <Card className='card-shadow'>
              <CardContent className='p-6'>
                <h2 className='text-2xl font-bold mb-4'>Características</h2>
                <ul className='space-y-3'>
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className='flex items-start space-x-3'>
                      <Check className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                      <span className='text-muted-foreground'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
