import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    if (action === 'delete') {
      const deleted = store.deleteOrder(orderId);
      return NextResponse.json({
        success: deleted,
        message: deleted ? 'Order permanently deleted' : 'Order not found'
      });
    }

    const result = store.cancelOrder(orderId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to process order cancellation' }, { status: 500 });
  }
}
