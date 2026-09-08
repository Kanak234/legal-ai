'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRightLeft, CheckCircle2, Search } from 'lucide-react';
import { fetchCrossMappings } from '@/lib/api';

export const StatuteExplorer: React.FC = () => {
  const [mappings, setMappings] = useState<any[]>([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCrossMappings();
      setMappings(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = mappings.filter(
    (m) =>
      m.old_section.toLowerCase().includes(filterText.toLowerCase()) ||
      m.new_section.toLowerCase().includes(filterText.toLowerCase()) ||
      m.subject.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-amber-400" />
            <span>IPC ↔ BNS & CrPC ↔ BNSS Statute Transition Explorer</span>
          </h2>
          <p className="text-xs text-legal-300 mt-1">
            Instant cross-reference lookup table for Indian Criminal Law transition (Effective July 1, 2024).
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-legal-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter section, title, subject..."
            className="w-full bg-legal-950 border border-legal-700 text-slate-100 text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Cross Mapping Table */}
      <div className="glass-panel rounded-2xl border border-legal-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-legal-900/90 text-amber-400 font-bold uppercase tracking-wider border-b border-legal-700/60">
              <tr>
                <th className="p-4">Former Statute & Section</th>
                <th className="p-4">New Statute & Section</th>
                <th className="p-4">Offence / Subject Matter</th>
                <th className="p-4">Key Reform / Statutory Amendment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-legal-800 text-slate-200 font-medium">
              {filtered.map((m, idx) => (
                <tr key={m.id || idx} className="hover:bg-legal-800/40 transition-all">
                  <td className="p-4 text-rose-400 font-bold font-mono whitespace-nowrap">
                    {m.old_section}
                    <div className="text-[10px] text-legal-400 font-sans font-normal">{m.old_act}</div>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold font-mono whitespace-nowrap">
                    {m.new_section}
                    <div className="text-[10px] text-legal-400 font-sans font-normal">{m.new_act}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-100">{m.subject}</td>
                  <td className="p-4 text-legal-300 leading-relaxed">{m.key_change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
