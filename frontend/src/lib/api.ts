/**
 * LegalAI Platform — API Client
 * All routes are embedded in Next.js at /api/v1/*
 * Zero external backend process. Zero cloud APIs.
 */

// Always use relative /api/v1/* — works in browser and SSR
const BASE = '/api/v1';

// ── Utility ──

async function get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  let url = `${BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
    ).toString();
    if (qs) url += `?${qs}`;
  }
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ── Health ──

export async function fetchHealth() {
  try { return await get<HealthResponse>('/health'); }
  catch { return { status: 'OFFLINE', online: false }; }
}

// ── RAG / AI Query ──

export async function executeRAGQuery(query: string, persona: string, act_filter?: string) {
  try {
    return await post<RAGResponse>('/rag/query', { query, persona, act_filter });
  } catch (e: unknown) {
    const msg = (e as Error)?.message ?? 'Unknown error';
    return {
      answer: `⚠️ AI Engine error: ${msg}\n\nPlease try refreshing the page.`,
      persona,
      confidence_score: 0,
      citations: [],
      reasoning_steps: [`Error: ${msg}`],
      hallucination_warning: true,
      sources_retrieved: 0,
      model_used: 'ERROR',
    } as RAGResponse;
  }
}

// ── Search ──

export async function executeSearch(q: string, act_id?: string, court?: string, limit = 10) {
  try { return await get<SearchResponse>('/search', { q, act_id, court, limit }); }
  catch { return { statutes: [], judgments: [], mappings: [], total: 0 }; }
}

// ── Statutes ──

export async function fetchActs() {
  try { return await get<Act[]>('/statutes/acts'); }
  catch { return [] as Act[]; }
}

export async function fetchActSections(actId: string) {
  try { return await get<Section[]>(`/statutes/acts/${actId}/sections`); }
  catch { return [] as Section[]; }
}

export async function fetchCrossMappings() {
  try { return await get<CrossMapping[]>('/statutes/mappings'); }
  catch { return [] as CrossMapping[]; }
}

export async function fetchJudgments(court?: string, limit = 20) {
  try { return await get<Judgment[]>('/statutes/judgments', { court, limit }); }
  catch { return [] as Judgment[]; }
}

// ── Drafting ──

export interface DraftRequest {
  draft_type: string;
  petitioner_name: string;
  respondent_name: string;
  facts: string;
  court_name?: string;
  sections_invoked?: string[];
}

export async function generateDraft(req: DraftRequest) {
  try { return await post<DraftResponse>('/drafting/generate', req); }
  catch (e: unknown) { return { error: (e as Error)?.message, generated_content: null }; }
}

// ── Analytics ──

export async function fetchAnalytics() {
  try { return await get<AnalyticsResponse>('/analytics/summary'); }
  catch { return null; }
}

// ── Models ──

export async function fetchModelStatus() {
  try { return await get<ModelStatusResponse>('/models/status'); }
  catch { return { models: [], infrastructure: {} }; }
}

// ── Training ──

export async function fetchTrainingStatus() {
  try { return await get<TrainingResponse>('/training/status'); }
  catch { return { pipeline_steps: [], metrics: {} }; }
}

// ── OCR ──

export async function uploadForOCR(file: File) {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${BASE}/ocr/process`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  } catch (e: unknown) {
    return { error: (e as Error)?.message, extracted_text: null };
  }
}

// ── Audit ──

export async function fetchAuditReport() {
  try { return await get<AuditResponse>('/audit/report'); }
  catch { return { audit_score: 0, modules: [] }; }
}

// ── Types ──

export interface HealthResponse {
  status: string;
  service?: string;
  version?: string;
  mode?: string;
  online?: boolean;
  timestamp?: string;
}

export interface Citation {
  source_title: string;
  citation: string;
  section_or_article: string;
  snippet: string;
}

export interface RAGResponse {
  answer: string;
  persona: string;
  confidence_score: number;
  citations: Citation[];
  reasoning_steps: string[];
  hallucination_warning: boolean;
  response_time_ms?: number;
  model_used: string;
  sources_retrieved: number;
}

export interface SearchResponse {
  statutes: Section[];
  judgments: Judgment[];
  mappings: CrossMapping[];
  total: number;
  query?: string;
  engine?: string;
}

export interface Act {
  id: string;
  title: string;
  year: number;
  category: string;
  description: string;
  total_sections: number;
  is_active: boolean;
  replaces_act: string | null;
}

export interface Section {
  id: string;
  act_id: string;
  section_number: string;
  title: string;
  content: string;
  explanation?: string;
  ipc_corresponding?: string | null;
  penalty_years?: number | null;
  is_bailable?: boolean | null;
}

export interface CrossMapping {
  id: string;
  old_act: string;
  old_section: string;
  new_act: string;
  new_section: string;
  subject: string;
  key_change: string;
}

export interface Judgment {
  id: string;
  case_title: string;
  citation: string;
  court: string;
  year: number;
  bench: string;
  summary: string;
  ratio_decidendi: string;
  outcome: string;
}

export interface DraftResponse {
  id?: string;
  title?: string;
  draft_type?: string;
  generated_content: string | null;
  sections_cited?: string[];
  word_count?: number;
  disclaimer?: string;
  generated_at?: string;
  error?: string;
}

export interface AnalyticsResponse {
  metrics: Record<string, string | number | boolean>;
  charts?: {
    court_distribution?: Array<{ name: string; value: number }>;
    monthly_case_trends?: Array<Record<string, string | number>>;
    top_judges_precedents?: Array<Record<string, string | number>>;
  };
}

export interface ModelStatusResponse {
  models: Array<{
    name: string;
    type: string;
    status: string;
    latency_ms: number;
    accuracy: string;
    ram_gb: number;
    offline: boolean;
  }>;
  infrastructure: Record<string, string | boolean>;
}

export interface TrainingResponse {
  pipeline_steps: Array<{
    step: string;
    status: string;
    progress: number;
    details: string;
  }>;
  metrics: Record<string, string | number>;
}

export interface AuditResponse {
  audit_score: number;
  evidence_level?: string;
  engineering_status?: string;
  deployment_status?: string;
  offline_compliance?: Record<string, number | boolean>;
  modules: Array<{
    module: string;
    status: string;
    evidence: string;
    note: string;
  }>;
}

// Legacy axios-compatible export (for components that import { api })
import axios from 'axios';
export const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });
