import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductClientPage from './ProductClientPage';
import { store } from '@/lib/data-store';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function fetchProduct(id: string) {
  let product = store.getProductById(id);
  if (!product) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        product = store.upsertProduct({
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          keywords: data.keywords || [],
          costPrice: Number(data.cost_price || 0),
          mrp: Number(data.mrp || 0),
          price: Number(data.price || 0),
          stock: Number(data.stock || 0),
          priorityScore: Number(data.priority_score || 50),
          urgencyFlag: Boolean(data.urgency_flag),
          isHandpickedFeatured: Boolean(data.is_handpicked_featured),
          images: data.images || [],
          specs: data.specs || {},
          occasion: data.occasion,
          createdAt: data.created_at
        });
      }
    } catch (e) {}
  }
  return product;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found - Anita Gift House',
      description: 'The requested product could not be found.'
    };
  }

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
  const priceText = `₹${product.price.toLocaleString('en-IN')}`;
  const desc = product.description 
    ? `${product.description.substring(0, 150)}... Buy now for ${priceText} at Anita Gift House!` 
    : `Buy ${product.title} for ${priceText} at Anita Gift House! Artisanal hampers, curated gifts & fast express delivery.`;

  return {
    title: `${product.title} (${priceText}) | Anita Gift House`,
    description: desc,
    openGraph: {
      title: `${product.title} - ${priceText}`,
      description: desc,
      url: `https://anitagifthouse.com/product/${product.id}`,
      siteName: 'Anita Gift House',
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.title
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} (${priceText})`,
      description: desc,
      images: [primaryImage]
    }
  };
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductClientPage initialProduct={product} />;
}
