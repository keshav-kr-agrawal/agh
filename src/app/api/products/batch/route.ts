import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids, category, discountPercent } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No product IDs selected' }, { status: 400 });
    }

    if (action === 'delete') {
      const result = store.batchUpdateProducts(ids, { delete: true });
      try {
        await supabase.from('products').delete().in('id', ids);
      } catch (e) {
        console.error('Supabase batch delete error:', e);
      }
      return NextResponse.json({ success: true, count: result.updated });
    }

    if (action === 'updateCategory' && category) {
      const result = store.batchUpdateProducts(ids, { category });
      try {
        await supabase.from('products').update({ category }).in('id', ids);
      } catch (e) {
        console.error('Supabase batch category update error:', e);
      }
      return NextResponse.json({ success: true, count: result.updated });
    }

    if (action === 'applyDiscount' && discountPercent) {
      const result = store.batchUpdateProducts(ids, { discountPercent });
      const currentProds = store.getProducts();
      const updatedItems = currentProds.filter(p => ids.includes(p.id));
      for (const p of updatedItems) {
        try {
          await supabase.from('products').update({ price: p.price }).eq('id', p.id);
        } catch (e) {}
      }
      return NextResponse.json({ success: true, count: result.updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid batch action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Batch action failed' }, { status: 500 });
  }
}
