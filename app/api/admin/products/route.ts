import { NextResponse } from 'next/server';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/vercel-blob';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    if (!verifyAdminToken(request as any)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    if (!verifyAdminToken(request as any)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const productData = await request.json();

    // Validar datos requeridos
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, price, category' },
        { status: 400 }
      );
    }

    // Agregar producto
    const url = await addProduct({
      name: productData.name,
      price: productData.price,
      category: productData.category,
      shortDescription: productData.shortDescription || '',
      longDescription: productData.longDescription || '',
      features: productData.features || [],
      images: productData.images || [],
      inStock: productData.inStock !== undefined ? productData.inStock : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Producto creado correctamente',
      url,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
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

    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Actualizar producto
    const url = await updateProduct(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado correctamente',
      url,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Verificar autenticación
    if (!verifyAdminToken(request as any)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Eliminar producto
    const url = await deleteProduct(parseInt(id));

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado correctamente',
      url,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
