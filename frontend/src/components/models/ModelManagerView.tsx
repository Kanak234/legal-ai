'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchModelStatus } from '@/lib/api';

export const ModelManagerView: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchModelStatus();
      setStatusData(data);
    }
    load();
  }, []);

  if (!statusData) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-legal-700/60 text-center text-amber-400 font-semibold">
        Fetching System Resource & AI Model Telemetry...
      </div>
    );
  }

  const { system_hardware, loaded_models, eval_metrics } = statusData;

  return (
    <div className="space-y-6">
      {/* System Hardware Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-legal-300">
            <span>CPU Usage</span>
            <Cpu className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-100">{system_hardware.cpu_usage_percent}%</h3>
          <p className="text-[11px] text-legal-400">{system_hardware.cpu_architecture} ({system_hardware.os})</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-legal-300">
            <span>RAM Allocation</span>
            <HardDrive className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-100">{system_hardware.used_ram_gb} GB</h3>
          <p className="text-[11px] text-legal-400">Total System: {system_hardware.total_ram_gb} GB</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-legal-300">
            <span>GPU Acceleration</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-emerald-400 truncate">{system_hardware.gpu_detected}</h3>
          <p className="text-[11px] text-legal-400">{system_hardware.active_mode}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-legal-300">
            <span>NDCG@10 Score</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black text-slate-100">{eval_metrics.ndcg_at_10}</h3>
          <p className="text-[11px] text-legal-400">MRR@10: {eval_metrics.mrr_at_10}</p>
        </div>
      </div>

      {/* Loaded Models Table */}
      <div className="glass-panel rounded-2xl border border-legal-700/60 overflow-hidden">
        <div className="p-4 bg-legal-900/90 border-b border-legal-700 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-amber-400" />
            <span>Active Containerized AI Models & Quantized Engines</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono">Continuous Self-Evaluation Active</span>
        </div>

        <div className="divide-y divide-legal-800">
          {loaded_models.map((m: any, idx: number) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-legal-800/30 transition-all text-xs">
              <div>
                <h4 className="font-bold text-amber-300 text-sm">{m.model_name}</h4>
                <p className="text-legal-300 text-[11px]">{m.type} • {m.parameters} parameters</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-legal-300">RAM: <strong className="text-slate-100">{m.memory_used_mb} MB</strong></span>
                <span className="text-legal-300">Latency: <strong className="text-slate-100">{m.latency_ms} ms</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono border border-emerald-500/30">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
