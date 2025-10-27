'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/vercel-blob';
import { Package } from 'lucide-react';

const filterProducts = (
  products: Product[],
  searchTerm = '',
  category = 'Todas las categorías'
) => {
  return products.filter(product => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.features.some(feature =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      category === 'Todas las categorías' || product.category === category;

    return matchesSearch && matchesCategory;
  });
};

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    'Todas las categorías'
  );
  const [filteredProducts, setFilteredProducts] = useState(
    filterProducts(products, searchTerm, selectedCategory)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      });
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    const busqueda = searchParams.get('busqueda');

    if (categoria) {
      const defaultCategoriesMapper = {
        ejecutiva: 'Ejecutiva',
        ergonomica: 'Ergonómica',
        gaming: 'Gaming',
        operativa: 'Operativa',
        oficina: 'Oficina',
      };
      setSelectedCategory(
        defaultCategoriesMapper[
          categoria as keyof typeof defaultCategoriesMapper
        ]
      );
    }
    if (busqueda) {
      setSearchTerm(busqueda);
    }
  }, [searchParams]);

  // Update filtered products when filters change
  useEffect(() => {
    const filtered = filterProducts(products, searchTerm, selectedCategory);
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <main className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <Badge variant='secondary' className='mb-4'>
            Catálogo
          </Badge>
          <h1 className='text-2xl lg:text-3xl font-bold mb-6 text-balance'>
            Encuentra la silla perfecta para ti
          </h1>
        </div>

        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          productCount={filteredProducts.length}
          products={products}
        />

        {/* Products Grid */}
        {isLoading ? (
          <div className='flex items-center justify-center h-[200px]'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <div className='flex justify-center mb-4'>
              <Package className='h-16 w-16 text-muted-foreground' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>
              No se encontraron productos
            </h3>
            <p className='text-muted-foreground mb-6'>
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas las categorías');
              }}
              className='text-primary hover:underline'
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
