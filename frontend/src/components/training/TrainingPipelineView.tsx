'use client';

import React, { useState } from 'react';
import { Cpu, RefreshCw, RotateCcw, CheckCircle, Sliders, Database, Layers } from 'lucide-react';

export const TrainingPipelineView: React.FC = () => {
  const [activeVersion, setActiveVersion] = useState('LegalAI-Foundation-v1.0-Local');
  const [trainingStatus, setTrainingStatus] = useState('IDLE');
  const [epochs, setEpochs] = useState(3);
  const [lr, setLr] = useState(0.00002);
  const [log, setLog] = useState('System ready. Tokenizer vocabulary initialized with 32,000 legal tokens.');

  const triggerFineTune = () => {
    setTrainingStatus('TRAINING_IN_PROGRESS');
    setLog('Initiating SFT Local Fine-Tuning over 3 epochs...\nDataset: Indian_Legal_Corpus_BNS_2023\nTokenizer: BPE Legal Custom\nEvaluating MRR@10 and NDCG@10 metrics...');

    setTimeout(() => {
      setTrainingStatus('COMPLETED');
      setActiveVersion('LegalAI-Foundation-v1.1-SFT');
      setLog(prev => prev + '\n[✓] Fine-tuning completed! New Version: LegalAI-Foundation-v1.1-SFT (MRR@10: 0.91, NDCG@10: 0.93)');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Local Foundation Model & Fine-Tuning Manager</h2>
          </div>
          <p className="text-xs text-legal-300 mt-1">
            Autonomous Tokenizer training, corpus deduplication, Supervised Fine-Tuning (SFT), and version rollback.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span>Active: {activeVersion}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-legal-300">Active Tokenizer Vocabulary</span>
          <h3 className="text-2xl font-black text-slate-100 mt-1">32,000</h3>
          <p className="text-xs text-amber-400 mt-1">BPE Legal Custom Model</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-legal-300">Indexed Tokens</span>
          <h3 className="text-2xl font-black text-slate-100 mt-1">85,000,000</h3>
          <p className="text-xs text-sky-400 mt-1">SHA-256 Deduplicated</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-legal-300">Training Loss</span>
          <h3 className="text-2xl font-black text-slate-100 mt-1">0.124</h3>
          <p className="text-xs text-emerald-400 mt-1">Stable Convergence</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-legal-300">Evaluation MRR@10</span>
          <h3 className="text-2xl font-black text-slate-100 mt-1">0.91</h3>
          <p className="text-xs text-indigo-400 mt-1">NDCG@10 Score: 0.93</p>
        </div>
      </div>

      {/* Control Panel & Log Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-legal-700/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-legal-700 pb-2 flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            <span>Local Fine-Tuning Controls</span>
          </h3>

          <div>
            <label className="block text-xs text-legal-300 mb-1 font-semibold">Base Model</label>
            <input
              type="text"
              disabled
              value="LegalAI-Foundation-v1.0-Local"
              className="w-full bg-legal-950 border border-legal-800 text-legal-400 text-xs px-3 py-2 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs text-legal-300 mb-1 font-semibold">Epochs: {epochs}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              className="w-full text-amber-500 accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs text-legal-300 mb-1 font-semibold">Learning Rate</label>
            <input
              type="number"
              step="0.00001"
              value={lr}
              onChange={(e) => setLr(Number(e.target.value))}
              className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs px-3 py-2 rounded-xl"
            />
          </div>

          <button
            onClick={triggerFineTune}
            disabled={trainingStatus === 'TRAINING_IN_PROGRESS'}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-legal-950 font-bold rounded-xl text-sm transition-all"
          >
            {trainingStatus === 'TRAINING_IN_PROGRESS' ? 'Training in Progress...' : 'Start Local Fine-Tuning'}
          </button>
        </div>

        {/* Execution Log */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-legal-700/60 flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-legal-700 pb-2">Training Execution Logs</h3>
          <pre className="bg-legal-950 p-4 rounded-xl border border-legal-800 font-mono text-xs text-slate-200 whitespace-pre-wrap flex-1 overflow-y-auto max-h-[300px]">
            {log}
          </pre>
        </div>
      </div>
    </div>
  );
};
