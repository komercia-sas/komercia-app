import { put, list } from '@vercel/blob';

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
    const { blobs } = await list({
      prefix: 'komercia-data/company-info',
      limit: 1,
    });

    // Agregar timestamp para evitar caché
    const url = `${blobs[0].url}?t=${Date.now()}`;
    const response = await fetch(url, {
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
    const { blobs } = await list({
      prefix: 'komercia-data/products',
      limit: 1,
    });

    // Agregar timestamp para evitar caché
    const url = `${blobs[0].url}?t=${Date.now()}`;
    const response = await fetch(url, {
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
    const updatedProducts = products.filter(p => p.id !== id);
    return await saveProducts(updatedProducts);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Error deleting product');
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
