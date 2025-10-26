'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Upload,
  X,
  ChevronDown,
  Check,
  LogOut,
} from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { getCategories } from '@/lib/vercel-blob';

interface Product {
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

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  images: string[];
  inStock: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    'Todas las categorías'
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: '',
    shortDescription: '',
    longDescription: '',
    features: [],
    images: [],
    inStock: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (message.length > 0) {
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  }, [message]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productsResponse = await fetch('/api/admin/products');

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setCategories(getCategories(productsData));
      }
    } catch (error) {
      setMessage('Error al cargar productos');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: '',
      shortDescription: '',
      longDescription: '',
      features: [],
      images: [],
      inStock: true,
    });
    setCategoryInput('');
    setSelectedFiles([]);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      features: product.features,
      images: product.images,
      inStock: product.inStock,
    });
    setCategoryInput(product.category);
    setSelectedFiles([]);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        setMessage('Producto eliminado correctamente');
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error al eliminar producto');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    // Validar solo el input de archivos usando validación nativa
    const fileInput = document.getElementById(
      'image-upload'
    ) as HTMLInputElement;
    if (selectedFiles.length === 0 && formData.images.length === 0) {
      fileInput.setCustomValidity('Debe seleccionar al menos una imagen');
      fileInput.reportValidity();
      setSaving(false);
      return;
    } else {
      fileInput.setCustomValidity('');
    }

    try {
      // Subir archivos seleccionados primero
      const uploadedImages = [...formData.images];
      for (const file of selectedFiles) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const newBlob = await upload(`product-images/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
        });
        if (newBlob.url) {
          uploadedImages.push(newBlob.url);
        } else {
          setMessage(`Error al subir imagen: ${file.name}`);
          return;
        }
      }

      // Crear el producto con todas las imágenes
      const productData = {
        ...formData,
        images: uploadedImages,
      };

      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct
        ? { id: editingProduct.id, ...productData }
        : productData;

      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setMessage(
          editingProduct
            ? 'Producto actualizado correctamente, se vera reflejado en unos minutos'
            : 'Producto creado correctamente, se vera reflejado en unos minutos'
        );
        setShowForm(false);
        setSelectedFiles([]);
        setTimeout(() => {
          fetchData();
        }, 60000);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Funciones para manejar archivos seleccionados
  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles]);
    }
  };

  // Funciones para el typeahead de categorías
  const filteredCategories = categories.filter(
    cat =>
      cat !== 'Todas las categorías' &&
      cat.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const handleCategorySelect = (category: string) => {
    setCategoryInput(category);
    setFormData(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    setFormData(prev => ({ ...prev, category: value }));
    setShowCategoryDropdown(true);
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

  const handleCategoryInputBlur = () => {
    // Delay para permitir que se ejecute el click en las opciones
    setTimeout(() => {
      setShowCategoryDropdown(false);
    }, 200);
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas las categorías' ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Button
              variant='ghost'
              onClick={() => router.push('/admin/dashboard')}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver
            </Button>
            <div className='ml-4'>
              <h1 className='text-xl font-semibold text-gray-900 flex items-center'>
                <Package className='h-6 w-6 mr-2 text-blue-600' />
                Gestión de Productos
              </h1>
            </div>
            <Button variant='outline' onClick={handleLogout}>
              <LogOut className='h-4 w-4 mr-2' />
              Cerrar Sesión
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
                placeholder='Buscar productos...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className='px-3 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button onClick={handleCreateProduct}>
              <Plus className='h-4 w-4 mr-2' />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.includes('Error')
                ? 'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-600'
            }`}
          >
            {message}
          </div>
        )}

        {/* Products Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredProducts.map(product => (
            <Card key={product.id} className='overflow-hidden'>
              <div className='aspect-video bg-gray-100 flex items-center justify-center'>
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className='h-56 object-cover'
                  />
                ) : (
                  <Package className='h-12 w-12 text-gray-400' />
                )}
              </div>
              <CardContent className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-semibold text-lg'>{product.name}</h3>
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'En stock' : 'Sin stock'}
                  </Badge>
                </div>
                <p className='text-gray-600 text-sm mb-2'>
                  {product.shortDescription}
                </p>
                <div className='flex justify-between items-center mb-3'>
                  <span className='text-lg font-bold text-blue-600'>
                    ${product.price.toLocaleString()}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {product.category}
                  </span>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className='h-4 w-4 mr-1' />
                    Editar
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDeleteProduct(product.id)}
                    className='text-red-600 hover:text-white'
                  >
                    <Trash2 className='h-4 w-4 mr-1' />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Product Form Modal */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? 'Modifica la información del producto'
                  : 'Agrega un nuevo producto al catálogo'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveProduct} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>Nombre del Producto</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='price'>Precio</Label>
                  <Input
                    id='price'
                    type='number'
                    value={formData.price}
                    onChange={e =>
                      handleInputChange('price', Number(e.target.value))
                    }
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='relative'>
                  <Label htmlFor='category'>Categoría</Label>
                  <div className='relative'>
                    <Input
                      id='category'
                      value={categoryInput}
                      onChange={e => handleCategoryInputChange(e.target.value)}
                      onFocus={() => setShowCategoryDropdown(true)}
                      onBlur={handleCategoryInputBlur}
                      placeholder='Escribe o selecciona una categoría'
                      className='pr-8'
                      required
                    />
                    <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  </div>

                  {/* Dropdown de categorías */}
                  {showCategoryDropdown && (
                    <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                          <button
                            key={category}
                            type='button'
                            onClick={() => handleCategorySelect(category)}
                            className='w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between'
                          >
                            <span>{category}</span>
                            {categoryInput === category && (
                              <Check className='h-4 w-4 text-blue-600' />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className='px-3 py-2 text-gray-500'>
                          {categoryInput ? (
                            <div>
                              <div className='text-sm'>
                                Crear nueva categoría:
                              </div>
                              <div className='font-medium'>
                                "{categoryInput}"
                              </div>
                            </div>
                          ) : (
                            'Escribe para buscar o crear una categoría'
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='inStock'
                    checked={formData.inStock}
                    onChange={e =>
                      handleInputChange('inStock', e.target.checked)
                    }
                    className='rounded'
                  />
                  <Label htmlFor='inStock'>En stock *</Label>
                </div>
              </div>

              <div>
                <Label htmlFor='shortDescription'>Descripción Corta *</Label>
                <Input
                  id='shortDescription'
                  value={formData.shortDescription}
                  onChange={e =>
                    handleInputChange('shortDescription', e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor='longDescription'>Descripción Larga</Label>
                <Textarea
                  id='longDescription'
                  value={formData.longDescription}
                  onChange={e =>
                    handleInputChange('longDescription', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div>
                <div className='flex justify-between items-center mb-4'>
                  <Label>Características</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addFeature}
                  >
                    <Plus className='h-4 w-4 mr-1' />
                    Agregar Característica
                  </Button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className='flex gap-2 mb-2'>
                    <Input
                      value={feature}
                      onChange={e => handleFeatureChange(index, e.target.value)}
                      placeholder='Característica del producto'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeFeature(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <Label>Imágenes *</Label>

                {/* Imágenes ya subidas */}
                {formData.images.length > 0 && (
                  <div className='mb-4'>
                    <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                      Imágenes subidas:
                    </Label>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                      {formData.images.map((image, index) => (
                        <div key={index} className='relative'>
                          <img
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className='w-full h-20 object-cover rounded'
                          />
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='absolute top-1 right-1 p-1'
                            onClick={() => removeImage(index)}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Archivos seleccionados pendientes de subir */}
                {selectedFiles.length > 0 && (
                  <div className='mb-4'>
                    <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                      Archivos seleccionados (se subirán al guardar):
                    </Label>
                    <div className='space-y-2'>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-2 bg-gray-50 rounded border'
                        >
                          <div className='flex items-center space-x-2'>
                            <Package className='h-4 w-4 text-gray-500' />
                            <span className='text-sm text-gray-700'>
                              {file.name}
                            </span>
                            <span className='text-xs text-gray-500'>
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => removeSelectedFile(index)}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className='mt-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setSelectedFiles([])}
                      >
                        Limpiar Selección
                      </Button>
                    </div>
                  </div>
                )}

                {/* Área de selección de archivos */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={e => handleFileSelect(e.target.files)}
                    className='hidden'
                    id='image-upload'
                  />
                  <label
                    htmlFor='image-upload'
                    className='cursor-pointer flex flex-col items-center space-y-2'
                  >
                    <Upload
                      className={`h-8 w-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
                    />
                    <div>
                      <span className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                        Haz clic para seleccionar archivos
                      </span>
                      <span className='text-sm text-gray-500'>
                        {' '}
                        o arrastra y suelta
                      </span>
                    </div>
                    <p className='text-xs text-gray-400'>
                      PNG, JPG, GIF hasta 10MB (se subirán al guardar)
                    </p>
                  </label>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-md ${
                    message.includes('Error')
                      ? 'bg-red-50 text-red-600'
                      : 'bg-green-50 text-green-600'
                  }`}
                >
                  {message}
                </div>
              )}

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
