'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Wifi, WifiOff, ChevronDown, ChevronUp, Zap, AlertTriangle } from 'lucide-react';

interface OllamaInfo {
  connected: boolean;
  models: string[];
  active_model: string;
  base_url: string;
  error?: string;
  provider?: string;
  capabilities?: {
    streaming: boolean;
    chat_api: boolean;
  };
}

export const OllamaStatusBanner: React.FC = () => {
  const [info, setInfo] = useState<OllamaInfo | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/v1/ollama/status');
        if (res.ok) setInfo(await res.json());
      } catch { /* network error */ }
      finally { setLoading(false); }
    };
    check();
    const interval = setInterval(check, 30_000); // re-check every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;
  if (!info) return null;

  const isOnline = info.connected;

  return (
    <div
      className={`w-full rounded-xl border text-xs transition-all duration-300 ${
        isOnline
          ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
          : 'bg-amber-950/40 border-amber-700/50 text-amber-300'
      }`}
    >
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:opacity-90"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-400" />
          )}
          <Cpu className="h-3.5 w-3.5" />
          <span className="font-semibold">
            {isOnline ? 'Ollama LLM — Connected' : 'Ollama LLM — Offline'}
          </span>
          {isOnline && (
            <span className="ml-2 flex items-center gap-1 text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
              <Zap className="h-2.5 w-2.5 text-emerald-400" />
              {info.models.length} model{info.models.length !== 1 ? 's' : ''} ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-60">{info.base_url}</span>
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-current/20 px-4 py-3 space-y-2">
          {isOnline ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {info.models.map(model => (
                  <div key={model} className="flex items-center gap-2 bg-emerald-900/30 rounded-lg px-3 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                    <span className="font-mono text-[11px] truncate">{model}</span>
                    {model === info.active_model && (
                      <span className="ml-auto text-[9px] bg-emerald-700/50 px-1.5 py-0.5 rounded text-emerald-200">active</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[10px] opacity-70">
                <span>✅ Streaming: {info.capabilities?.streaming ? 'Yes' : 'No'}</span>
                <span>✅ Chat API: {info.capabilities?.chat_api ? 'Yes' : 'No'}</span>
                <span>🔒 Cloud: None</span>
              </div>
              <p className="text-[10px] opacity-60">
                All AI features (RAG, Drafting, OCR Reasoning) are routed through your local Ollama instance.
                Zero cloud API calls.
              </p>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-200 mb-1">Ollama is not running</p>
                  <p className="opacity-70">{info.error}</p>
                </div>
              </div>
              <div className="bg-amber-950/50 rounded-lg p-3 font-mono text-[11px] border border-amber-700/30">
                <p className="text-amber-300 mb-1"># Start Ollama:</p>
                <p className="text-white">ollama serve</p>
                <p className="text-amber-300 mt-2 mb-1"># In another terminal:</p>
                <p className="text-white">cd frontend && npm run dev</p>
              </div>
              <p className="text-[10px] opacity-60">
                ⚠️ AI features are using the embedded KB engine as fallback. Start Ollama to enable full LLM capabilities.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
