import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customerPhone = searchParams.get('customerPhone') || undefined;

  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (customerPhone) {
      query = query.eq('customer_phone', customerPhone);
    }
    const { data: supaOrders, error } = await query;
    
    if (!error && supaOrders && supaOrders.length > 0) {
      const formatted = supaOrders.map(o => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerEmail: o.customer_email,
        address: o.address,
        pincode: o.pincode,
        fulfillmentType: o.fulfillment_type,
        paymentMethod: o.payment_method,
        items: o.items,
        subtotal: Number(o.subtotal),
        shippingFee: Number(o.shipping_fee),
        discount: Number(o.discount),
        adminDiscountAdjustment: Number(o.admin_discount_adjustment || 0),
        couponCode: o.coupon_code,
        total: Number(o.total),
        amountPaid: Number(o.amount_paid),
        paymentStatus: o.payment_status,
        orderStage: o.order_stage,
        trackingNumber: o.tracking_number,
        paymentProofUrl: o.payment_proof_url,
        adminNotes: o.admin_notes,
        createdAt: o.created_at,
        updatedAt: o.updated_at
      }));
      return NextResponse.json({ success: true, count: formatted.length, data: formatted });
    }
  } catch (e) {
    console.error('Supabase DB GET error:', e);
  }

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
      paymentProofUrl,
      paymentMethod
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
      paymentMethod: paymentMethod || 'online_upi',
      items,
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 0,
      discount: discount || 0,
      couponCode: couponCode || '',
      total: total || 0,
      paymentProofUrl: paymentProofUrl || ''
    });

    // Sync to Supabase PostgreSQL DB
    try {
      await supabase.from('orders').insert([{
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail,
        address: order.address,
        pincode: order.pincode,
        fulfillment_type: order.fulfillmentType,
        payment_method: order.paymentMethod,
        items: order.items,
        subtotal: order.subtotal,
        shipping_fee: order.shippingFee,
        discount: order.discount,
        admin_discount_adjustment: order.adminDiscountAdjustment || 0,
        coupon_code: order.couponCode,
        total: order.total,
        amount_paid: order.amountPaid,
        payment_status: order.paymentStatus,
        order_stage: order.orderStage,
        payment_proof_url: order.paymentProofUrl
      }]);
    } catch (e) {
      console.error('Supabase DB order insert error:', e);
    }

    const upiPayload = `upi://pay?pa=9199272836@okbizaxis&pn=Anita%20Gift%20House&am=${order.total}&tr=${order.id}&tn=Order%20${order.id}`;

    return NextResponse.json({
      success: true,
      data: order,
      upiPayload
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Order creation failed' },
      { status: 500 }
    );
  }
}
