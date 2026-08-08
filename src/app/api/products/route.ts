import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const fulfillmentType = searchParams.get('fulfillmentType') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStockOnly = searchParams.get('inStockOnly') === 'true';

  const products = store.getProducts({
    category,
    search,
    fulfillmentType,
    minPrice,
    maxPrice,
    inStockOnly
  });

  return NextResponse.json({ success: true, count: products.length, data: products });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updatedProduct = store.upsertProduct(body);
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
