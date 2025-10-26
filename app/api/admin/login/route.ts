import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json();

    // Verificar clave de administrador
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Clave de administrador incorrecta' },
        { status: 401 }
      );
    }

    // Generar JWT token
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      process.env.ADMIN_SECRET_KEY!,
      { expiresIn: '24h' }
    );

    // Crear response con cookie
    const response = NextResponse.json({
      success: true,
      message: 'Autenticación exitosa',
    });

    // Guardar JWT en cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict', // Protección CSRF
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: '/', // Disponible en toda la app
    });

    return response;
  } catch (error) {
    console.error('Error en login admin:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
