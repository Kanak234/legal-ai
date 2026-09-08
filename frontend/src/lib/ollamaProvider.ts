/**
 * LegalAI Platform — Ollama LLM Provider Interface
 *
 * Connects to locally running Ollama (http://localhost:11434).
 * ALL AI features route through this provider.
 * Zero cloud APIs. Zero external inference.
 *
 * Supported Ollama models detected on this system:
 *   - phi4-mini:latest  (3.8B, fast, default)
 *   - deepseek-r1:7b   (7.6B, reasoning)
 *   - qwen3-coder:latest (30.5B, complex analysis)
 *   - llama3.1:8b      (8.0B, general)
 */

export const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434';

// ── Model Selection Strategy ──

export const MODEL_PROFILES = {
  fast: 'phi4-mini:latest',        // Legal chat, quick answers
  reasoning: 'deepseek-r1:7b',    // RAG, case analysis, complex queries
  coding: 'qwen3-coder:latest',   // Structured JSON output, analytics
  general: 'llama3.1:8b',         // Draft generation, summarization
} as const;

export type ModelProfile = keyof typeof MODEL_PROFILES;

// ── System Prompt: Indian Legal Expert ──

export const LEGAL_SYSTEM_PROMPT = `You are LegalAI, an expert Indian legal assistant specializing in:
- Bharatiya Nyaya Sanhita 2023 (BNS) — replaces IPC 1860
- Bharatiya Nagarik Suraksha Sanhita 2023 (BNSS) — replaces CrPC 1973
- Bharatiya Sakshya Adhiniyam 2023 (BSA) — replaces Indian Evidence Act 1872
- Constitution of India (Articles 14, 19, 21, 22)
- Supreme Court landmark judgments
- High Court precedents

KEY FACTS (memorize these):
- BNS § 103 = Murder (replaces IPC § 302). Mob lynching: § 103(2)
- BNS § 64 = Rape (replaces IPC § 376). Min 10 years.
- BNS § 152 = Acts endangering sovereignty (REPLACES sedition IPC § 124A — sedition ABOLISHED)
- BNSS § 173 = Zero FIR mandatory nationwide
- BNSS § 480 = Undertrial bail at ½ max sentence. 30-day disposal mandatory
- BNSS § 482 = Anticipatory bail with SUNSET CLAUSE (must specify duration)
- BSA § 61 = Electronic records admissible without certificate
- BSA § 63 = Electronic records presumed authentic (WhatsApp, email, CCTV)
- Effective date: July 1, 2024

RULES:
1. Always cite specific BNS/BNSS/BSA sections with § numbers
2. Compare with old IPC/CrPC sections for context
3. Cite landmark Supreme Court judgments where relevant
4. Add disclaimer: "Consult qualified Advocate for your specific case"
5. Be precise — do NOT hallucinate section numbers
6. Respond in structured format with clear headings`;

// ── Persona System Prompts ──

