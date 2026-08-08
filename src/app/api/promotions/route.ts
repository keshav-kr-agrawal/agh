import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const cartTotal = searchParams.get('cartTotal') ? Number(searchParams.get('cartTotal')) : 0;

  if (code) {
    const result = store.validateCoupon(code, cartTotal);
    return NextResponse.json({ success: result.valid, ...result });
  }

  const coupons = store.getCoupons();
  const banner = store.getBanner();
  const paymentSettings = store.getPaymentSettings();
  return NextResponse.json({ success: true, coupons, banner, paymentSettings });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, coupon, bannerText, bannerActive, paymentSettings, code, cartTotal } = body;

    if (action === 'validate' || code) {
      const codeToValidate = code || (coupon && coupon.code);
      const totalToValidate = cartTotal !== undefined ? Number(cartTotal) : 0;
      const result = store.validateCoupon(codeToValidate, totalToValidate);
      return NextResponse.json({ success: result.valid, ...result });
    }

    if (action === 'updateBanner') {
      const updatedBanner = store.updateBanner(bannerText, bannerActive);
      return NextResponse.json({ success: true, banner: updatedBanner });
    }

    if (action === 'updatePaymentSettings') {
      const updatedSettings = store.updatePaymentSettings(paymentSettings || {});
      return NextResponse.json({ success: true, paymentSettings: updatedSettings });
    }

    if (coupon) {
      const updatedCoupon = store.upsertCoupon(coupon);
      return NextResponse.json({ success: true, coupon: updatedCoupon });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Promotions error' }, { status: 500 });
  }
}
