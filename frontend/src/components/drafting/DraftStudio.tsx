'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Download, Check, AlertCircle } from 'lucide-react';
import { generateDraft, type DraftRequest } from '@/lib/api';

export const DraftStudio: React.FC = () => {
  const [draftType, setDraftType] = useState('Bail Application (BNSS Sec 480)');
  const [petitioner, setPetitioner] = useState('Rajesh Kumar');
  const [respondent, setRespondent] = useState('State of NCT of Delhi');
  const [facts, setFacts] = useState('The applicant was arrested on 01-08-2026 under alleged suspicion under BNS Section 103(1). No recovery was made from the applicant.');
  const [sections, setSections] = useState('BNS 103(1), BNSS 173, BNSS 480');
  const [loading, setLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!petitioner.trim() || !facts.trim()) return;
    setLoading(true);
    const secList = sections.split(',').map((s) => s.trim());
    const req: DraftRequest = {
      draft_type: draftType,
      petitioner_name: petitioner,
      respondent_name: respondent,
      facts,
      sections_invoked: secList,
    };
    const res = await generateDraft(req);
    setDraftResult(res);
    setLoading(false);
  };

  const handleCopy = () => {
    if (draftResult?.generated_content) {
      navigator.clipboard.writeText(draftResult.generated_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-legal-700/60 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 border-b border-legal-700 pb-3">
          <FileText className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-bold">Automated Legal Draft Generator</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-legal-300 mb-1">Select Document Type</label>
            <select
              value={draftType}
              onChange={(e) => setDraftType(e.target.value)}
              className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="Bail Application (BNSS Sec 480)">Bail Application (BNSS Sec 480)</option>
              <option value="Legal Notice (Demand / Default)">Legal Notice (Demand / Default)</option>
              <option value="RTI Application">RTI Application (Sec 6(1))</option>
              <option value="Anticipatory Bail Application">Anticipatory Bail Application (BNSS § 482)</option>
              <option value="Writ Petition (Article 226)">Writ Petition (High Court — Art. 226)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-legal-300 mb-1">Petitioner / Notice Issuer Name</label>
            <input
              type="text"
              value={petitioner}
              onChange={(e) => setPetitioner(e.target.value)}
              className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-legal-300 mb-1">Respondent / Opposite Party</label>
            <input
              type="text"
              value={respondent}
              onChange={(e) => setRespondent(e.target.value)}
              className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-legal-300 mb-1">Statutory Sections Invoked</label>
            <input
              type="text"
              value={sections}
              onChange={(e) => setSections(e.target.value)}
              placeholder="Comma separated sections..."
              className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-legal-300 mb-1">Key Statement of Facts</label>
            <textarea
              rows={4}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs p-3 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-legal-950 font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
          >
            {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            <span>Generate Professional Draft</span>
          </button>
        </div>
      </div>

      {/* Draft Preview Column */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-legal-700/60 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between border-b border-legal-700 pb-3">
          <h3 className="text-sm font-bold text-slate-100">Live Draft Document Canvas</h3>
          {draftResult && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs bg-legal-800 hover:bg-legal-700 text-slate-200 px-3 py-1.5 rounded-lg border border-legal-700"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 bg-legal-950 p-6 rounded-xl border border-legal-800 overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
          {draftResult ? (
            draftResult.generated_content
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-legal-400 space-y-2 text-center p-8">
              <FileText className="h-10 w-10 text-legal-600" />
              <p className="font-sans text-sm">Fill in the details on the left and click "Generate Professional Draft".</p>
            </div>
          )}
        </div>

        {draftResult && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center space-x-2 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{draftResult.disclaimer}</span>
          </div>
        )}
      </div>
    </div>
  );
};
