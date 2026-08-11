import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth-guard';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Admin Logged Out'
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
