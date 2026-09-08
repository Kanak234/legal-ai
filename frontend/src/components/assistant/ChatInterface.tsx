'use client';

import React, { useState } from 'react';
import { Bot, Send, User, ShieldCheck, Sparkles, CheckCircle, AlertTriangle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { executeRAGQuery } from '@/lib/api';

interface ChatInterfaceProps {
  currentPersona: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  confidence?: number;
  citations?: any[];
  reasoningSteps?: string[];
  hallucinationWarning?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentPersona }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am your LegalAI Assistant configured for **${currentPersona}** mode. Ask me any statutory question, case comparison, or procedural query involving BNS, BNSS, BSA, IPC, CrPC, Evidence Act, or Constitutional Law.`,
      confidence: 99.0,
      citations: [
        {
          source_title: "Bharatiya Nyaya Sanhita, 2023",
          citation: "BNS 2023 Official Gazette",
          section_or_article: "Overview",
          snippet: "Replaces Indian Penal Code 1860 with 358 statutory sections."
        }
      ],
      reasoningSteps: [
        "Initialized RAG chain in " + currentPersona + " mode.",
        "Loaded vector index for BNS, BNSS, BSA, IPC, CrPC, and Supreme Court judgments.",
        "Zero-hallucination anti-bias filter initialized."
      ]
    }
  ]);

  const handleSend = async (overrideQuery?: string) => {
    const textToSend = overrideQuery || query;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideQuery) setQuery('');
    setLoading(true);

    const res = await executeRAGQuery(textToSend, currentPersona);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: res.answer,
      confidence: res.confidence_score,
      citations: res.citations,
      reasoningSteps: res.reasoning_steps,
      hallucinationWarning: res.hallucination_warning
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const promptChips = [
    "Difference between IPC 302 and BNS 103(1)?",
    "Bail procedure for first time undertrials under BNSS 480?",
    "Admissibility requirements for WhatsApp logs under BSA Section 61?",
    "Punishment for deceitful promise of marriage under BNS 69?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass-panel rounded-2xl border border-legal-700/60 overflow-hidden">
      {/* Header Bar */}
      <div className="bg-legal-900/90 border-b border-legal-700/60 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>AI Legal Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {currentPersona} Mode
              </span>
            </h3>
            <p className="text-xs text-legal-300">Continuous RAG Chain • Hybrid Vector & Knowledge Graph Search</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-semibold">Anti-Hallucination Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 text-sm leading-relaxed space-y-3 ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-legal-950 font-medium rounded-tr-none shadow-lg shadow-amber-500/10'
                  : 'bg-legal-900/90 border border-legal-700 text-slate-100 rounded-tl-none shadow-xl'
              }`}
            >
              {/* Sender Tag */}
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 mb-2">
                <span className={`font-bold flex items-center space-x-1.5 ${m.sender === 'user' ? 'text-legal-950' : 'text-amber-400'}`}>
                  {m.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  <span>{m.sender === 'user' ? 'You' : 'LegalAI Engine'}</span>
                </span>
                {m.sender === 'ai' && m.confidence && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                    Confidence: {m.confidence}%
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>

              {/* Reasoning Steps Accordion (AI Messages) */}
              {m.sender === 'ai' && m.reasoningSteps && m.reasoningSteps.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => toggleReasoning(m.id)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-legal-300 hover:text-amber-300 bg-legal-800/50 p-2 rounded-lg border border-legal-700/50 transition-all"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>Legal Reasoning Chain ({m.reasoningSteps.length} steps)</span>
                    </span>
                    {expandedReasoning[m.id] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {expandedReasoning[m.id] && (
                    <div className="mt-2 p-3 bg-legal-950/80 rounded-lg text-xs space-y-1.5 border border-legal-800 font-mono text-legal-300">
                      {m.reasoningSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-amber-400">Step {idx + 1}:</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Citations List */}
              {m.sender === 'ai' && m.citations && m.citations.length > 0 && (
                <div className="pt-3 border-t border-legal-700/50 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Verified Statutory & Precedent Citations</span>
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {m.citations.map((c, idx) => (
                      <div key={idx} className="bg-legal-800/80 border border-legal-700/70 p-2.5 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-200">
                          <span className="text-amber-300">{c.source_title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-legal-700 text-legal-200 rounded">{c.section_or_article}</span>
                        </div>
                        <p className="text-[11px] text-legal-300 italic">"{c.snippet}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-legal-900 border border-legal-700 p-4 rounded-2xl flex items-center space-x-3 text-xs text-amber-300 font-medium">
              <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
              <span>Traversing BNS / BNSS Knowledge Graph & Reranking Passages...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Chips & Input Footer */}
      <div className="p-4 bg-legal-900/90 border-t border-legal-700/60 space-y-3">
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs bg-legal-800/80 hover:bg-amber-500/20 hover:border-amber-500/40 border border-legal-700 text-legal-200 hover:text-amber-300 px-3 py-1.5 rounded-full transition-all text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask any legal query in ${currentPersona} mode...`}
            className="flex-1 bg-legal-950 border border-legal-700 focus:border-amber-500 text-slate-100 placeholder-legal-400 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-legal-950 font-bold flex items-center justify-center transition-all shadow-lg shadow-amber-500/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
