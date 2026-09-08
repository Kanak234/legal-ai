import { NextRequest, NextResponse } from 'next/server';
import { localSearch } from '@/lib/localAI';
import { CROSS_MAPPINGS } from '@/lib/legalData';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const act_id = searchParams.get('act_id') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!q.trim()) return NextResponse.json({ error: 'q param required' }, { status: 400 });

  const { sections, judgments } = localSearch(q, act_id);
  const qLower = q.toLowerCase();
  const matchedMappings = CROSS_MAPPINGS.filter(m =>
    m.subject?.toLowerCase().includes(qLower) ||
    m.old_section?.toLowerCase().includes(qLower) ||
    m.new_section?.toLowerCase().includes(qLower) ||
    m.key_change?.toLowerCase().includes(qLower)
  ).slice(0, limit);

  return NextResponse.json({
    statutes: sections.slice(0, limit),
    judgments: judgments.slice(0, limit),
    mappings: matchedMappings,
    total: sections.length + judgments.length + matchedMappings.length,
    query: q,
    engine: 'LocalAI-BM25 (Offline)',
  });
}
