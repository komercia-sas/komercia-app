import { saveOrder } from '@/lib/vercel-blob';
import { NextResponse } from 'next/server';
import type { Order } from '@/lib/vercel-blob';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID y estado son requeridos' },
        { status: 400 }
      );
    }

    // Validar que el estado sea uno de los permitidos
    const validStatuses: Order['status'][] = [
      'APPROVED',
      'DECLINED',
      'PENDING',
      'DELIVERED',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    // Obtener órdenes actuales
    const { getOrders } = await import('@/lib/vercel-blob');
    const orders = await getOrders();
    const order = orders.find((o: Order) => o.id === id);

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar estado
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };

    await saveOrder(updatedOrder);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    );
  }
}
