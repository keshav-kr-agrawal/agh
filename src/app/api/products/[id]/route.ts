import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
    }

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
      } catch (e) {
        console.error('Error querying Supabase for product ID:', id, e);
      }
    }

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching product' }, { status: 500 });
  }
}
