import { NextRequest } from 'next/server';
import {
  checkOllamaStatus,
  getModelForTask,
  ollamaStream,
  PERSONA_SYSTEM_PROMPTS,
  LEGAL_SYSTEM_PROMPT,
} from '@/lib/ollamaProvider';
import { buildContext } from '@/lib/ragContext';

export const dynamic = 'force-dynamic';

/**
 * Streaming RAG endpoint — Server-Sent Events (SSE)
 * GET /api/v1/rag/stream?q=...&persona=...
 *
 * Used by the AI chat UI for real-time token streaming.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const persona = searchParams.get('persona') || 'Advocate';

  if (!query.trim()) {
    return new Response('data: {"error":"q param required"}\n\n', {
      status: 400,
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const status = await checkOllamaStatus();

        if (!status.connected) {
          const msg = JSON.stringify({
            type: 'error',
            message: `Ollama is not running. Start it with: ollama serve\nError: ${status.error}`,
          });
          controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
          controller.close();
          return;
        }

        const model = getModelForTask('rag', status.models);
        const context = buildContext(query);
        const systemPrompt = PERSONA_SYSTEM_PROMPTS[persona] ?? LEGAL_SYSTEM_PROMPT;

        // Send metadata first
        const meta = JSON.stringify({
          type: 'meta',
          model,
          persona,
          ollama_status: 'CONNECTED',
        });
        controller.enqueue(encoder.encode(`data: ${meta}\n\n`));

        const messages = [
          {
            role: 'user',
            content: `LEGAL CONTEXT:\n${context}\n\nQUESTION: ${query}\n\nProvide a structured legal analysis with sections, precedents, and practical guidance.`,
          },
        ];

        // Stream tokens
        for await (const token of ollamaStream(messages, {
          model,
          system: systemPrompt,
          temperature: 0.2,
          max_tokens: 1500,
        })) {
          const chunk = JSON.stringify({ type: 'token', content: token });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        }

        // Send done signal
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      } catch (e: unknown) {
        const msg = JSON.stringify({ type: 'error', message: (e as Error)?.message });
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
