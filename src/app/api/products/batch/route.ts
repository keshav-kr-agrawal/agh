import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids, category, discountPercent } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No product IDs selected' }, { status: 400 });
    }

    if (action === 'delete') {
      const result = store.batchUpdateProducts(ids, { delete: true });
      return NextResponse.json({ success: true, count: result.updated });
    }

    if (action === 'updateCategory' && category) {
      const result = store.batchUpdateProducts(ids, { category });
      return NextResponse.json({ success: true, count: result.updated });
    }

    if (action === 'applyDiscount' && discountPercent) {
      const result = store.batchUpdateProducts(ids, { discountPercent });
      return NextResponse.json({ success: true, count: result.updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid batch action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Batch action failed' }, { status: 500 });
  }
}
