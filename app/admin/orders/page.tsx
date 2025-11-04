'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Search, LogOut, ShoppingCart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/lib/vercel-blob';

const statusColors: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  DELIVERED: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  APPROVED: 'Aprobada',
  DECLINED: 'Rechazada',
  PENDING: 'Pendiente',
  DELIVERED: 'Entregada',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todas');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        const orderToUpdate = orders.find(o => o.id === selectedOrder.id);
        if (orderToUpdate) {
          orderToUpdate.status = newStatus as Order['status'];
          setOrders([...orders]);
        }
        setShowDetails(false);
        setSelectedOrder(null);
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        router.push('/admin/login');
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      router.push('/admin/login');
    }
  };

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowDetails(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'Todas' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Ordenar por fecha (más recientes primero)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16 gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/admin')}
              className='flex-shrink-0'
            >
              <ArrowLeft className='h-4 w-4 sm:mr-2' />
              <span className='hidden sm:inline'>Volver</span>
            </Button>
            <div className='flex-1 sm:flex-none min-w-0'>
              <h1 className='text-md sm:text-xl font-semibold text-gray-900 flex items-center justify-center sm:justify-start'>
                <ShoppingCart className='h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0' />
                <span className='truncate'>Gestión de Órdenes</span>
              </h1>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handleLogout}
              className='flex-shrink-0'
            >
              <LogOut className='h-4 w-4 sm:mr-2' />
              <span className='hidden sm:inline'>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        {/* Controls */}
        <div className='mb-6 flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Buscar por ID de orden...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 w-full'
              />
            </div>
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className='flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base min-w-[150px]'
            >
              <option value='Todas'>Todas las órdenes</option>
              <option value='PENDING'>Pendientes</option>
              <option value='APPROVED'>Aprobadas</option>
              <option value='DECLINED'>Rechazadas</option>
              <option value='DELIVERED'>Entregadas</option>
            </select>
          </div>
        </div>

        {/* Orders Cards (Mobile) */}
        <div className='md:hidden'>
          <Card>
            <CardHeader>
              <CardTitle>Órdenes ({sortedOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedOrders.length === 0 ? (
                <div className='text-center py-12 text-gray-500'>
                  No hay órdenes que mostrar
                </div>
              ) : (
                <div className='space-y-4'>
                  {sortedOrders.map(order => (
                    <Card
                      key={order.id}
                      className='border border-gray-200 hover:shadow-md transition-shadow'
                    >
                      <CardContent className='p-4'>
                        <div className='flex justify-between items-start mb-3'>
                          <div className='flex-1 min-w-0'>
                            <p className='font-mono text-sm font-semibold text-gray-900 truncate'>
                              {order.id}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              {order.updatedAt
                                ? new Date(order.updatedAt).toLocaleDateString(
                                    'es-CO',
                                    {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )
                                : 'N/A'}
                            </p>
                          </div>
                          <Badge
                            className={`ml-2 flex-shrink-0 ${
                              statusColors[order.status] || ''
                            }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </div>
                        <div className='flex justify-between items-center mb-3'>
                          <div>
                            <p className='text-sm text-gray-600'>
                              {order.products.length} producto
                              {order.products.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <p className='text-lg font-bold text-blue-600'>
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full'
                          onClick={() => openDetails(order)}
                        >
                          <Eye className='h-4 w-4 mr-2' />
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders Table (Desktop) */}
        <Card className='hidden md:block'>
          <CardHeader>
            <CardTitle>Órdenes ({sortedOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedOrders.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                No hay órdenes que mostrar
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b'>
                      <th className='text-left p-4 font-semibold text-gray-700'>
                        ID Orden
                      </th>
                      <th className='text-left p-4 font-semibold text-gray-700'>
                        Fecha
                      </th>
                      <th className='text-left p-4 font-semibold text-gray-700'>
                        Productos
                      </th>
                      <th className='text-left p-4 font-semibold text-gray-700'>
                        Total
                      </th>
                      <th className='text-left p-4 font-semibold text-gray-700'>
                        Estado
                      </th>
                      <th className='text-left p-4 font-semibold text-gray-700'>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map(order => (
                      <tr
                        key={order.id}
                        className='border-b hover:bg-gray-50 transition-colors'
                      >
                        <td className='p-4'>
                          <span className='font-mono text-sm'>{order.id}</span>
                        </td>
                        <td className='p-4 text-sm text-gray-600'>
                          {order.updatedAt
                            ? new Date(order.updatedAt).toLocaleDateString(
                                'es-CO',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )
                            : 'N/A'}
                        </td>
                        <td className='p-4 text-sm text-gray-600'>
                          {order.products.length} producto
                          {order.products.length !== 1 ? 's' : ''}
                        </td>
                        <td className='p-4 font-semibold'>
                          {formatPrice(order.total)}
                        </td>
                        <td className='p-4'>
                          <Badge className={statusColors[order.status] || ''}>
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </td>
                        <td className='p-4'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => openDetails(order)}
                          >
                            <Eye className='h-4 w-4 mr-1' />
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full'>
          <DialogHeader>
            <DialogTitle>Detalles de la Orden</DialogTitle>
            <DialogDescription className='break-all'>
              ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className='space-y-6'>
              {/* Order Info */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-semibold text-gray-700'>
                    Estado Actual
                  </p>
                  <Badge
                    className={`mt-1 ${statusColors[selectedOrder.status] || ''}`}
                  >
                    {statusLabels[selectedOrder.status] || selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-semibold text-gray-700'>
                    Fecha de Actualización
                  </p>
                  <p className='text-sm text-gray-600 mt-1 break-words'>
                    {selectedOrder.updatedAt
                      ? new Date(selectedOrder.updatedAt).toLocaleString(
                          'es-CO'
                        )
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Products List */}
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-3'>
                  Productos
                </p>
                <div className='space-y-3'>
                  {selectedOrder.products.map((product, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-4 p-3 border rounded-lg'
                    >
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className='w-16 h-16 object-cover rounded'
                        />
                      )}
                      <div className='flex-1'>
                        <p className='font-medium'>{product.name}</p>
                        <p className='text-sm text-gray-600'>
                          Cantidad: {product.quantity}
                        </p>
                        <p className='text-sm font-semibold'>
                          {formatPrice(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className='border-t pt-4'>
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-semibold'>Total</p>
                  <p className='text-xl font-bold text-blue-600'>
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className='border-t pt-4'>
                <p className='text-sm font-semibold text-gray-700 mb-3'>
                  Cambiar Estado
                </p>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
                  >
                    <option value='PENDING'>Pendiente</option>
                    <option value='APPROVED'>Aprobada</option>
                    <option value='DECLINED'>Rechazada</option>
                    <option value='DELIVERED'>Entregada</option>
                  </select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={updating || newStatus === selectedOrder.status}
                    className='w-full sm:w-auto'
                  >
                    {updating ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className='flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowDetails(false)}
              className='w-full sm:w-auto'
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
