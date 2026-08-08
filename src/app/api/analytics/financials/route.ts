import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';
import { Order, OverheadExpense } from '@/types';

export async function GET() {
  try {
    // 1. Fetch live orders from Supabase
    const { data: supaOrders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch live overheads from store
    const overheads = store.getOverheads();
    const totalOverheads = overheads.reduce((sum: number, ov: OverheadExpense) => sum + (Number(ov.amount) || 0), 0);

    let ordersList: Order[] = [];
    if (!ordersErr && supaOrders && supaOrders.length > 0) {
      ordersList = supaOrders.map(o => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerEmail: o.customer_email,
        address: o.address,
        pincode: o.pincode,
        fulfillmentType: o.fulfillment_type,
        paymentMethod: o.payment_method,
        items: o.items || [],
        subtotal: Number(o.subtotal || 0),
        shippingFee: Number(o.shipping_fee || 0),
        discount: Number(o.discount || 0),
        adminDiscountAdjustment: Number(o.admin_discount_adjustment || 0),
        couponCode: o.coupon_code || '',
        total: Number(o.total || 0),
        amountPaid: Number(o.amount_paid || 0),
        paymentStatus: o.payment_status || 'PENDING_VERIFICATION',
        orderStage: o.order_stage || 'BOOKED',
        trackingNumber: o.tracking_number,
        paymentProofUrl: o.payment_proof_url,
        adminNotes: o.admin_notes,
        createdAt: o.created_at,
        updatedAt: o.updated_at
      }));
    } else {
      ordersList = store.getOrders();
    }

    // Calculate metrics
    const verifiedOrders = ordersList.filter(
      o => o.paymentStatus === 'VERIFIED' || o.paymentStatus === 'PAY_AT_PICKUP' || o.paymentStatus === 'PARTIALLY_PAID'
    );

    let totalRevenue = 0;
    let totalCost = 0;
    let handpickedOrdersCount = 0;
    let parcelOrdersCount = 0;

    const categoryMap: Record<string, { count: number; revenue: number }> = {};
    const itemProfitMap: Record<string, { title: string; revenue: number; profit: number; salesCount: number; cost: number }> = {};

    verifiedOrders.forEach(order => {
      const collected = order.amountPaid !== undefined && order.amountPaid > 0 ? order.amountPaid : order.total;
      totalRevenue += collected;

      if (order.fulfillmentType === 'handpicked') {
        handpickedOrdersCount++;
      } else {
        parcelOrdersCount++;
      }

      (order.items || []).forEach(item => {
        const cp = item.product?.costPrice || 0;
        const price = item.product?.price || 0;
        const itemRevenue = price * item.quantity;
        const itemTotalCost = cp * item.quantity;

        totalCost += itemTotalCost;

        const cat = item.product?.category || 'Gifts';
        if (!categoryMap[cat]) categoryMap[cat] = { count: 0, revenue: 0 };
        categoryMap[cat].count += item.quantity;
        categoryMap[cat].revenue += itemRevenue;

        const prodId = item.product?.id || `prod-${Math.random()}`;
        const prodTitle = item.product?.title || 'Custom Item';

        if (!itemProfitMap[prodId]) {
          itemProfitMap[prodId] = { title: prodTitle, revenue: 0, profit: 0, salesCount: 0, cost: 0 };
        }
        itemProfitMap[prodId].revenue += itemRevenue;
        itemProfitMap[prodId].cost += itemTotalCost;
        itemProfitMap[prodId].profit += (itemRevenue - itemTotalCost);
        itemProfitMap[prodId].salesCount += item.quantity;
      });
    });

    const grossProfit = totalRevenue - totalCost;
    const netProfit = grossProfit - totalOverheads;
    const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

    const salesByCategory = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue
    }));

    const sortedItems = Object.values(itemProfitMap).sort((a, b) => b.profit - a.profit);
    const topProfitableItems = sortedItems.slice(0, 5).map(i => ({
      title: i.title,
      revenue: i.revenue,
      profit: i.profit
    }));

    const metrics = {
      totalRevenue,
      totalCost,
      totalOverheads,
      grossProfit,
      netProfit,
      profitMargin,
      handpickedOrdersCount,
      parcelOrdersCount,
      totalOrdersCount: ordersList.length,
      verifiedOrdersCount: verifiedOrders.length,
      salesByCategory,
      topProfitableItems
    };

    return NextResponse.json({ success: true, data: metrics, overheads });
  } catch (err: any) {
    console.error('Financials API error:', err);
    return NextResponse.json({ success: false, data: store.getFinancialMetrics() });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOverhead = store.addOverhead(body);
    return NextResponse.json({ success: true, data: newOverhead });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add overhead' }, { status: 400 });
  }
}
