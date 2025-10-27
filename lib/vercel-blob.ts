import { put, del } from '@vercel/blob';

// URLs fijas desde variables de entorno - No consumen operaciones avanzadas
function getBlobUrl(type: 'products' | 'company'): string {
  const url =
    type === 'products'
      ? process.env.VERCEL_BLOB_PRODUCTS_URL
      : process.env.VERCEL_BLOB_COMPANY_URL;

  if (!url) {
    throw new Error(`VERCEL_BLOB_${type.toUpperCase()}_URL not configured`);
  }

  return url;
}

// Tipos para nuestros datos
export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  about: {
    history: string;
    vision: string;
    values: string[];
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  services: string[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  images: string[];
  inStock: boolean;
}

// Funciones para manejar datos de la empresa
export async function getCompanyInfo(): Promise<CompanyInfo> {
  try {
    // Obtener URL con fallback si fetch falla
    const url = getBlobUrl('company');

    // Agregar timestamp para evitar caché del navegador y ver cambios inmediatos
    const urlWithTimestamp = `${url}?t=${Date.now()}`;
    const response = await fetch(urlWithTimestamp, {
      cache: 'no-store', // Evitar caché del navegador
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting company info:', error);
    throw new Error('Error getting company info');
  }
}

export async function saveCompanyInfo(data: CompanyInfo): Promise<string> {
  try {
    const blob = await put(
      'komercia-data/company-info.json',
      JSON.stringify(data, null, 2),
      {
        access: 'public',
        allowOverwrite: true,
        cacheControlMaxAge: 0, // Sin caché para datos dinámicos
        addRandomSuffix: false, // Mantener el mismo nombre
      }
    );

    return blob.url;
  } catch (error) {
    console.error('Error saving company info:', error);
    throw new Error('Error saving company info');
  }
}

// Funciones para manejar productos
export async function getProducts(): Promise<Product[]> {
  try {
    // Obtener URL con fallback si fetch falla
    const url = getBlobUrl('products');

    // Agregar timestamp para evitar caché del navegador y ver cambios inmediatos
    const urlWithTimestamp = `${url}?t=${Date.now()}`;
    const response = await fetch(urlWithTimestamp, {
      cache: 'no-store', // Evitar caché del navegador
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Error getting products');
  }
}

export async function saveProducts(products: Product[]): Promise<string> {
  try {
    const blob = await put(
      'komercia-data/products.json',
      JSON.stringify(products, null, 2),
      {
        access: 'public',
        allowOverwrite: true,
        cacheControlMaxAge: 0, // Sin caché para datos dinámicos
        addRandomSuffix: false, // Mantener el mismo nombre
      }
    );

    return blob.url;
  } catch (error) {
    console.error('Error saving products:', error);
    throw new Error('Error saving products');
  }
}

export async function addProduct(
  product: Omit<Product, 'id'>
): Promise<string> {
  try {
    const products = await getProducts();
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1,
    };

    const updatedProducts = [...products, newProduct];
    return await saveProducts(updatedProducts);
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Error adding product');
  }
}

export async function updateProduct(
  id: number,
  updates: Partial<Product>
): Promise<string> {
  try {
    const products = await getProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const currentProduct = products[productIndex];

    // Si se están actualizando las imágenes, eliminar las imágenes anteriores
    if (updates.images && updates.images !== currentProduct.images) {
      const imagesToDelete = currentProduct.images.filter(
        image => !updates.images!.includes(image)
      );
      if (imagesToDelete.length > 0) {
        await deleteProductImages(imagesToDelete);
      }
    }

    // Actualizar el producto
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );

    return await saveProducts(updatedProducts);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Error updating product');
  }
}

export async function deleteProduct(id: number): Promise<string> {
  try {
    const products = await getProducts();
    const productToDelete = products.find(p => p.id === id);

    if (!productToDelete) {
      throw new Error('Product not found');
    }

    // Eliminar imágenes del producto
    await deleteProductImages(productToDelete.images);

    // Eliminar el producto de la lista
    const updatedProducts = products.filter(p => p.id !== id);
    return await saveProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Error deleting product');
  }
}

// Función auxiliar para eliminar imágenes de un producto
async function deleteProductImages(images: string[]): Promise<void> {
  try {
    if (images.length === 0) return;

    // Eliminar todas las imágenes de una vez usando el array de URLs
    await del(images);
  } catch (error) {
    console.error('Error deleting product images:', error);
    // No lanzar error para no interrumpir la eliminación del producto
  }
}

// Función para obtener categorías dinámicamente
export function getCategories(products: Product[]): string[] {
  try {
    const defaultCategories = [
      'Todas las categorías',
      'Ejecutiva',
      'Ergonómica',
      'Gaming',
      'Operativa',
      'Oficina',
    ];
    const uniqueCategories = [
      ...new Set([...defaultCategories, ...products.map(p => p.category)]),
    ];

    return uniqueCategories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Error getting categories');
  }
}
