import { NextRequest } from 'next/server';

export function verifyAdminToken(request: NextRequest): boolean {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) return false;

    // Verificación simple: solo verificar que existe el token
    return true;
  } catch (error) {
    return false;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get('admin-token')?.value || null;
}