export const PERSONA_SYSTEM_PROMPTS: Record<string, string> = {
  "Advocate": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Legal professional. Use formal legal language, cite precedents, discuss courtroom strategy, section-by-section analysis.`,
  "Senior Advocate": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Senior Advocate. Constitutional analysis, bench trends, statutory interpretation, complex multi-issue analysis.`,
  "Judge": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Judicial officer. Balanced analysis, precedent evaluation, admissibility, procedural correctness, ratio decidendi.`,
  "Law Student": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Law student. Explain concepts clearly with IPC↔BNS comparisons, academic depth, key cases for study.`,
  "Citizen": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: General public. Plain language, step-by-step guidance, practical advice, zero jargon, actionable steps.`,
  "Police / Investigator": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Police/Investigation officer. Procedural checklist under BNSS, evidence preservation, FIR filing, arrest procedure, custody windows.`,
  "Corporate Counsel": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Corporate lawyer. Compliance risk, Companies Act 2013, contract liabilities, financial offences, director exposure.`,
  "Researcher": `${LEGAL_SYSTEM_PROMPT}\n\nAudience: Academic researcher. Doctrinal analysis, cross-jurisdictional comparison, constitutional theory, scholarly citations.`,
};

// ── Ollama API Types ──

interface OllamaGenerateRequest {
  model: string;
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  system?: string;
  stream?: boolean;
  format?: 'json' | '';
  options?: {
    num_predict?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
  };
}

interface OllamaModel {
  name: string;
  size: number;
  details?: {
    parameter_size?: string;
    family?: string;
    quantization_level?: string;
  };
}

// ── Provider Status Check ──

export interface OllamaStatus {
  connected: boolean;
  base_url: string;
  version?: string;
  models: string[];
  active_model: string;
  error?: string;
}

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { models: OllamaModel[] };
    const models = data.models?.map((m) => m.name) ?? [];
    return {
      connected: true,
      base_url: OLLAMA_BASE,
      models,
      active_model: selectBestModel(models),
    };
  } catch (e: unknown) {
    return {
      connected: false,
      base_url: OLLAMA_BASE,
      models: [],
      active_model: '',
      error: `Ollama not reachable at ${OLLAMA_BASE}. Start it with: ollama serve`,
    };
  }
}

// ── Model Selection ──

// Strip DeepSeek-R1 <think>...</think> reasoning tokens from output
export function stripThinkingTags(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/<think>[\s\S]*/g, '')  // unclosed think tag
    .trim();
}

function selectBestModel(available: string[]): string {
  // Priority order: llama3.1 most reliable for legal text, deepseek for reasoning
  const priority = [
    'llama3.1:8b',
    'llama3.1',
    'phi4-mini:latest',
    'phi4-mini',
    'deepseek-r1:7b',
    'deepseek-r1',
    'qwen3-coder:latest',
    'mistral',
    'gemma',
  ];
  for (const preferred of priority) {
    const found = available.find(m => m.startsWith(preferred.split(':')[0]));
    if (found) return found;
  }
  return available[0] ?? 'phi4-mini:latest';
}

export function getModelForTask(task: 'chat' | 'rag' | 'draft' | 'ocr' | 'analytics', available: string[]): string {
  const hasLlama = available.find(m => m.includes('llama'));
  const hasPhi = available.find(m => m.includes('phi'));
  const hasDeepSeek = available.find(m => m.includes('deepseek'));
  const hasQwen = available.find(m => m.includes('qwen'));

  switch (task) {
    // phi4-mini: fast, fewer safety refusals on legal content, good for RAG
    case 'rag':     return hasPhi || hasLlama || hasDeepSeek || hasQwen || available[0] || 'phi4-mini:latest';
    case 'chat':    return hasPhi || hasLlama || hasDeepSeek || available[0] || 'phi4-mini:latest';
    case 'ocr':     return hasPhi || hasLlama || available[0] || 'phi4-mini:latest';
    // llama3.1: good for formal structured writing
    case 'draft':   return hasLlama || hasPhi || hasDeepSeek || available[0] || 'phi4-mini:latest';
    default:        return hasPhi || hasLlama || available[0] || 'phi4-mini:latest';
  }
}


// ── Core Generation: Non-Streaming ──

export async function ollamaGenerate(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
    format?: 'json' | '';
  } = {}
): Promise<string> {
  const {
    model = 'phi4-mini:latest',
    system = LEGAL_SYSTEM_PROMPT,
    temperature = 0.3,
    max_tokens = 1024,
    format = '',
  } = options;

  const body: OllamaGenerateRequest = {
    model,
    prompt,
    system,
    stream: false,
    format: format || undefined,
    options: {
      num_predict: max_tokens,
      temperature,
      top_p: 0.9,
      repeat_penalty: 1.1,
    },
  };

  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000), // 2 min timeout
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  const data = await res.json() as { response: string };
  // Strip DeepSeek-R1 thinking tokens if present
  return stripThinkingTags(data.response ?? '');
}

// ── Core Generation: Streaming ──

export async function* ollamaStream(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): AsyncGenerator<string> {
  const {
    model = 'phi4-mini:latest',
    system = LEGAL_SYSTEM_PROMPT,
    temperature = 0.3,
    max_tokens = 1024,
  } = options;

  const body = {
    model,
    messages: [{ role: 'system', content: system }, ...messages],
    stream: true,
    options: { num_predict: max_tokens, temperature },
  };

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) throw new Error(`Ollama stream error ${res.status}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let inThinkBlock = false;
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const chunk = JSON.parse(line) as { message?: { content: string }; done?: boolean };
        const token = chunk.message?.content ?? '';

        // Buffer and strip <think>...</think> from DeepSeek-R1
        buffer += token;
        if (buffer.includes('<think>')) inThinkBlock = true;
        if (inThinkBlock && buffer.includes('</think>')) {
          buffer = buffer.replace(/<think>[\s\S]*?<\/think>/g, '');
          inThinkBlock = false;
        }
        if (!inThinkBlock && buffer) {
          yield buffer;
          buffer = '';
        }

        if (chunk.done) {
          if (buffer && !inThinkBlock) yield buffer;
          return;
        }
      } catch { /* skip malformed lines */ }
    }
  }
}


