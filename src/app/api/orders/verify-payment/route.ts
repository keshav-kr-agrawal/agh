import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminSession } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin authorization required' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status, approve, amountPaid, adminNotes } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'OrderId is required' },
        { status: 400 }
      );
    }

    const targetStatus = status || (approve ? 'VERIFIED' : 'REJECTED');
    const updatedOrder = store.updateOrderPaymentStatus(orderId, targetStatus, amountPaid, adminNotes);

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    try {
      await supabaseAdmin.from('orders').update({
        payment_status: targetStatus,
        amount_paid: amountPaid !== undefined ? amountPaid : updatedOrder.amountPaid,
        admin_discount_adjustment: updatedOrder.adminDiscountAdjustment || 0,
        order_stage: updatedOrder.orderStage,
        admin_notes: adminNotes !== undefined ? adminNotes : updatedOrder.adminNotes,
        updated_at: updatedOrder.updatedAt
      }).eq('id', orderId);
    } catch (e) {
      console.error('Supabase DB verify payment error:', e);
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Order payment status updated to ${targetStatus}`
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Verification error' }, { status: 500 });
  }
}
