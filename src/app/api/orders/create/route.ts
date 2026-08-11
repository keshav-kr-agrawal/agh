import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

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
    // 0. IP Rate Limit Guard (Max 15 order creation attempts per minute)
    const rateLimit = checkRateLimit(request, 15, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Too many order requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      pincode,
      fulfillmentType,
      items,
      shippingFee,
      discount,
      couponCode,
      paymentProofUrl,
      paymentMethod,
      isGiftOrder,
      recipientName,
      recipientPhone,
      recipientAddress,
      recipientPincode,
      giftOccasion,
      giftNote,
      giftPackingOption,
      giftPackingBudget
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required order fields' },
        { status: 400 }
      );
    }

    // 1. Triple Stock Validation Check (Payload, DataStore, Supabase DB)
    for (const item of items) {
      const requestedQty = Number(item.quantity || 1);
      
      // Check payload stock
      const payloadStock = Number(item.product?.stock !== undefined ? item.product.stock : 0);
      if (payloadStock <= 0 || payloadStock < requestedQty) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Cannot place order: Item "${item.product?.title || 'Selected Product'}" is OUT OF STOCK! Available: ${payloadStock}, Requested: ${requestedQty}.` 
          },
          { status: 400 }
        );
      }

      // Check store memory stock
      const storeProd = store.getProductById(item.product?.id);
      if (storeProd) {
        const storeStock = Number(storeProd.stock !== undefined ? storeProd.stock : 0);
        if (storeStock <= 0 || storeStock < requestedQty) {
          return NextResponse.json(
            { 
              success: false, 
              message: `Cannot place order: Item "${storeProd.title}" is OUT OF STOCK! Available: ${storeStock}, Requested: ${requestedQty}.` 
            },
            { status: 400 }
          );
        }
      }

      // Check Supabase DB stock
      const prodId = item.product?.id;
      if (prodId) {
        try {
          const { data: supaProd } = await supabase.from('products').select('title, stock').eq('id', prodId).single();
          if (supaProd) {
            const liveStock = Number(supaProd.stock !== undefined ? supaProd.stock : 0);
            if (liveStock <= 0 || liveStock < requestedQty) {
              return NextResponse.json(
                { 
                  success: false, 
                  message: `Cannot place order: Item "${supaProd.title || item.product.title}" is OUT OF STOCK! Available: ${liveStock}, Requested: ${requestedQty}.` 
                },
                { status: 400 }
              );
            }
          }
        } catch (stockErr) {}
      }
    }

    // 2. Server-Side Price & Total Recalculation (Anti-Tampering Enforcement)
    let calculatedSubtotal = 0;
    for (const item of items) {
      const prod = store.getProductById(item.product?.id) || item.product;
      const unitPrice = Number(prod?.price || item.product?.price || 0);
      calculatedSubtotal += unitPrice * Number(item.quantity || 1);
    }
    const cleanShipping = Number(shippingFee || 0);
    const cleanDiscount = Number(discount || 0);
    const calculatedTotal = Math.max(0, calculatedSubtotal + cleanShipping - cleanDiscount);

    const order = store.createOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      address: address || '',
      pincode: pincode || '',
      fulfillmentType: fulfillmentType || 'parcel',
      paymentMethod: paymentMethod || 'online_upi',
      items,
      subtotal: calculatedSubtotal,
      shippingFee: cleanShipping,
      discount: cleanDiscount,
      couponCode: couponCode || '',
      total: calculatedTotal,
      paymentProofUrl: paymentProofUrl || '',
      isGiftOrder: Boolean(isGiftOrder),
      recipientName: recipientName || '',
      recipientPhone: recipientPhone || '',
      recipientAddress: recipientAddress || '',
      recipientPincode: recipientPincode || '',
      giftOccasion: giftOccasion || '',
      giftNote: giftNote || '',
      giftPackingOption: giftPackingOption || '',
      giftPackingBudget: Number(giftPackingBudget || 0)
    });

    // 2. Synchronous/Async Inventory Deduction & Supabase DB Insert
    (async () => {
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
          payment_proof_url: order.paymentProofUrl,
          is_gift_order: order.isGiftOrder,
          recipient_name: order.recipientName,
          recipient_phone: order.recipientPhone,
          recipient_address: order.recipientAddress,
          recipient_pincode: order.recipientPincode,
          gift_occasion: order.giftOccasion,
          gift_note: order.giftNote,
          gift_packing_option: order.giftPackingOption,
          gift_packing_budget: order.giftPackingBudget
        }]);

        // Deduct inventory stock in Supabase PostgreSQL DB
        for (const item of items) {
          const prodId = item.product?.id;
          if (prodId) {
            const { data: supaProd } = await supabase.from('products').select('stock').eq('id', prodId).single();
            if (supaProd) {
              const currentStock = Number(supaProd.stock || 0);
              const newStock = Math.max(0, currentStock - item.quantity);
              await supabase.from('products').update({ stock: newStock }).eq('id', prodId);
            }
          }
        }
      } catch (e) {
        console.error('Supabase DB order insert / stock update error:', e);
      }
    })();

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
