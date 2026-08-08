import { NextResponse } from 'next/server';
import { store } from '@/lib/data-store';

export async function POST() {
  try {
    const result = store.purgeMonthData();
    return NextResponse.json({
      success: true,
      message: `Successfully archived and purged ${result.archivedCount} delivered orders to preserve database storage quota!`,
      data: result
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Purge operation failed' }, { status: 500 });
  }
}
