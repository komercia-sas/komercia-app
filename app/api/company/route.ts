import { NextResponse } from 'next/server';
import { getCompanyInfo } from '@/lib/vercel-blob';

export async function GET() {
  try {
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
