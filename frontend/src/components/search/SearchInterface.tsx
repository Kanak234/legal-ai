'use client';

import React, { useState } from 'react';
import { Search, Filter, BookOpen, Scale, ArrowRightLeft, Sparkles } from 'lucide-react';
import { executeSearch } from '@/lib/api';

export const SearchInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('murder');
  const [actFilter, setActFilter] = useState('');
  const [courtFilter, setCourtFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({ statutes: [], judgments: [], mappings: [], total: 0 });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    const data = await executeSearch(searchTerm, actFilter, courtFilter);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100">
          <Search className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-bold">Hybrid Legal Search Engine (Dense Vector + BM25)</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by keywords, section number (e.g. BNS 103), case title, or legal issue..."
            className="flex-1 bg-legal-950 border border-legal-700 focus:border-amber-500 text-slate-100 placeholder-legal-400 px-4 py-3 rounded-xl text-sm focus:outline-none"
          />

          <div className="flex items-center space-x-2">
            <select
              value={actFilter}
              onChange={(e) => setActFilter(e.target.value)}
              className="bg-legal-950 border border-legal-700 text-slate-200 text-xs px-3 py-3 rounded-xl focus:outline-none"
            >
              <option value="">All Acts</option>
              <option value="bns_2023">BNS 2023</option>
              <option value="bnss_2023">BNSS 2023</option>
              <option value="bsa_2023">BSA 2023</option>
              <option value="constitution_india">Constitution of India</option>
              <option value="it_act_2000">IT Act 2000</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-legal-950 font-bold text-sm flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
            >
              {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      {results.total > 0 && (
        <div className="flex items-center justify-between text-xs text-legal-300 font-semibold px-2">
          <span>Found {results.total} relevant legal records</span>
          <span>Filtered by BM25 + Reciprocal Rank Fusion</span>
        </div>
      )}

      {/* Results Columns */}
      <div className="space-y-6">
        {/* Section Matches */}
        {results.statutes && results.statutes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Statutory Sections ({results.statutes.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.statutes.map((s: any) => (
                <div key={s.id} className="glass-card p-4 rounded-xl space-y-2 border border-legal-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-300">Section {s.section_number}: {s.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-legal-800 text-legal-300">
                      {s.act_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{s.content}</p>
                  {s.explanation && (
                    <p className="text-xs text-legal-300 italic bg-legal-900/60 p-2 rounded-lg border border-legal-800">
                      {s.explanation}
                    </p>
                  )}
                  {s.ipc_corresponding && (
                    <div className="text-[11px] text-amber-400 font-semibold pt-1">
                      IPC Equivalent: {s.ipc_corresponding}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross Mappings */}
        {results.mappings && results.mappings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <ArrowRightLeft className="h-4 w-4" />
              <span>IPC ↔ BNS Cross Mappings ({results.mappings.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.mappings.map((m: any) => (
                <div key={m.id} className="glass-card p-4 rounded-xl space-y-2 border border-legal-700">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="text-rose-400">{m.old_section}</span>
                    <span className="text-legal-400">➔</span>
                    <span className="text-emerald-400">{m.new_section}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100">{m.subject}</p>
                  <p className="text-xs text-legal-300">{m.key_change}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Judgments */}
        {results.judgments && results.judgments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <Scale className="h-4 w-4" />
              <span>Precedent Judgments ({results.judgments.length})</span>
            </h3>
            <div className="space-y-3">
              {results.judgments.map((j: any) => (
                <div key={j.id} className="glass-card p-4 rounded-xl space-y-2 border border-legal-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-100">{j.case_title}</h4>
                    <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {j.citation}
                    </span>
                  </div>
                  <div className="text-xs text-legal-300 flex items-center space-x-3">
                    <span>{j.court} ({j.year})</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{j.outcome}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{j.summary}</p>
                  {j.ratio_decidendi && (
                    <div className="text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      <span className="font-bold text-amber-400">Ratio Decidendi: </span>
                      <span>{j.ratio_decidendi}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
