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
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setProduct(
          data.find(
            (product: Product) => product.id === parseInt(params.id as string)
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  if (isLoading) {
    return (
      <main className='min-h-screen'>
        <Navbar />
        <div className='flex flex-col items-center justify-center h-[calc(100vh-250px)]'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
        </div>
      </main>
    );
  }

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

  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      prev => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            <div className='relative group aspect-square overflow-hidden rounded-2xl card-shadow'>
              <img
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                className='w-full h-full object-cover cursor-pointer'
                onClick={openModal}
              />

              {/* Botón izquierdo */}
              <button
                onClick={prevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg px-4 py-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105'
              >
                <ChevronLeft className='h-6 w-6' />
              </button>

              {/* Botón derecho */}
              <button
                onClick={nextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg px-4 py-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105'
              >
                <ChevronRight className='h-6 w-6' />
              </button>

              {/* Botón pantalla completa */}
              <button
                onClick={openModal}
                className='absolute top-4 right-4 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105'
              >
                <Maximize2 className='h-5 w-5' />
              </button>

              {/* Indicador de imagen actual */}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                {selectedImage + 1} / {product.images.length}
              </div>
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

      {/* Modal de imagen en pantalla completa */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'>
          <div className='relative max-w-7xl max-h-full w-full h-full flex items-center justify-center'>
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 z-10 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg px-3 py-2 shadow-lg transition-all duration-300 hover:scale-105'
            >
              <X className='h-6 w-6' />
            </button>

            {/* Botón anterior */}
            <button
              onClick={prevImage}
              className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105'
            >
              <ChevronLeft className='h-8 w-8' />
            </button>

            {/* Botón siguiente */}
            <button
              onClick={nextImage}
              className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105'
            >
              <ChevronRight className='h-8 w-8' />
            </button>

            {/* Imagen */}
            <img
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              className='max-w-full max-h-full object-contain'
            />

            {/* Indicador */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-lg'>
              {selectedImage + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
