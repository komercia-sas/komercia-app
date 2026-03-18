import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPageClient } from '@/components/product-page-client';
import { getProducts } from '@/lib/vercel-blob';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProductById(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId)) {
    return null;
  }

  const products = await getProducts();
  return products.find(product => product.id === parsedId) ?? null;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);
  const fallbackImage = '/og-default.jpg';

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'Explora nuestro catálogo de productos.',
      openGraph: {
        title: 'Producto no encontrado',
        description: 'Explora nuestro catálogo de productos.',
        images: [fallbackImage],
      },
      twitter: {
        card: 'summary_large_image',
        images: [fallbackImage],
      },
    };
  }

  const productImage = product.images[0] || fallbackImage;

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: 'website',
      images: [
        {
          url: productImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: [productImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
