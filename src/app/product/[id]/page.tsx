import { getProducts, getProduct } from '@/lib/shopify';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLIC_TOKEN) {
    return [];
  }
  const products = await getProducts();
  return products.map((p) => ({ id: p.handle }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'e-gift-card') {
    notFound();
  }
  const product = await getProduct(id);
  if (!product) return <div style={{ padding: '80px 24px' }}>Product not found.</div>;
  
  // Find related products by tag
  // We filter products that share at least one tag with the current product.
  // We ignore tags that might be too generic if needed, but for now we just intersect.
  const allProducts = await getProducts();
  let relatedProductsByTag = allProducts.filter(p => 
    p.handle !== product.handle && 
    p.tags && product.tags && p.tags.some(t => product.tags.includes(t))
  );

  if (relatedProductsByTag.length === 0) {
    relatedProductsByTag = allProducts.filter(p => p.handle !== product.handle).slice(0, 5);
  }

  return <ProductClient product={product} relatedProductsByTag={relatedProductsByTag} />;
}
