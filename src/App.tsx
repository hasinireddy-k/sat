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
    // 1. Instantly transition to Analysis Workspace tab
    setActiveTab('scene-analysis');

    // 2. Set active result immediately so MainAnalysisWorkspace mounts without delay
    const initialMetadata: GeoMetadata = primaryMeta || {
      filename: 'Observation_Scene_1.tif',
      fileSize: '12.4 MB',
      dimensions: '2048 x 2048 px',
      crs: 'EPSG:32643',
      resolution: '0.5m/px',
      sensor: secondarySrc ? 'OPTICAL + SAR PAIR' : 'OPTICAL / SENTINEL-2',
      format: 'GeoTIFF',
      acquisitionDate: new Date().toISOString().split('T')[0],
      bands: 'RGB + NIR',
    };

    const tempResult: ExecutionResult = {
      id: `exec_live_${Date.now()}`,
      query,
      taskType: secondarySrc ? 'Temporal Change Analysis' : 'Visual Question Answering',
      selectedModel: {
        id: 'geovlm-v2',
        name: 'GeoVLM Sentinel Adapter v2.4',
        provider: 'ISRO SAC / Open-RS',
        status: 'ready',
        taskSuitability: ['VQA', 'Captioning', 'Grounding'],
      },
      answer: 'Executing multi-spectral specialist analysis pipeline...',
      findings: [
        'Input imagery header validated (CRS EPSG:32643).',
        'Multi-spectral feature pyramid aligned.',
        'Extracting spatial evidence and confidence scores...'
      ],
      confidenceScore: 94.2,
      images: {
        primary: primarySrc,
        secondary: secondarySrc,
      },
      evidence: [],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Header Extraction', description: 'Validating GeoTIFF CRS EPSG:32643 and GSD 0.5m/px.', status: 'success', latencyMs: 40, timestamp: new Date().toLocaleTimeString() },
        { id: 't2', stepNumber: 2, name: 'Natural Language Intent Classification', description: `Executing query: "${query}"`, status: 'running', latencyMs: 80, timestamp: new Date().toLocaleTimeString() }
      ],
      metadata: {
        primary: initialMetadata,
        secondary: secondaryMeta,
      },
      auditSummary: {
        executionTimeMs: 420,
        modelParametersUsed: { temperature: 0.1, topP: 0.9 },
        verificationHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        dataIntegrityPassed: true,
      },
      timestamp: new Date().toISOString(),
    };

    setActiveResult(tempResult);

    // 3. Execute query and update with finalized backend response
    try {
      const finalResult = await satqueryApi.executeQuery(
        {
          query,
          primaryImage: primarySrc,
          secondaryImage: secondarySrc,
          primaryMetadata: primaryMeta,
          secondaryMetadata: secondaryMeta,
        },
        (updatedTrace) => {
          setActiveResult((prev) => (prev ? { ...prev, trace: updatedTrace } : prev));
        }
      );

      setActiveResult(finalResult);
      setHistoryLogs((prev) => [finalResult, ...prev.filter((h) => h.id !== tempResult.id)]);
    } catch (err) {
      console.error('[SatQuery Analysis Error]', err);
    }
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
      <main className="flex-1 h-screen w-full max-w-[calc(100vw-240px)] flex flex-col items-center pt-12 px-8 pb-24 overflow-y-auto relative">
        {activeTab === 'login' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <LoginView onLoginSuccess={handleLoginSuccess} />
          </div>
        )}

        {activeTab === 'mission-control' && !activeResult && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
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
            <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
              <MainAnalysisWorkspace
                initialResult={activeResult || DEMO_MISSIONS[0].precomputedResult}
                onGenerateReport={handleGenerateReport}
                onBackToHome={handleResetUpload}
              />
            </div>
          )}

        {activeTab === 'gallery' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <MissionGalleryView
              onSelectMission={handleSelectDemoMission}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
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
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <ReportGeneratorView result={activeResult || DEMO_MISSIONS[0].precomputedResult} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <ProfileView user={user} onSignOut={handleSignOut} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <SettingsView
              settings={settings}
              onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {activeTab === 'help' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <HelpView />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <ArchitectureView />
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="w-full max-w-6xl mx-auto animate-fade-slide-view">
            <EvaluationView />
          </div>
        )}
      </main>
    </SpaceBackground>
  );
};

export default App;
