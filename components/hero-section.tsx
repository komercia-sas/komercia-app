import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';

export function HeroSection() {
  const { companyInfo, loading } = useCompany();
  return (
    <section className='overflow-hidden hero-gradient'>
      <div className='container mx-auto px-4 py-24 lg:py-12'>
        <div className='grid lg:grid-cols-[3fr_2fr] lg:gap-0 gap-10 items-center'>
          <div className='space-y-8 '>
            <div className='space-y-4'>
              <h1 className='text-3xl lg:text-4xl font-bold text-balance leading-tight text-primary'>
                {companyInfo?.tagline}
              </h1>

              <p className='text-xl text-muted-foreground text-pretty max-w-2xl'>
                {loading
                  ? 'Cargando...'
                  : companyInfo?.description || 'Descripción de la empresa'}
              </p>
            </div>

            <div className='flex flex-row gap-4'>
              <Link href='/catalogo'>
                <Button size='lg' className='btn-primary'>
                  Ver Catálogo
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link
                href={`https://wa.me/${companyInfo?.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría obtener más información sobre los productos de Komercia')}`}
                target='_blank'
              >
                <Button variant='outline' size='lg'>
                  Contactar Asesor
                </Button>
              </Link>
            </div>
          </div>

          <div className='z-10 flex justify-center items-center'>
            <img
              src='/black-friday.jpg'
              alt='Silla de oficina premium'
              className='h-[650px] rounded-2xl card-shadow'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
