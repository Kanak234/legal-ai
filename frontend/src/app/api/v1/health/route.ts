import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({
    status: 'HEALTHY',
    service: 'LegalAI Platform',
    version: '1.0.0',
    mode: 'FULLY_OFFLINE',
    engine: 'Next.js App Router + Local AI Engine',
    cloud_api_calls: 0,
    timestamp: new Date().toISOString(),
  });
}
