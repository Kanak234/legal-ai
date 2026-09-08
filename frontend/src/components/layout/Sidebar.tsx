'use client';

import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Search,
  BookOpen,
  FileText,
  BarChart3,
  FileSearch,
  Network,
  Cpu,
  Terminal,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Legal Assistant', icon: Bot, highlight: true },
    { id: 'search', label: 'Case & Statute Search', icon: Search },
    { id: 'statutes', label: 'IPC ↔ BNS Explorer', icon: BookOpen },
    { id: 'drafting', label: 'Legal Draft Studio', icon: FileText },
    { id: 'analytics', label: 'Court Analytics', icon: BarChart3 },
    { id: 'ocr', label: 'OCR Evidence Analyzer', icon: FileSearch },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'models', label: 'AI Model Manager', icon: Cpu },
    { id: 'graphql', label: 'GraphQL Explorer', icon: Terminal },
    { id: 'training', label: 'Training & Tokenizer', icon: Sliders },
    { id: 'audit', label: 'Audit & Compliance', icon: ShieldCheck }
  ];

  return (
    <aside className="w-64 border-r border-legal-700/60 glass-panel flex flex-col justify-between p-4 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-legal-400 uppercase tracking-wider px-3 mb-2">
          Navigation Portals
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-legal-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-legal-300 hover:text-slate-100 hover:bg-legal-800/60'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-legal-950' : 'text-legal-400'}`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="bg-legal-900/80 border border-legal-800 rounded-xl p-3 text-xs text-legal-300 space-y-1 mt-4">
        <div className="flex items-center justify-between font-semibold text-slate-200">
          <span>Target System</span>
          <span className="text-amber-400 font-mono">BNS / BNSS / BSA</span>
        </div>
        <p className="text-[11px] text-legal-400">
          Pre-indexed with IPC 1860, CrPC 1973 & Evidence Act cross-mappings.
        </p>
      </div>
    </aside>
  );
};
