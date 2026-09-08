/**
 * RAG Context Builder — shared utility
 * Retrieves relevant sections + judgments from embedded KB for a given query.
 */
import { SECTIONS, JUDGMENTS } from './legalData';

export function buildContext(query: string): string {
  const q = query.toLowerCase();

  const relevantSections = SECTIONS.filter(s =>
    s.title?.toLowerCase().includes(q) ||
    s.content?.toLowerCase().includes(q) ||
    s.section_number?.toLowerCase().includes(q) ||
    s.explanation?.toLowerCase().includes(q) ||
    // Also match keywords
    q.split(' ').some(word => word.length > 3 && (
      s.title?.toLowerCase().includes(word) ||
      s.content?.toLowerCase().includes(word)
    ))
  ).slice(0, 6);

  const relevantJudgments = JUDGMENTS.filter(j =>
    j.summary?.toLowerCase().includes(q) ||
    j.case_title?.toLowerCase().includes(q) ||
    j.ratio_decidendi?.toLowerCase().includes(q) ||
    q.split(' ').some(word => word.length > 3 && (
      j.summary?.toLowerCase().includes(word) ||
      j.ratio_decidendi?.toLowerCase().includes(word)
    ))
  ).slice(0, 3);

  let ctx = '';

  if (relevantSections.length) {
    ctx += 'RELEVANT STATUTORY PROVISIONS:\n';
    for (const s of relevantSections) {
      ctx += `• ${s.act_id.toUpperCase()} § ${s.section_number} — ${s.title}\n`;
      ctx += `  Text: ${s.content.slice(0, 200)}\n`;
      if (s.explanation) ctx += `  Explanation: ${s.explanation.slice(0, 150)}\n`;
      if (s.ipc_corresponding) ctx += `  (Replaces: ${s.ipc_corresponding})\n`;
      ctx += '\n';
    }
  }

  if (relevantJudgments.length) {
    ctx += 'RELEVANT PRECEDENTS:\n';
    for (const j of relevantJudgments) {
      ctx += `• ${j.case_title} [${j.citation}]\n`;
      ctx += `  Ratio: ${j.ratio_decidendi.slice(0, 200)}\n\n`;
    }
  }

  return ctx.trim() || 'No specific statutory context. Apply general Indian criminal/civil law principles per BNS/BNSS/BSA 2023.';
}
