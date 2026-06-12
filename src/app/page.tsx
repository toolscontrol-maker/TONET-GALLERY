import { getProducts } from '@/lib/shopify';
import HomeClient from './HomeClient';

export default async function Home() {
  const products = await getProducts();

  return <HomeClient products={products} />;
}
