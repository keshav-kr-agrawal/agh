import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customerPhone = searchParams.get('customerPhone') || undefined;

  const orders = store.getOrders(customerPhone);
  return NextResponse.json({ success: true, count: orders.length, data: orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      pincode,
      fulfillmentType,
      items,
      subtotal,
      shippingFee,
      discount,
      couponCode,
      total,
      paymentProofUrl
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required order fields' },
        { status: 400 }
      );
    }

    const order = store.createOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      address: address || '',
      pincode: pincode || '',
      fulfillmentType: fulfillmentType || 'parcel',
      paymentMethod: body.paymentMethod || 'online_upi',
      items,
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 0,
      discount: discount || 0,
      couponCode: couponCode || '',
      total: total || 0,
      paymentProofUrl: paymentProofUrl || ''
    });

    const upiPayload = `upi://pay?pa=anitagifthouse@upi&pn=Anita%20Gift%20House&am=${order.total}&tr=${order.id}&tn=Order%20${order.id}%20Anita%20Gift%20House`;

    return NextResponse.json({
      success: true,
      data: order,
      upiPayload
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Order creation failed' }, { status: 500 });
  }
}
