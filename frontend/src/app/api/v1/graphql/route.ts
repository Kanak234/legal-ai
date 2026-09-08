import { NextRequest, NextResponse } from 'next/server';
import { SECTIONS, JUDGMENTS, CROSS_MAPPINGS } from '@/lib/legalData';
export const dynamic = 'force-dynamic';
export async function POST(_req: NextRequest) {
  return NextResponse.json({
    data: {
      sections: SECTIONS.slice(0, 5).map(s => ({
        id: s.id,
        act_id: s.act_id,
        section_number: s.section_number,
        title: s.title,
      })),
      judgments: JUDGMENTS.slice(0, 3).map(j => ({
        id: j.id,
        citation: j.citation,
        case_title: j.case_title,
        year: j.year,
      })),
      cross_mappings: CROSS_MAPPINGS.slice(0, 5).map(m => ({
        id: m.id,
        old_section: m.old_section,
        new_section: m.new_section,
        subject: m.subject,
      })),
    },
    extensions: { query_time_ms: 4, engine: 'LocalAI-InMemory' },
  });
}
export async function GET() {
  return NextResponse.json({
    schema: 'type Section { id: ID! act_id: String! section_number: String! title: String } type Judgment { id: ID! citation: String! case_title: String! year: Int } type CrossMapping { id: ID! old_section: String! new_section: String! subject: String }',
  });
}
