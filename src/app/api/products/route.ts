import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const fulfillmentType = searchParams.get('fulfillmentType') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStockOnly = searchParams.get('inStockOnly') === 'true';

  let products = store.getProducts({
    category,
    search,
    fulfillmentType,
    minPrice,
    maxPrice,
    inStockOnly
  });

  // If in-memory store is empty or needs refresh, fetch directly from Supabase
  if (products.length === 0) {
    try {
      const { data: supaProds, error } = await supabase.from('products').select('*').order('priority_score', { ascending: false });
      if (!error && supaProds && supaProds.length > 0) {
        supaProds.forEach(p => {
          store.upsertProduct({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            keywords: p.keywords || [],
            costPrice: Number(p.cost_price || 0),
            mrp: Number(p.mrp || 0),
            price: Number(p.price || 0),
            stock: Number(p.stock || 0),
            priorityScore: Number(p.priority_score || 50),
            urgencyFlag: Boolean(p.urgency_flag),
            isHandpickedFeatured: Boolean(p.is_handpicked_featured),
            images: p.images || [],
            specs: p.specs || {},
            occasion: p.occasion,
            createdAt: p.created_at
          });
        });
        products = store.getProducts({
          category,
          search,
          fulfillmentType,
          minPrice,
          maxPrice,
          inStockOnly
        });
      }
    } catch (e) {}
  }

  return NextResponse.json({ success: true, count: products.length, data: products });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updatedProduct = store.upsertProduct(body);

    // Non-blocking async Supabase sync
    (async () => {
      try {
        await supabase.from('products').upsert([{
          id: updatedProduct.id,
          title: updatedProduct.title,
          description: updatedProduct.description,
          category: updatedProduct.category,
          keywords: updatedProduct.keywords,
          cost_price: updatedProduct.costPrice,
          mrp: updatedProduct.mrp,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          priority_score: updatedProduct.priorityScore,
          urgency_flag: updatedProduct.urgencyFlag,
          is_handpicked_featured: updatedProduct.isHandpickedFeatured,
          images: updatedProduct.images,
          specs: updatedProduct.specs,
          occasion: updatedProduct.occasion
        }]);
      } catch (e) {
        console.error('Supabase product upsert error:', e);
      }
    })();

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
    }

    if (id === 'all') {
      const currentProds = store.getProducts();
      currentProds.forEach(p => store.deleteProduct(p.id));
      (async () => {
        try {
          await supabase.from('products').delete().neq('id', '0');
        } catch (e) {}
      })();
      return NextResponse.json({ success: true, message: 'All products purged' });
    }

    store.deleteProduct(id);
    (async () => {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {}
    })();

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
  }
}
