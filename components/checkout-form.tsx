'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck, MapPin, User } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import WompiWidget from '@/components/WompiWidget';
import { WompiLogo } from '@/components/wompi-logo';

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { cart, total } = useCart();
  const [formData, setFormData] = useState({
    // Información personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Dirección de envío
    address: '',
    city: '',
    department: '',
    postalCode: '',
    // Método de pago (solo Wompi)
    paymentMethod: 'wompi',
    // Notas adicionales
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const orderNumber = `ORD-${Date.now()}`;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form className='space-y-6'>
      {/* Información Personal */}
      <Card className='card-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <User className='h-5 w-5' />
            <span>Información Personal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='firstName'>Nombre *</Label>
              <Input
                id='firstName'
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='lastName'>Apellido *</Label>
              <Input
                id='lastName'
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className='text-sm text-destructive mt-1'>{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor='phone'>Teléfono *</Label>
              <Input
                id='phone'
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder='+57 300 123 4567'
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className='text-sm text-destructive mt-1'>{errors.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección de Envío */}
      <Card className='card-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <MapPin className='h-5 w-5' />
            <span>Dirección de Envío</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='address'>Dirección completa *</Label>
            <Input
              id='address'
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              placeholder='Calle 123 #45-67, Apartamento 101'
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className='text-sm text-destructive mt-1'>{errors.address}</p>
            )}
          </div>
          <div className='grid md:grid-cols-3 gap-4'>
            <div>
              <Label htmlFor='city'>Ciudad *</Label>
              <Input
                id='city'
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className='text-sm text-destructive mt-1'>{errors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor='department'>Departamento *</Label>
              <Input
                id='department'
                value={formData.department}
                onChange={e => handleInputChange('department', e.target.value)}
                className={errors.department ? 'border-destructive' : ''}
              />
              {errors.department && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.department}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor='postalCode'>Código Postal</Label>
              <Input
                id='postalCode'
                value={formData.postalCode}
                onChange={e => handleInputChange('postalCode', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pago */}
      <Card className='card-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <CreditCard className='h-5 w-5' />
            <span>Método de Pago</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center space-y-4'>
            <div className='p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50'>
              <div className='mb-4'>
                <WompiLogo />
              </div>
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg'>Pago Seguro con Wompi</h3>
                <p className='text-sm text-muted-foreground'>
                  Acepta tarjetas de crédito, débito, PSE y Nequi
                </p>
                <div className='flex justify-center space-x-2 text-xs text-muted-foreground'>
                  <span>Visa</span>
                  <span>•</span>
                  <span>Mastercard</span>
                  <span>•</span>
                  <span>PSE</span>
                  <span>•</span>
                  <span>Nequi</span>
                </div>
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>
              Procesamiento seguro de pagos certificado por Wompi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notas Adicionales */}
      <Card className='card-shadow'>
        <CardHeader>
          <CardTitle>Notas Adicionales (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder='Instrucciones especiales de entrega, referencias del domicilio, etc.'
            value={formData.notes}
            onChange={e => handleInputChange('notes', e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Resumen Final */}
      <Card className='card-shadow'>
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Subtotal ({cart.length} productos)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className='flex justify-between'>
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
        </CardContent>
      </Card>

      {/* Botón de Pago con Wompi */}
      <WompiWidget
        amount={total}
        currency='COP'
        reference={orderNumber}
        onSuccess={result => {
          onSubmit({
            ...formData,
            orderNumber,
            cart,
            total: total,
            orderDate: new Date().toISOString(),
          });
        }}
        onError={error => {
          console.error('Error en pago:', error);
          alert('Error en el pago. Por favor intenta de nuevo.');
        }}
        customerData={formData}
      />

      <p className='text-xs text-muted-foreground text-center'>
        Al confirmar tu pedido, aceptas nuestros términos y condiciones de
        venta.
      </p>
    </form>
  );
}
