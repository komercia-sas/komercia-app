'use client';

import { CompanyProvider } from '@/hooks/use-company';
import { CartProvider } from '@/hooks/use-cart';
import { NavigationLoader } from '@/components/navigation-loader';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CompanyProvider>
      <CartProvider>
        {children}
        <NavigationLoader />
      </CartProvider>
    </CompanyProvider>
  );
}
