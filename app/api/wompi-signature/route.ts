import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reference, amountInCents, currency } = await request.json();
    // Validar datos requeridos
    if (!reference || !amountInCents || !currency) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const integrityKey = process.env.WOMPI_INTEGRITY_KEY;

    if (!integrityKey) {
      return NextResponse.json(
        { error: 'WOMPI_INTEGRITY_KEY no configurada' },
        { status: 500 }
      );
    }

    // Generar firma de integridad
    const cadena = `${reference}${amountInCents}${currency}${integrityKey}`;
    const encondedText = new TextEncoder().encode(cadena);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return NextResponse.json({ signature: hashHex });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
