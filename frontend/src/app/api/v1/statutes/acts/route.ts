import { NextResponse } from 'next/server';
import { ACTS } from '@/lib/legalData';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json(ACTS);
}
