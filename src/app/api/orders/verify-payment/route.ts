import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: `Order payment status updated to ${targetStatus}`
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Verification error' }, { status: 500 });
  }
}
