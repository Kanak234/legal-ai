'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ChatInterface } from '@/components/assistant/ChatInterface';
import { SearchInterface } from '@/components/search/SearchInterface';
import { StatuteExplorer } from '@/components/statutes/StatuteExplorer';
import { DraftStudio } from '@/components/drafting/DraftStudio';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { OCRAnalyzer } from '@/components/ocr/OCRAnalyzer';
import { KnowledgeGraphViewer } from '@/components/graph/KnowledgeGraphViewer';
import { ModelManagerView } from '@/components/models/ModelManagerView';
import { GraphQLExplorer } from '@/components/graphql/GraphQLExplorer';
import { TrainingPipelineView } from '@/components/training/TrainingPipelineView';
import { AuditDashboard } from '@/components/audit/AuditDashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPersona, setCurrentPersona] = useState('Advocate');

  return (
    <div className="min-h-screen flex flex-col bg-legal-950">
      <Navbar
        currentPersona={currentPersona}
        onPersonaChange={setCurrentPersona}
      />

      <div className="flex-1 flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <StatsOverview
              currentPersona={currentPersona}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'assistant' && (
            <ChatInterface currentPersona={currentPersona} />
          )}

          {activeTab === 'search' && <SearchInterface />}

          {activeTab === 'statutes' && <StatuteExplorer />}

          {activeTab === 'drafting' && <DraftStudio />}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'ocr' && <OCRAnalyzer />}

          {activeTab === 'graph' && <KnowledgeGraphViewer />}

          {activeTab === 'models' && <ModelManagerView />}

          {activeTab === 'graphql' && <GraphQLExplorer />}

          {activeTab === 'training' && <TrainingPipelineView />}

          {activeTab === 'audit' && <AuditDashboard />}
        </main>
      </div>
    </div>
  );
}
