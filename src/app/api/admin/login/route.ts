import { NextRequest, NextResponse } from 'next/server';
import { generateAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, pin } = body;

    const validIdentifier = (identifier || '').trim().toUpperCase() === 'HKW1321';
    const activePin = process.env.ADMIN_PIN || '9199';
    const validPin = (pin || '').trim() === activePin;

    if (!validIdentifier || !validPin) {
      return NextResponse.json(
        { success: false, message: 'Invalid Admin Credentials or PIN.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'Admin Authentication Successful',
      token,
      user: {
        phone: '+91 9199272836',
        name: 'Anita Gift House Admin',
        role: 'admin'
      }
    });

    // Set secure HTTP-Only cookie for 7 days
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
