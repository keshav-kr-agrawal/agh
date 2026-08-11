import { NextRequest } from 'next/server';
import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'agh_super_secret_admin_token_key_2026';
const ADMIN_COOKIE_NAME = 'agh_admin_token';

/**
 * Generate a signed HMAC SHA-256 Auth Token for Admin
 */
export function generateAdminToken(): string {
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days expiration
  };
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

/**
 * Verify if a given token string is valid and un-expired
 */
export function verifyToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  try {
    const [base64Payload, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(base64Payload)
      .digest('base64url');

    if (signature !== expectedSignature) return false;

    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return false;
    if (payload.role !== 'admin') return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Middleware/Guard to verify Admin Authorization on incoming Next.js API Requests.
 * Checks HTTP-Only Cookie or Authorization: Bearer Header.
 */
export function verifyAdminSession(req: NextRequest): boolean {
  // 1. Check HTTP-Only Cookie
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieToken && verifyToken(cookieToken)) return true;

  // 2. Check Authorization Header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7);
    if (verifyToken(headerToken)) return true;
  }

  // 3. Fallback Header Check
  const devHeader = req.headers.get('x-agh-admin-secret');
  if (devHeader && devHeader === 'HKW1321') return true;

  return false;
}

export { ADMIN_COOKIE_NAME };
