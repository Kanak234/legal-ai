'use client';

import React from 'react';
import { Scale, ShieldCheck, Cpu, UserCheck } from 'lucide-react';
import { PERSONAS } from '@/lib/utils';

interface NavbarProps {
  currentPersona: string;
  onPersonaChange: (persona: string) => void;
  systemStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onPersonaChange,
  systemStatus = 'ONLINE'
}) => {
  return (
    <header className="h-16 border-b border-legal-700/60 glass-panel sticky top-0 z-50 flex items-center justify-between px-6">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Scale className="h-6 w-6 text-legal-950 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-100">LegalAI</h1>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Enterprise v1.0
            </span>
          </div>
          <p className="text-xs text-legal-300">Indian Legal Intelligence & Analytics Platform</p>
        </div>
      </div>

      {/* Persona Selector & System Status */}
      <div className="flex items-center space-x-4">
        {/* Persona Dropdown */}
        <div className="flex items-center space-x-2 bg-legal-800/80 border border-legal-700 px-3 py-1.5 rounded-lg">
          <UserCheck className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-medium text-legal-300">Persona:</span>
          <select
            value={currentPersona}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
          >
            {PERSONAS.map((p) => (
              <option key={p} value={p} className="bg-legal-900 text-slate-200">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* System Health Badge */}
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{systemStatus}</span>
        </div>

        {/* Security Badge */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs text-legal-300 bg-legal-800/40 px-2.5 py-1.5 rounded-lg border border-legal-700/50">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Docker Air-Gapped</span>
        </div>
      </div>
    </header>
  );
};
