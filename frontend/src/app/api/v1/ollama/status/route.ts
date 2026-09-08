/**
 * GET /api/v1/ollama/status
 * Returns Ollama connection status, available models, and capabilities.
 * Used by the UI to show the LLM status indicator.
 */
import { NextResponse } from 'next/server';
import { checkOllamaStatus, OLLAMA_BASE } from '@/lib/ollamaProvider';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await checkOllamaStatus();
  return NextResponse.json({
    ...status,
    provider: 'Ollama',
    base_url: OLLAMA_BASE,
    capabilities: {
      streaming: true,
      chat_api: true,
      generate_api: true,
      json_mode: true,
      embeddings: status.connected && status.models.length > 0,
      vision: false,  // No vision models detected
      tool_calling: false,  // Ollama tool calling varies by model
    },
    integration: {
      rag: status.connected,
      drafting: status.connected,
      ocr_reasoning: status.connected,
      summarization: status.connected,
      analytics: false,  // Analytics uses embedded data
      search: false,     // Search uses BM25 local index
    },
  });
}
