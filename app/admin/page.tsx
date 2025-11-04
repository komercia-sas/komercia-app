'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Package,
  Users,
  LogOut,
  Edit,
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/use-company';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface Order {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'DELIVERED';
}

export default function AdminDashboard() {
  const { companyInfo } = useCompany();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/orders'),
      ]);

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Logout exitoso, redirigir al login
        router.push('/admin/login');
      } else {
        console.error('Error al cerrar sesión');
        // Aún así redirigir al login
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      // Aún así redirigir al login
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando dashboard...</p>
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
              onClick={() => router.push('/')}
              className='flex-shrink-0'
            >
              <ArrowLeft className='h-4 w-4 sm:mr-2' />
              <span className='hidden sm:inline'>Volver</span>
            </Button>
            <div className='flex-1 sm:flex-none min-w-0'>
              <h1 className='text-md sm:text-xl font-semibold text-gray-900 flex items-center justify-center sm:justify-start'>
                <Building2 className='h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0' />
                Administración
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
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>Dashboard</h2>
          <p className='text-gray-600'>
            Gestiona la información de tu empresa y productos
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Empresa</CardTitle>
              <Building2 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {companyInfo?.name || 'Sin configurar'}
              </div>
              <p className='text-xs text-muted-foreground'>
                {companyInfo?.tagline ||
                  'Configura la información de tu empresa'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Productos</CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{products.length}</div>
              <p className='text-xs text-muted-foreground'>
                {products.filter(p => p.inStock).length} en stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Órdenes</CardTitle>
              <ShoppingCart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{orders.length}</div>
              <p className='text-xs text-muted-foreground'>
                {orders.filter(o => o.status === 'PENDING').length} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Categorías</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {new Set(products.map(p => p.category)).size}
              </div>
              <p className='text-xs text-muted-foreground'>Categorías únicas</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Company Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Building2 className='h-5 w-5 mr-2' />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Gestiona la información pública de tu empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>
                  <strong>Nombre:</strong>{' '}
                  {companyInfo?.name || 'No configurado'}
                </p>
                <p className='text-sm text-gray-600'>
                  <strong>Tagline:</strong>{' '}
                  {companyInfo?.tagline || 'No configurado'}
                </p>
              </div>
              <div className='mt-4'>
                <Link href='/admin/company'>
                  <Button className='w-full'>
                    <Edit className='h-4 w-4 mr-2' />
                    Editar Información
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Package className='h-5 w-5 mr-2' />
                Gestión de Productos
              </CardTitle>
              <CardDescription>
                Administra tu catálogo de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>
                  <strong>Total:</strong> {products.length} productos
                </p>
                <p className='text-sm text-gray-600'>
                  <strong>En stock:</strong>{' '}
                  {products.filter(p => p.inStock).length}
                </p>
              </div>
              <div className='mt-4 space-y-2'>
                <Link href='/admin/products'>
                  <Button className='w-full'>
                    <Package className='h-4 w-4 mr-2' />
                    Gestionar Productos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <ShoppingCart className='h-5 w-5 mr-2' />
                Gestión de Órdenes
              </CardTitle>
              <CardDescription>
                Administra todas las órdenes del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>
                  <strong>Total:</strong> {orders.length} órdenes
                </p>
                <div className='text-sm text-gray-600 space-y-1'>
                  <p>
                    <strong>Pendientes:</strong>{' '}
                    {orders.filter(o => o.status === 'PENDING').length}
                  </p>
                  <p>
                    <strong>Aprobadas:</strong>{' '}
                    {orders.filter(o => o.status === 'APPROVED').length}
                  </p>
                  <p>
                    <strong>Entregadas:</strong>{' '}
                    {orders.filter(o => o.status === 'DELIVERED').length}
                  </p>
                </div>
              </div>
              <div className='mt-4'>
                <Link href='/admin/orders'>
                  <Button className='w-full'>
                    <ShoppingCart className='h-4 w-4 mr-2' />
                    Gestionar Órdenes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Productos Recientes</CardTitle>
              <CardDescription>
                Últimos productos en tu catálogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {products.slice(0, 5).map(product => (
                  <div
                    key={product.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>{product.name}</p>
                      <p className='text-sm text-gray-600'>
                        {product.category} • ${product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Badge
                        variant={product.inStock ? 'default' : 'secondary'}
                      >
                        {product.inStock ? 'En stock' : 'Sin stock'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
