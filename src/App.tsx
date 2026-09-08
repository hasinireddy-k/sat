import React, { useState } from 'react';
import { ViewTab, ExecutionResult, DemoMission, GeoMetadata, UserProfile, AppSettings } from './types/satquery';
import { DEMO_MISSIONS } from './data/demoMissions';
import { Header } from './components/common/Header';
import { SpaceBackground } from './components/common/SpaceBackground';
import { agentController } from './services/agentController';
import { satqueryApi } from './services/satqueryApi';

import { LoginView } from './components/views/LoginView';
import { HomeUploadView } from './components/views/HomeUploadView';
import { MainAnalysisWorkspace } from './components/views/MainAnalysisWorkspace';
import { MissionGalleryView } from './components/views/MissionGalleryView';
import { AnalysisHistoryView } from './components/views/AnalysisHistoryView';
import { ReportGeneratorView } from './components/views/ReportGeneratorView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { HelpView } from './components/views/HelpView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { EvaluationView } from './components/views/EvaluationView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('mission-control');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [activeResult, setActiveResult] = useState<ExecutionResult | null>(null);

  const [user, setUser] = useState<UserProfile>({
    name: 'Research User',
    email: 'analyst@satquery.isro.gov.in',
    organization: 'SatQuery Research Workspace',
    role: 'Earth Observation Analyst',
    joinedDate: 'September 2025',
    isAuthenticated: true,
  });

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    language: 'English',
    responseDetail: 'Balanced',
    showVisualEvidence: true,
    showConfidence: true,
    autoDetectModality: true,
    notificationsEnabled: true,
  });

  const [historyLogs, setHistoryLogs] = useState<ExecutionResult[]>(
    DEMO_MISSIONS.map((m) => m.precomputedResult)
  );

  const handleStartAnalysis = async (
    primarySrc: string,
    query: string,
    secondarySrc?: string,
    primaryMeta?: GeoMetadata,
    secondaryMeta?: GeoMetadata
  ) => {
    const result = await satqueryApi.executeQuery({
      query,
      primaryImage: primarySrc,
      secondaryImage: secondarySrc,
      primaryMetadata: primaryMeta,
      secondaryMetadata: secondaryMeta,
    });

    setActiveResult(result);
    setHistoryLogs((prev) => [result, ...prev]);
    setActiveTab('scene-analysis');
  };

  const handleSelectDemoMission = (mission: DemoMission) => {
    setActiveResult(mission.precomputedResult);
    if (!historyLogs.some((h) => h.id === mission.precomputedResult.id)) {
      setHistoryLogs((prev) => [mission.precomputedResult, ...prev]);
    }
    setActiveTab('scene-analysis');
  };

  const handleGenerateReport = (res: ExecutionResult) => {
    setActiveResult(res);
    setActiveTab('reports');
  };

  const handleResetUpload = () => {
    setActiveResult(null);
    setActiveTab('mission-control');
  };

  const handleLoginSuccess = (email: string, isDemo = false) => {
    setUser({
      name: isDemo ? 'Demo Analyst' : 'Research Analyst',
      email,
      organization: isDemo ? 'ISRO SIH Demo Environment' : 'ISRO Earth Observation Division',
      role: 'Earth Observation Specialist',
      joinedDate: 'September 2025',
      isAuthenticated: true,
    });
    setActiveTab('mission-control');
  };

  const handleSignOut = () => {
    setUser((prev) => ({ ...prev, isAuthenticated: false }));
    setActiveTab('login');
  };

  const handleClearHistory = () => {
    setHistoryLogs([]);
  };

  return (
    <SpaceBackground>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        hasLoadedImages={!!activeResult}
        onResetUpload={handleResetUpload}
        user={user}
      />

      {/* Stage */}
      <main className="flex-1 max-w-[calc(100vw-240px)] flex flex-col items-center pt-24 px-12 pb-12 overflow-y-auto relative">
        {activeTab === 'login' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <LoginView onLoginSuccess={handleLoginSuccess} />
          </div>
        )}

        {activeTab === 'mission-control' && !activeResult && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <HomeUploadView
              onStartAnalysis={handleStartAnalysis}
              onSelectDemoMission={handleSelectDemoMission}
            />
          </div>
        )}

        {(activeTab === 'scene-analysis' || activeResult) &&
          activeTab !== 'login' &&
          activeTab !== 'gallery' &&
          activeTab !== 'history' &&
          activeTab !== 'reports' &&
          activeTab !== 'profile' &&
          activeTab !== 'settings' &&
          activeTab !== 'help' &&
          activeTab !== 'architecture' &&
          activeTab !== 'evaluation' && (
            <div className="w-full max-w-5xl animate-fade-slide-view">
              <MainAnalysisWorkspace
                initialResult={activeResult || DEMO_MISSIONS[0].precomputedResult}
                onGenerateReport={handleGenerateReport}
                onBackToHome={handleResetUpload}
              />
            </div>
          )}

        {activeTab === 'gallery' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <MissionGalleryView
              onSelectMission={handleSelectDemoMission}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <AnalysisHistoryView
              historyLogs={historyLogs}
              onSelectResult={(res) => {
                setActiveResult(res);
                setActiveTab('scene-analysis');
              }}
              onGenerateReport={handleGenerateReport}
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <ReportGeneratorView result={activeResult || DEMO_MISSIONS[0].precomputedResult} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <ProfileView user={user} onSignOut={handleSignOut} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <SettingsView
              settings={settings}
              onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {activeTab === 'help' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <HelpView />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <ArchitectureView />
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="w-full max-w-5xl animate-fade-slide-view">
            <EvaluationView />
          </div>
        )}
      </main>

      {/* Restrained Space Footer */}
      <footer className="bg-[#060810] border-t border-slate-900 py-3 px-4 text-xs font-mono text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>SatQuery AI — Turn satellite imagery into answers.</div>
          <div>ISRO SIH 2026 Problem Statement 26167</div>
        </div>
      </footer>
    </SpaceBackground>
  );
};

export default App;
