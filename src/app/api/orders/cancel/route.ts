import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';
import { verifyAdminSession } from '@/lib/auth-guard';

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin authorization required' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, action } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    if (action === 'delete') {
      const deleted = store.deleteOrder(orderId);
      try {
        await supabase.from('orders').delete().eq('id', orderId);
      } catch (e) {
        console.error('Supabase DB delete order error:', e);
      }
      return NextResponse.json({
        success: deleted,
        message: deleted ? 'Order permanently deleted' : 'Order not found'
      });
    }

    const result = store.cancelOrder(orderId);
    try {
      await supabase.from('orders').update({
        payment_status: 'CANCELLED',
        order_stage: 'CANCELLED',
        admin_notes: 'Cancelled by Customer'
      }).eq('id', orderId);
    } catch (e) {
      console.error('Supabase DB cancel order error:', e);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to process order cancellation' }, { status: 500 });
  }
}