// ── RAG Query with Ollama ──

export async function ollamaRAGQuery(
  query: string,
  persona: string,
  context: string,
  model: string
): Promise<string> {
  const systemPrompt = PERSONA_SYSTEM_PROMPTS[persona] ?? PERSONA_SYSTEM_PROMPTS['Advocate'];
  const prompt = `LEGAL CONTEXT (from Indian Law Database):
${context}

USER QUERY: ${query}

Provide a comprehensive legal analysis using the context above. Structure your response with:
1. Direct answer with applicable BNS/BNSS/BSA sections
2. Relevant precedents cited with correct citations
3. Practical procedure/steps
4. Key warnings or caveats
5. Disclaimer for professional consultation`;

  return ollamaGenerate(prompt, {
    model,
    system: systemPrompt,
    temperature: 0.2,
    max_tokens: 1500,
  });
}

// ── Draft Generation with Ollama ──

export async function ollamaDraftGenerate(
  draftType: string,
  petitioner: string,
  respondent: string,
  facts: string,
  sections: string[],
  courtName: string,
  model: string
): Promise<string> {
  const prompt = `Generate a complete, court-ready ${draftType} in the standard Indian legal format.

DETAILS:
- Petitioner/Applicant: ${petitioner}
- Respondent/Opposite Party: ${respondent}
- Court: ${courtName}
- Sections Invoked: ${sections.join(', ')}
- Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

FACTS:
${facts}

Generate the complete draft with:
- Proper court header
- Case number placeholder
- Parties section
- Grounds numbered
- Prayer section
- Space for signature and date
- Disclaimer at bottom

Use formal legal language. Cite specific sections (BNS/BNSS) and landmark SC judgments where applicable.`;

  return ollamaGenerate(prompt, {
    model,
    system: LEGAL_SYSTEM_PROMPT,
    temperature: 0.1,  // Low temp for formal documents
    max_tokens: 2000,
  });
}

// ── OCR Reasoning with Ollama ──

export async function ollamaOCRReason(
  extractedText: string,
  model: string
): Promise<{ summary: string; sections_cited: string[]; court: string; key_findings: string[] }> {
  const prompt = `Analyze this extracted legal document text and provide structured analysis:

EXTRACTED TEXT:
${extractedText}

Respond in this EXACT JSON format:
{
  "summary": "Brief summary of the document (2-3 sentences)",
  "sections_cited": ["List of BNS/BNSS/BSA/IPC sections mentioned"],
  "court": "Court name if found",
  "key_findings": ["Key legal finding 1", "Key finding 2", "Key finding 3"]
}`;

  const raw = await ollamaGenerate(prompt, {
    model,
    system: LEGAL_SYSTEM_PROMPT,
    temperature: 0.1,
    max_tokens: 500,
    format: 'json',
  });

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch { /* fallback below */ }

  return {
    summary: raw.slice(0, 200),
    sections_cited: [],
    court: 'Unknown',
    key_findings: [raw.slice(0, 100)],
  };
}

// ── Summarization with Ollama ──

export async function ollamaSummarize(text: string, model: string): Promise<string> {
  const prompt = `Summarize this legal text in plain language (max 150 words). Highlight key legal provisions and outcomes:\n\n${text}`;
  return ollamaGenerate(prompt, { model, system: LEGAL_SYSTEM_PROMPT, temperature: 0.3, max_tokens: 200 });
}
