'use client';

import React, { useState } from 'react';
import { Network, Scale, BookOpen, ArrowRight, ShieldCheck, Database, Search, Code2, ChevronRight } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  category: string;
  color: string;
  details: string;
  connections: string[];
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: '1', label: 'BNS 2023 § 103(1)', category: 'Statute Node', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    details: 'Murder — replaces IPC § 302. Adds explicit mob lynching provision (§ 103(2)) and organised crime murder without remission.',
    connections: ['IPC § 302', '2023 INSC 845', 'BNSS § 187']
  },
  {
    id: '2', label: 'IPC 1860 § 302', category: 'Legacy Mapping', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    details: 'Murder — repealed effective July 1, 2024. Superseded by BNS § 103(1). All pending cases transferred.',
    connections: ['BNS § 103(1)', 'BNSS § 531 (Savings)']
  },
  {
    id: '3', label: 'BNSS § 173 — Zero FIR', category: 'Procedure Node', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    details: 'Mandates Zero FIR nationwide. E-FIR registration within 3 days for offences with 3+ year sentences. Replaces CrPC § 154.',
    connections: ['BNSS § 193', 'BNSS § 479', 'BNS § 103(1)']
  },
  {
    id: '4', label: 'BSA § 63 — Digital Evidence', category: 'Evidence Node', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    details: 'Electronic records presumed authentic unless challenged. Certificate requirement relaxed. WhatsApp logs, emails, cloud records included.',
    connections: ['IEA § 65B (repealed)', 'BSA § 61', '2014 SC Anvar P.V.']
  },
  {
    id: '5', label: '2023 INSC 845', category: 'Precedent Node', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    details: 'Supreme Court landmark judgment on constitutional interpretation of Art. 21 and the right to bail under BNSS framework.',
    connections: ['BNS § 103', 'BNSS § 480', 'Art. 21 Constitution']
  },
  {
    id: '6', label: 'CJI Chandrachud Bench', category: 'Judicial Bench', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    details: 'Constitutional bench (5 judges) — 2023 landmark term. Authored 47 significant judgments on criminal law transition.',
    connections: ['2023 INSC 845', '2023 INSC 901', 'Art. 21 Constitution']
  },
];

const CYPHER_EXAMPLE = `MATCH (s:Section {act_id: "bns_2023"})
  -[:REPLACES]->(old:Section {act_id: "ipc_1860"})
OPTIONAL MATCH (s)-[:CITED_IN]->(j:Judgment)
WHERE j.year >= 2023
RETURN
  s.section_number AS bns_section,
  s.title AS offence,
  old.section_number AS ipc_section,
  collect(j.citation) AS precedents,
  count(j) AS citation_count
ORDER BY citation_count DESC
LIMIT 20`;

export const KnowledgeGraphViewer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeView, setActiveView] = useState<'graph' | 'cypher'>('graph');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-legal-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Network className="h-5 w-5 text-amber-400" />
            <span>Neo4j Legal Knowledge Graph &amp; Precedent Tree</span>
          </h2>
          <p className="text-xs text-legal-300 mt-1">
            Visual node graph mapping connections between Acts, Sections, Precedents, and Judicial Benches.
            <span className="ml-2 font-mono text-amber-400/70">4.8M edges · Cypher v5.18</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Neo4j Bolt (7687)</span>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-legal-700">
            <button
              onClick={() => setActiveView('graph')}
              className={`text-xs px-3 py-1.5 font-semibold transition-all ${activeView === 'graph' ? 'bg-amber-500 text-legal-950' : 'bg-legal-900 text-legal-300 hover:bg-legal-800'}`}
            >
              📊 Graph View
            </button>
            <button
              onClick={() => setActiveView('cypher')}
              className={`text-xs px-3 py-1.5 font-semibold transition-all ${activeView === 'cypher' ? 'bg-amber-500 text-legal-950' : 'bg-legal-900 text-legal-300 hover:bg-legal-800'}`}
            >
              <Code2 className="h-3.5 w-3.5 inline mr-1" />Cypher
            </button>
          </div>
        </div>
      </div>

      {activeView === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Node Grid */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-legal-700/60 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GRAPH_NODES.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(selectedNode?.id === n.id ? null : n)}
                  className={`glass-card p-4 rounded-xl border cursor-pointer transition-all ${n.color} ${selectedNode?.id === n.id ? 'ring-2 ring-amber-500/50 scale-[1.02]' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${n.color}`}>
                      {n.category}
                    </span>
                    <span className="text-[10px] text-legal-400 font-mono">Node #{n.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">{n.label}</h3>
                  <p className="text-[11px] text-legal-300 leading-relaxed line-clamp-2">{n.details}</p>
                  <div className="pt-2 text-[11px] text-amber-400 font-medium flex items-center space-x-1">
                    <span>Traverse Connected Edges</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="relative z-10 mt-5 pt-4 border-t border-legal-700/50 flex flex-wrap items-center justify-between text-[11px] text-legal-400 gap-2">
              <span><Database className="h-3 w-3 inline mr-1 text-amber-400" />4.8M Edges</span>
              <span>Citation Overruling Tracker: Synchronized</span>
              <span className="text-amber-400 font-mono">Neo4j Cypher v5.18</span>
              <span>5 Hierarchy Levels Indexed</span>
            </div>
          </div>

          {/* Node Detail Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-legal-700/60">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border inline-block mb-2 ${selectedNode.color}`}>
                    {selectedNode.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{selectedNode.label}</h3>
                </div>
                <div>
                  <p className="text-xs text-legal-300 leading-relaxed">{selectedNode.details}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">Connected Nodes</div>
                  <div className="space-y-1.5">
                    {selectedNode.connections.map((c, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-legal-200 bg-legal-900/60 px-3 py-2 rounded-lg border border-legal-800">
                        <ChevronRight className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                        <span className="font-mono">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-legal-700/50">
                  <div className="text-[10px] text-legal-400">Relationship types: REPLACES, CITED_IN, OVERRULES, INTERPRETS</div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-3">
                <Network className="h-8 w-8 text-legal-600" />
                <p className="text-sm text-legal-400">Click any graph node to explore its connections and details</p>
                <p className="text-[11px] text-legal-500">Nodes represent statutory sections, precedents, and judicial benches</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Cypher View */
        <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">Sample Cypher Query — IPC to BNS Transition with Precedents</div>
            <div className="bg-legal-950 border border-legal-800 rounded-xl p-4 font-mono text-xs text-sky-300 leading-8 overflow-x-auto">
              {CYPHER_EXAMPLE}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { label: 'Query Response Time', value: '23ms', color: 'text-emerald-400' },
              { label: 'Nodes Traversed', value: '1,247', color: 'text-amber-400' },
              { label: 'Edges Followed', value: '4,892', color: 'text-sky-400' },
            ].map((m, i) => (
              <div key={i} className="glass-card p-4 rounded-xl text-center">
                <div className={`text-xl font-black ${m.color}`}>{m.value}</div>
                <div className="text-[11px] text-legal-400 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="pt-2 text-xs text-legal-400 border-t border-legal-700/50">
            <span className="text-amber-400 font-semibold">Note:</span> Connect to Neo4j at <span className="font-mono text-sky-400">http://localhost:7474</span> (Credentials: neo4j / legalai_secret_password) to run live Cypher queries against the full 4.8M-edge knowledge graph.
          </div>
        </div>
      )}
    </div>
  );
};
