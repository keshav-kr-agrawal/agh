import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { supabase } from '@/lib/supabase';

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
    const { action, type, coupon, banner, bannerText, bannerActive, bgGradient, text, active, paymentSettings, code, cartTotal } = body;

    if (action === 'validate' || code) {
      const codeToValidate = code || (coupon && coupon.code);
      const totalToValidate = cartTotal !== undefined ? Number(cartTotal) : 0;
      const result = store.validateCoupon(codeToValidate, totalToValidate);
      return NextResponse.json({ success: result.valid, ...result });
    }

    if (action === 'updateBanner' || type === 'banner' || bannerText !== undefined || text !== undefined) {
      const txt = text !== undefined ? text : (bannerText !== undefined ? bannerText : (banner?.text || ''));
      const act = active !== undefined ? active : (bannerActive !== undefined ? bannerActive : (banner?.active ?? true));
      const grad = bgGradient || banner?.bgGradient || 'from-crimson via-terracotta to-crimson';

      const updatedBanner = store.updateBanner(txt, act, grad);
      try {
        await supabase.from('banner').upsert([{
          id: updatedBanner.id,
          text: updatedBanner.text,
          active: updatedBanner.active,
          bg_gradient: updatedBanner.bgGradient
        }]);
      } catch (e) {
        console.error('Supabase banner upsert error:', e);
      }
      return NextResponse.json({ success: true, banner: updatedBanner });
    }

    if (action === 'updatePaymentSettings') {
      const updatedSettings = store.updatePaymentSettings(paymentSettings || {});
      return NextResponse.json({ success: true, paymentSettings: updatedSettings });
    }

    if (coupon) {
      const updatedCoupon = store.upsertCoupon(coupon);
      try {
        await supabase.from('coupons').upsert([{
          id: updatedCoupon.id,
          code: updatedCoupon.code,
          discount_type: updatedCoupon.discountType,
          discount_value: updatedCoupon.discountValue,
          min_cart_value: updatedCoupon.minCartValue,
          usage_limit: updatedCoupon.usageLimit,
          expiry_date: updatedCoupon.expiryDate,
          active: updatedCoupon.active
        }]);
      } catch (e) {
        console.error('Supabase coupon upsert error:', e);
      }
      return NextResponse.json({ success: true, coupon: updatedCoupon });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Promotions error' }, { status: 500 });
  }
}
