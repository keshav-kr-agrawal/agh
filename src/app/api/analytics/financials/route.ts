import { NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function GET() {
  const metrics = store.getFinancialMetrics();
  return NextResponse.json({ success: true, data: metrics });
}
