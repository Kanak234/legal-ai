'use client';

import React, { useState } from 'react';
import { Terminal, Play, Database, CheckCircle, Code } from 'lucide-react';

export const GraphQLExplorer: React.FC = () => {
  const [query, setQuery] = useState(`query GetIndianStatutes {
  acts {
    actId
    actName
    shortName
    enactmentYear
  }
}`);

  const [response, setResponse] = useState<string>(`{
  "data": {
    "acts": [
      {
        "actId": "bns_2023",
        "actName": "Bharatiya Nyaya Sanhita, 2023",
        "shortName": "BNS",
        "enactmentYear": 2023
      },
      {
        "actId": "bnss_2023",
        "actName": "Bharatiya Nagarik Suraksha Sanhita, 2023",
        "shortName": "BNSS",
        "enactmentYear": 2023
      }
    ]
  }
}`);
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/graphql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(JSON.stringify({ error: "Failed to connect to GraphQL endpoint", details: String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-legal-700/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">GraphQL Explorer Console</h2>
          </div>
          <p className="text-xs text-legal-300 mt-1">
            Query Statutes, Sections, Judgments, and Knowledge Graph Node Relationships via GraphQL endpoint.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-legal-900 border border-legal-700 px-3 py-1.5 rounded-lg text-xs font-mono text-amber-300">
          <span>POST /api/v1/graphql/query</span>
        </div>
      </div>

      {/* Editor & Response Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-legal-700/60 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-legal-700 pb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
              <Code className="h-4 w-4 text-amber-400" />
              <span>GraphQL Query Editor</span>
            </span>
            <button
              onClick={executeQuery}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-legal-950 font-bold text-xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{loading ? 'Executing...' : 'Run Query'}</span>
            </button>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={14}
            className="w-full bg-legal-950 p-4 rounded-xl border border-legal-800 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        {/* Response Canvas */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-legal-700/60 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-legal-700 pb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>JSON Response</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              HTTP 200 OK
            </span>
          </div>
          <pre className="w-full bg-legal-950 p-4 rounded-xl border border-legal-800 font-mono text-xs text-emerald-300 overflow-y-auto max-h-[350px]">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
};
