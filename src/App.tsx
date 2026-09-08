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
    // 1. Instantly transition to Analysis Workspace tab & clear stale active result
    setActiveResult(null);
    setActiveTab('scene-analysis');

    // 2. Set initial metadata state for workspace view
    const initialMetadata: GeoMetadata = primaryMeta || {
      filename: 'Uploaded_Scene.tif',
      fileSize: 'Not available',
      dimensions: '1024 × 1024 px',
      crs: 'CRS: Not available',
      resolution: 'Not available',
      sensor: secondarySrc ? 'OPTICAL + SAR PAIR' : 'Multispectral GeoTIFF Sensor',
      format: 'GeoTIFF',
      acquisitionDate: new Date().toISOString().split('T')[0],
      bands: ['Red', 'Green', 'Blue', 'NIR'],
      bounds: undefined,
    };

    const tempResult: ExecutionResult = {
      id: `exec_live_${Date.now()}`,
      query,
      mode: secondarySrc ? 'change' : 'single',
      detectedTask: secondarySrc ? 'Temporal Change Analysis' : 'Visual Question Answering',
      selectedModel: {
        id: 'geovlm-v2',
        name: 'GeoVLM PyTorch Specialist Engine',
        provider: 'SatQuery Remote Sensing AI',
        version: 'v2.6',
        status: 'online',
        taskSuitability: ['Visual Question Answering'],
        accuracy: 'Evaluated per raster',
        latencyAvg: '180ms',
        supportedInputTypes: ['GeoTIFF', 'PNG', 'JPEG'],
        maxResolution: 'Native GSD',
      },
      configuredParameters: { temperature: 0.1, topP: 0.9 },
      validationResult: {
        valid: true,
        format: initialMetadata.format || 'GeoTIFF',
        crsFound: initialMetadata.crs !== 'CRS: Not available',
        dimensions: initialMetadata.dimensions || '1024 × 1024 px',
        notes: `Validated ${initialMetadata.format || 'GeoTIFF'} header and spatial resolution.`,
      },
      textAnswer: 'Executing PyTorch multi-spectral specialist analysis pipeline...',
      keyFindings: [
        `Input imagery header validated (${initialMetadata.crs}).`,
        'Raster preview and feature pyramid aligned.',
        'Extracting spatial evidence and contours...'
      ],
      confidence: null,
      confidenceLevel: 'High',
      spatialInterpretation: 'Initial feature pyramid alignment in progress.',
      groundingBoxes: [],
      changeAreas: [],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Header Extraction', description: `Inspecting ${initialMetadata.filename}. ${initialMetadata.crs}.`, status: 'success', latencyMs: 35, timestamp: new Date().toLocaleTimeString() },
        { id: 't2', stepNumber: 2, name: 'Query Intent Classification', description: `Executing query: "${query}"`, status: 'running', latencyMs: 45, timestamp: new Date().toLocaleTimeString() }
      ],
      geoMetadata: initialMetadata,
      geoMetadataSecondary: secondaryMeta,
      timestamp: new Date().toISOString(),
      executionTimeTotalMs: 325,
      images: {
        primary: primarySrc,
        secondary: secondarySrc,
      },
    };

    setActiveResult(tempResult);

    // 3. Execute query and update with finalized backend response
    try {
      const fileId = primaryMeta?.fileId;
      const finalResult = await satqueryApi.executeQuery(
        {
          query,
          primaryImage: primarySrc,
          secondaryImage: secondarySrc,
          primaryMetadata: primaryMeta,
          secondaryMetadata: secondaryMeta,
          fileId
        } as any,
        (updatedTrace) => {
          setActiveResult((prev) => (prev ? { ...prev, trace: updatedTrace } : prev));
        }
      );

      setActiveResult(finalResult);

      // 4. Save to history
      setHistoryLogs((prev) => [finalResult, ...prev]);
    } catch (error) {
      console.error('[SatQuery App] Execution failed:', error);
    }
  };

  const handleSelectDemoMission = (mission: DemoMission) => {
    setActiveResult(mission.precomputedResult);
    setActiveTab('scene-analysis');
  };

  const handleSelectHistoryItem = (result: ExecutionResult) => {
    setActiveResult(result);
    setActiveTab('scene-analysis');
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden">
      <SpaceBackground />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
      />

      <main className="relative pt-16 min-h-[calc(100vh-4rem)]">
        {activeTab === 'mission-control' && (
          <HomeUploadView
            onStartAnalysis={handleStartAnalysis}
            onSelectMission={handleSelectDemoMission}
            demoMissions={DEMO_MISSIONS}
          />
        )}

        {activeTab === 'scene-analysis' && (
          <MainAnalysisWorkspace
            activeResult={activeResult}
            onNewQuery={(q) => {
              if (activeResult) {
                handleStartAnalysis(
                  activeResult.images.primary,
                  q,
                  activeResult.images.secondary,
                  activeResult.geoMetadata,
                  activeResult.geoMetadataSecondary
                );
              }
            }}
          />
        )}

        {activeTab === 'mission-gallery' && (
          <MissionGalleryView
            missions={DEMO_MISSIONS}
            onSelectMission={handleSelectDemoMission}
          />
        )}

        {activeTab === 'history-logs' && (
          <AnalysisHistoryView
            logs={historyLogs}
            onSelectLog={handleSelectHistoryItem}
          />
        )}

        {activeTab === 'report-generator' && (
          <ReportGeneratorView activeResult={activeResult} />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'evaluation' && <EvaluationView />}

        {activeTab === 'profile' && <ProfileView user={user} setUser={setUser} />}

        {activeTab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}

        {activeTab === 'help' && <HelpView />}
      </main>
    </div>
  );
};

export default App;
