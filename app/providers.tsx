'use client';

import { CompanyProvider } from '@/hooks/use-company';
import { CartProvider } from '@/hooks/use-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CompanyProvider>
      <CartProvider>{children}</CartProvider>
    </CompanyProvider>
  );
}
