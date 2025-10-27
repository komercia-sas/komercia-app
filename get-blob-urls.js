// Script para obtener las URLs actuales de Vercel Blob
// Ejecutar con: node get-blob-urls.js

import { list } from '@vercel/blob';

async function getBlobUrls() {
  try {
    console.log('🔍 Obteniendo URLs de Vercel Blob...\n');

    // Obtener URL de productos
    const productsResult = await list({
      prefix: 'komercia-data/products',
      limit: 1,
    });

    if (productsResult.blobs.length > 0) {
      console.log('📦 URL de productos:');
      console.log(`VERCEL_BLOB_PRODUCTS_URL=${productsResult.blobs[0].url}\n`);
    } else {
      console.log('❌ No se encontraron productos en Vercel Blob\n');
    }

    // Obtener URL de company info
    const companyResult = await list({
      prefix: 'komercia-data/company-info',
      limit: 1,
    });

    if (companyResult.blobs.length > 0) {
      console.log('🏢 URL de company info:');
      console.log(`VERCEL_BLOB_COMPANY_URL=${companyResult.blobs[0].url}\n`);
    } else {
      console.log('❌ No se encontró company info en Vercel Blob\n');
    }

    console.log('✅ Copia estas variables a tu archivo .env.local');
    console.log(
      '💡 Esto eliminará los llamados list() que consumen operaciones avanzadas'
    );
  } catch (error) {
    console.error('❌ Error obteniendo URLs:', error);
  }
}

getBlobUrls();
