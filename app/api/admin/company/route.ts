import { NextResponse } from 'next/server';
import { getCompanyInfo, saveCompanyInfo } from '@/lib/vercel-blob';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    if (!verifyAdminToken(request as any)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const companyInfo = await getCompanyInfo();
    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de la empresa' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Verificar autenticación
    if (!verifyAdminToken(request as any)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Validar datos requeridos
    if (!data.name || !data.tagline || !data.description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Guardar información de la empresa
    const url = await saveCompanyInfo(data);

    return NextResponse.json({
      success: true,
      message: 'Información de la empresa actualizada correctamente',
      url,
    });
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json(
      { error: 'Error al actualizar información de la empresa' },
      { status: 500 }
    );
  }
}
