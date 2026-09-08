import { NextResponse } from 'next/server';
import { CROSS_MAPPINGS } from '@/lib/legalData';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json(CROSS_MAPPINGS);
}
