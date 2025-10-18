'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, ShoppingCart, Phone } from 'lucide-react';
import { companyInfo } from '@/data/company';
import { useCart } from '@/hooks/use-cart';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center h-full'>
            <img
              src='/logo_comercializadora_komercia.png'
              alt='Logo'
              width={150}
              height={75}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            <Link
              href={`tel:${companyInfo.contact.phone}`}
              className='hidden sm:flex'
            >
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-foreground'
              >
                <Phone className='h-4 w-4 mr-2' />
                {companyInfo.contact.phone}
              </Button>
            </Link>

            <Link href='/carrito' className='relative'>
              <Button variant='ghost' size='sm'>
                <ShoppingCart className='h-4 w-4' />
                {itemCount > 0 && (
                  <Badge className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs'>
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className='md:hidden'>
                <Button variant='ghost' size='sm'>
                  <Menu className='h-4 w-4' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                <div className='flex flex-col space-y-4 mt-8'>
                  {navigation.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='text-lg font-medium text-foreground hover:text-primary transition-colors'
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className='pt-4 border-t'>
                    <Link href={`tel:${companyInfo.contact.phone}`}>
                      <Button
                        variant='outline'
                        className='w-full justify-start bg-transparent'
                      >
                        <Phone className='h-4 w-4 mr-2' />
                        {companyInfo.contact.phone}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
