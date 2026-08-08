import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pincode, weightGrams = 500, orderId } = body;

    if (!pincode) {
      return NextResponse.json({ success: false, message: 'Pincode is required' }, { status: 400 });
    }

    const pinNum = parseInt(pincode, 10);
    const available = !isNaN(pinNum) && pincode.length === 6;

    let rate = 60;
    if (weightGrams > 1000) {
      rate += Math.ceil((weightGrams - 1000) / 500) * 30;
    }

    const awbNumber = `AGH-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    if (orderId) {
      store.assignTrackingNumber(orderId, awbNumber);
    }

    return NextResponse.json({
      success: true,
      data: {
        pincode,
        rate,
        estimatedDays: pincode.startsWith('11') || pincode.startsWith('12') ? 2 : 4,
        available,
        awbNumber,
        courier: 'Anita Gift House Express Parcel'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Shipping rate calculation failed' }, { status: 500 });
  }
}
