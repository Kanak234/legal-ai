'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Scale, PieChart, TrendingUp, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { fetchAnalytics } from '@/lib/api';

const COLORS = ['#f59e0b', '#38bdf8', '#34d399', '#a78bfa', '#f43f5e'];

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetchAnalytics();
      setData(res);
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-legal-700/60 text-center text-amber-400 font-semibold">
        Loading Court Analytics & Citation Graphs...
      </div>
    );
  }

  const { metrics, charts } = data;

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-legal-300">Indexed Statutes</span>
          <h3 className="text-xl font-bold text-slate-100 mt-1">{metrics.total_statutes}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-legal-300">Sections</span>
          <h3 className="text-xl font-bold text-amber-400 mt-1">{metrics.total_sections_indexed}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-legal-300">Judgments</span>
          <h3 className="text-xl font-bold text-sky-400 mt-1">{metrics.total_judgments_analyzed}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-legal-300">Graph Edges</span>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">{metrics.total_knowledge_graph_edges}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-legal-300">RAG Accuracy</span>
          <h3 className="text-xl font-bold text-indigo-400 mt-1">{metrics.system_accuracy_score}</h3>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-legal-300">Hallucination</span>
          <h3 className="text-xl font-bold text-emerald-400 mt-1">{metrics.hallucination_rate}</h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Adoption Trend */}
        <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 space-y-4">
          <div className="flex items-center space-x-2 text-slate-100">
            <TrendingUp className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold">2026 Transition Trend: IPC 1860 vs BNS 2023 Citations</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthly_case_trends}>
                <XAxis dataKey="month" stroke="#829ab1" fontSize={11} />
                <YAxis stroke="#829ab1" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', color: '#fff' }} />
                <Line type="monotone" dataKey="ipc_cases" stroke="#f43f5e" name="IPC Citations" strokeWidth={2} />
                <Line type="monotone" dataKey="bns_cases" stroke="#34d399" name="BNS Citations" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Judges Citation Impact */}
        <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 space-y-4">
          <div className="flex items-center space-x-2 text-slate-100">
            <Award className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold">Top Judges Citation Impact Score</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.top_judges_precedents} layout="vertical">
                <XAxis type="number" stroke="#829ab1" fontSize={11} />
                <YAxis dataKey="judge" type="category" stroke="#829ab1" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', color: '#fff' }} />
                <Bar dataKey="citation_impact" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Impact Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
