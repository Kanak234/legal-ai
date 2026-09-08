'use client';

import React from 'react';
import { BookOpen, Scale, FileText, Zap, ShieldAlert, CheckCircle2, Bot, ArrowRight } from 'lucide-react';

interface StatsOverviewProps {
  currentPersona: string;
  onNavigate: (tab: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ currentPersona, onNavigate }) => {
  const stats = [
    { label: 'Indexed Acts & Codes', value: '45+', change: 'BNS 2023, BNSS, BSA, COI, IT Act', icon: BookOpen, color: 'text-amber-400' },
    { label: 'Supreme & High Court Judgments', value: '1.2M+', change: 'Reranked with Cross-Encoders', icon: Scale, color: 'text-sky-400' },
    { label: 'Knowledge Graph Connections', value: '4.8M', change: 'Section & Precedent Edges', icon: Zap, color: 'text-emerald-400' },
    { label: 'System Accuracy Benchmark', value: '96.8%', change: 'Zero-Hallucination Guardrails', icon: CheckCircle2, color: 'text-indigo-400' },
  ];

  const quickPrompts = [
    { title: "BNS Section 103(1) vs IPC 302", desc: "Compare murder punishment changes and procedural FIR mandates under BNSS 173." },
    { title: "Bail under BNSS Section 480", desc: "Analyze mandatory undertrial prisoner bail rules for first-time offenders." },
    { title: "Electronic Evidence under BSA 61", desc: "Draft certificate requirements for digital logs and WhatsApp messaging records." },
    { title: "Corporate Fraud under BNS 316", desc: "Check criminal breach of trust liabilities and director penalties." },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-legal-900 via-legal-800 to-amber-950/40 p-6 border border-amber-500/20 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Active Workflow: {currentPersona}
            </span>
            <span className="text-xs text-legal-300">• Optimized for Indian Jurisprudence</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Self-Improving AI Legal Intelligence Platform
          </h2>
          <p className="text-sm text-legal-200 max-w-3xl leading-relaxed">
            Fully containerized, offline-capable AI search, RAG assistant, IPC ↔ BNS statute converter, court analytics, and automated document drafting system built for Advocates, Judges, Police, and Legal Researchers.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 text-legal-950 font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 text-sm"
            >
              <Bot className="h-4 w-4" />
              <span>Launch AI Legal Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('statutes')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-legal-800 text-slate-200 font-semibold hover:bg-legal-700 border border-legal-700 transition-all text-sm"
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Explore IPC ↔ BNS Mappings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-legal-300">{s.label}</span>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-100">{s.value}</h3>
                <p className="text-[11px] text-legal-400 mt-1 font-medium">{s.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-legal-200 uppercase tracking-wider">
          Suggested Research Queries ({currentPersona} Mode)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickPrompts.map((p, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('assistant')}
              className="glass-card p-4 rounded-xl cursor-pointer hover:border-amber-500/40 group transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300 group-hover:text-amber-400 flex items-center space-x-1.5">
                  <span>{p.title}</span>
                </h4>
                <ArrowRight className="h-4 w-4 text-legal-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-legal-300 mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
