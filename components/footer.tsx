import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';

export function Footer() {
  const { companyInfo, loading } = useCompany();

  return (
    <footer className='bg-primary text-primary-foreground'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground text-primary'>
                <img src='/favicon-32x32.png' alt='Logo' />
              </div>
              <span className='text-xl font-bold'>
                {loading ? 'Cargando...' : companyInfo?.name || 'Komercia'}
              </span>
            </div>
            <p className='text-sm opacity-90 text-pretty'>
              {loading
                ? 'Cargando...'
                : companyInfo?.tagline || 'Tu empresa de confianza'}
            </p>
            {!loading && companyInfo && (
              <div className='flex space-x-4'>
                <Link
                  href={companyInfo.social.facebook}
                  className='opacity-90 hover:opacity-100'
                >
                  <img
                    src='/facebook.png'
                    alt='Facebook'
                    className='h-5 w-5 text-white'
                  />
                </Link>
                <Link
                  href={companyInfo.social.instagram}
                  className='opacity-90 hover:opacity-100'
                >
                  <img
                    src='/instagram.png'
                    alt='Instagram'
                    className='h-5 w-5 text-white'
                  />
                </Link>
              </div>
            )}
          </div>

          <div className='lg:justify-self-center'>
            <h3 className='font-semibold mb-4'>Navegación</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/' className='opacity-90 hover:opacity-100'>
                  Inicio
                </Link>
              </li>
              <li>
                <Link href='/catalogo' className='opacity-90 hover:opacity-100'>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href='/#nosotros'
                  className='opacity-90 hover:opacity-100'
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href='/#contacto'
                  className='opacity-90 hover:opacity-100'
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-4'>Contacto</h3>
            <ul className='space-y-2 text-sm opacity-90'>
              <li>
                {loading
                  ? 'Cargando...'
                  : companyInfo?.contact.address || 'Dirección no disponible'}
              </li>
              <li>
                {loading
                  ? 'Cargando...'
                  : companyInfo?.contact.phone || 'Teléfono no disponible'}
              </li>
              <li>
                {loading
                  ? 'Cargando...'
                  : companyInfo?.contact.email || 'Email no disponible'}
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90'>
          <p>
            &copy; 2025{' '}
            {loading ? 'Cargando...' : companyInfo?.name || 'Komercia'}. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
