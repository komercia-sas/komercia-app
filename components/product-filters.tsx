'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { getCategories, Product } from '@/lib/vercel-blob';

interface ProductFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  productCount: number;
  products: Product[];
}

export function ProductFilters({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  productCount,
  products,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(getCategories(products));
  }, []);

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('Todas las categorías');
  };

  const hasActiveFilters =
    searchTerm !== '' || selectedCategory !== 'Todas las categorías';

  return (
    <div className='space-y-6'>
      {/* Search and Filter Toggle */}
      <div className='flex flex-col items-center justify-center w-full sm:flex-row gap-4'>
        <div className='relative w-full sm:w-2xl'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar por nombre, descripción o características...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          {productCount}{' '}
          {productCount === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='text-muted-foreground'
          >
            <X className='h-4 w-4 mr-2' />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      <Card className='card-shadow'>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold mb-3'>Categorías</h3>
              <div className='flex flex-wrap gap-2'>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={() => onCategoryChange(category)}
                    className={
                      selectedCategory === category
                        ? 'btn-primary'
                        : 'bg-transparent hover:bg-secondary'
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {searchTerm && (
            <Badge variant='secondary' className='flex items-center gap-2'>
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className='hover:text-foreground'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {selectedCategory !== 'Todas las categorías' && (
            <Badge variant='secondary' className='flex items-center gap-2'>
              Categoría: {categories.find(c => c === selectedCategory)}
              <button
                onClick={() => onCategoryChange('Todas las categorías')}
                className='hover:text-foreground'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
