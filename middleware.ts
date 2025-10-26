import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo aplicar a rutas /admin (excepto /admin/login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    request.nextUrl.pathname !== '/admin/login'
  ) {
    // Obtener token de las cookies
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // No hay token, redirigir al login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Token existe, permitir acceso
    return NextResponse.next();
  }

  // Para otras rutas, continuar normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
