'use client';
import Image from 'next/image';

interface WompiLogoProps {
  className?: string;
}

export function WompiLogo({ className = '' }: WompiLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src='/wompi_logo.jpg'
        alt='Wompi - Pagos Seguros'
        width={128}
        height={128}
        className='mx-auto'
        priority
      />
    </div>
  );
}
