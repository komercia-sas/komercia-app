import { getOrders, saveOrder } from '@/lib/vercel-blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('order to save', data);
    const order = await saveOrder(data);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json(
      { error: 'Error al guardar orden' },
      { status: 500 }
    );
  }
}
