'use client';

import { usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export function NavigationLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const previousPathname = useRef<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Usar el ciclo de vida de Next.js: usePathname nos notifica cuando la ruta cambia
  // Este es el único ciclo de vida que Next.js expone para detectar navegaciones
  useEffect(() => {
    // Si es la primera carga, guardar el pathname inicial
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }

    // Si el pathname cambió, hay una navegación en curso
    if (previousPathname.current !== pathname) {
      // Limpiar timeout anterior si existe
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Mostrar loader cuando detectamos cambio de ruta
      setIsVisible(true);
      previousPathname.current = pathname;

      // Ocultar loader después de un delay para permitir que la nueva página se renderice
      // Esto da tiempo para que Next.js complete la navegación y renderice el contenido
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-black/50 backdrop-blur-sm transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      aria-hidden='true'
    >
      <div className='rounded-lg bg-background p-8 shadow-lg'>
        <Spinner size='lg' className='text-primary' />
      </div>
    </div>
  );
}
