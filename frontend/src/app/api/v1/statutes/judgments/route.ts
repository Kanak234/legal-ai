import { NextRequest, NextResponse } from 'next/server';
import { JUDGMENTS } from '@/lib/legalData';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const court = searchParams.get('court');
  const limit = parseInt(searchParams.get('limit') || '20');
  let results = JUDGMENTS;
  if (court) results = results.filter(j => j.court.toLowerCase().includes(court.toLowerCase()));
  return NextResponse.json(results.slice(0, limit));
}
