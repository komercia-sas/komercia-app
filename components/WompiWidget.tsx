'use client';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WompiWidgetProps {
  amount: number;
  currency: string;
  reference: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    department: string;
  };
}

export default function WompiWidget({
  amount,
  currency,
  reference,
  onSuccess,
  onError,
  customerData,
}: WompiWidgetProps) {
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Función para mostrar error en popup
  const showError = (errorMessage: string) => {
    setError(errorMessage);
    setShowErrorPopup(true);
  };

  // Carga el script del widget de Wompi
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Solicita la firma al backend
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetch('/api/wompi-signature', {
          method: 'POST',
          body: JSON.stringify({
            reference,
            amountInCents: amount * 100,
            currency,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Error al obtener firma');
        }

        const { signature } = await response.json();
        setSignature(signature);
      } catch (err) {
        console.error('Error fetching signature:', err);
        showError('Error al cargar datos de pago');
      }
    };

    fetchSignature();
  }, [amount, currency, reference]);

  // Validar que todos los datos requeridos estén completos
  const isFormValid = () => {
    return (
      customerData.firstName.trim() !== '' &&
      customerData.lastName.trim() !== '' &&
      customerData.email.trim() !== '' &&
      customerData.phone.trim() !== '' &&
      customerData.address.trim() !== '' &&
      customerData.city.trim() !== '' &&
      customerData.department.trim() !== ''
    );
  };

  const handlePayment = () => {
    if (!signature) {
      showError('Error de validación, comuníquese con el administrador');
      return;
    }

    if (!isFormValid()) {
      showError('Por favor completa todos los campos requeridos');
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // @ts-ignore - WidgetCheckout es inyectado por el script de Wompi
      const checkout = new WidgetCheckout({
        currency,
        amountInCents: amount * 100,
        reference,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        signature: { integrity: signature },
        redirectUrl: `${window.location.origin}/confirmacion`,
        customerData: {
          email: customerData.email,
          fullName: customerData.firstName + ' ' + customerData.lastName,
          phoneNumber: customerData.phone,
          phoneNumberPrefix: '+57',
        },
        shippingAddress: {
          addressLine1: customerData.address,
          city: customerData.city,
          phoneNumber: customerData.phone,
          region: customerData.department,
          country: 'CO',
        },
      });

      checkout.open((result: any) => {
        setLoading(false);
        if (result.status === 'APPROVED') {
          onSuccess?.(result);
        } else {
          onError?.(result);
        }
      });
    } catch (err) {
      console.error('Error opening checkout:', err);
      showError('Error al abrir el checkout: ' + err);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type='button'
        onClick={handlePayment}
        disabled={!signature || loading || !isFormValid()}
        className='w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
      >
        {loading ? 'Procesando...' : 'Pagar Ahora con Wompi'}
      </button>
      {!isFormValid() && signature && (
        <p className='text-xs text-muted-foreground text-center mt-2'>
          Completa todos los campos requeridos para habilitar el pago
        </p>
      )}

      {/* Popup de error */}
      <Dialog open={showErrorPopup} onOpenChange={setShowErrorPopup}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-red-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              Error de Pago
            </DialogTitle>
            <DialogDescription className='text-base text-gray-700'>
              {error}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
