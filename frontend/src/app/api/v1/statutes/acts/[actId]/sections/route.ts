import { NextRequest, NextResponse } from 'next/server';
import { SECTIONS } from '@/lib/legalData';
export const dynamic = 'force-dynamic';
export async function GET(_req: NextRequest, { params }: { params: Promise<{ actId: string }> }) {
  const { actId } = await params;
  const sections = SECTIONS.filter(s => s.act_id === actId);
  return NextResponse.json(sections);
}

