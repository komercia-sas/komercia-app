import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';

export function HeroSection() {
  const { companyInfo, loading } = useCompany();
  return (
    <section className='relative overflow-hidden hero-gradient'>
      <div className='container mx-auto px-4 py-24 lg:py-12'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                <img
                  src='/logo_comercializadora_komercia.png'
                  alt='Logo'
                  width={300}
                />
              </div>

              <h1 className='text-4xl lg:text-6xl font-bold text-balance leading-tight'>
                Comodidad y elegancia para tu{' '}
                <span className='text-primary'>espacio de trabajo</span>
              </h1>

              <p className='text-xl text-muted-foreground text-pretty max-w-2xl'>
                {loading
                  ? 'Cargando...'
                  : companyInfo?.description || 'Descripción de la empresa'}
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Link href='/catalogo'>
                <Button size='lg' className='btn-primary'>
                  Ver Catálogo
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link href='/#contacto'>
                <Button variant='outline' size='lg'>
                  Contactar Asesor
                </Button>
              </Link>
            </div>

            <div className='grid grid-cols-3 gap-8 pt-8 border-t'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-primary'>15+</div>
                <div className='text-sm text-muted-foreground'>
                  Años de experiencia
                </div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-primary'>5,000+</div>
                <div className='text-sm text-muted-foreground'>
                  Clientes satisfechos
                </div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-primary'>100+</div>
                <div className='text-sm text-muted-foreground'>
                  Modelos disponibles
                </div>
              </div>
            </div>
          </div>

          <div className='relative'>
            <div className='relative z-10'>
              <img
                src='/hero-image.png'
                alt='Silla de oficina premium'
                className='w-full h-[700px] object-cover rounded-2xl card-shadow'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
