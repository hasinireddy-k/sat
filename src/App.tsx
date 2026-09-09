import React, { useState, useEffect } from 'react';
import { ViewTab, ExecutionResult, DemoMission, GeoMetadata, UserProfile, AppSettings } from './types/satquery';
import { DEMO_MISSIONS } from './data/demoMissions';
import { Header } from './components/common/Header';
import { SpaceBackground } from './components/common/SpaceBackground';
import { OrbitalRocketWidget } from './components/common/OrbitalRocketWidget';
import { agentController } from './services/agentController';
import { satqueryApi } from './services/satqueryApi';

import { LoginView, AuthSuccessData } from './components/views/LoginView';
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

const STORAGE_KEY = 'satquery_authenticated_user';

const getInitialUser = (): UserProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.isAuthenticated === 'boolean') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[SatQuery] LocalStorage read failed:', e);
  }
  return {
    name: 'Dr. Vikram Sharma',
    email: 'lead-analyst@satquery.isro.gov.in',
    organization: 'NRSC Hyderabad (National Remote Sensing Centre)',
    role: 'Lead Geospatial Analyst',
    joinedDate: 'September 2025',
    isAuthenticated: true, // Default is authenticated for instant access
  };
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('mission-control');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [activeResult, setActiveResult] = useState<ExecutionResult | null>(null);

  const [user, setUser] = useState<UserProfile>(getInitialUser);

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    language: 'English',
    responseDetail: 'Balanced',
    showVisualEvidence: true,
    showConfidence: true,
    autoDetectModality: true,
    notificationsEnabled: true,
  });

  const [historyLogs, setHistoryLogs] = useState<ExecutionResult[]>([]);

  useEffect(() => {
    // Fetch real historical analysis records from persistent backend database/store
    satqueryApi.getHistory().then((realHistory) => {
      setHistoryLogs(realHistory || []);
    });
  }, []);

  const handleLoginSuccess = (auth: AuthSuccessData) => {
    const updatedUser: UserProfile = {
      name: auth.name || 'Analyst',
      email: auth.email,
      organization: auth.facility || 'ISRO National Remote Sensing Centre',
      role: auth.role || (auth.isDemo ? 'SIH 2026 Guest Evaluator' : 'Lead Geospatial Analyst'),
      joinedDate: 'September 2025',
      isAuthenticated: true,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('[SatQuery] LocalStorage write failed:', e);
    }
    setActiveTab('mission-control');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[SatQuery] LocalStorage remove failed:', e);
    }
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    setActiveResult(null);
    setActiveTab('mission-control');
  };

  const handleStartAnalysis = async (
    primarySrc: string,
    query: string,
    secondarySrc?: string,
    primaryMeta?: GeoMetadata,
    secondaryMeta?: GeoMetadata
  ) => {
    // 1. Set initial metadata state for workspace view
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
      textAnswer: 'Executing PyTorch multi-spectral specialist analysis pipeline on uploaded raster...',
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

    // 2. Set activeResult immediately and transition to Analysis Workspace
    setActiveResult(tempResult);
    setActiveTab('scene-analysis');

    // 3. Execute query and update with finalized backend response
    try {
      const fileId = primaryMeta?.fileId || (primaryMeta as any)?.file_id;
      const secondaryFileId = secondaryMeta?.fileId || (secondaryMeta as any)?.file_id;
      const finalResult = await satqueryApi.executeQuery(
        {
          query,
          primaryImage: primarySrc,
          secondaryImage: secondarySrc,
          primaryMetadata: primaryMeta,
          secondaryMetadata: secondaryMeta,
          fileId,
          secondaryFileId,
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

  // --- HARD AUTHENTICATION GATE ---
  // When logged out, the user is completely OUT: ONLY the login portal and deep-space galaxy are visible.
  if (!user.isAuthenticated) {
    return (
      <div className="relative h-screen w-screen bg-[#02050e] text-slate-100 font-sans overflow-hidden select-none">
        {/* Full 3D Interactive Galaxy Background */}
        <SpaceBackground />

        {/* Floating Centered Glassmorphic Login Portal */}
        <div className="relative z-10 h-screen w-screen overflow-y-auto flex items-center justify-center p-4">
          <LoginView onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED MISSION CONTROL WORKSPACE ---
  // When logged in, the user enters the full platform with Sidebar, Header, and Workspace.
  return (
    <div className="flex h-screen w-screen bg-black text-slate-100 font-sans overflow-hidden">
      <SpaceBackground />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        demoMode={demoMode}
        setDemoMode={setDemoMode}
        hasLoadedImages={Boolean(activeResult)}
        onResetUpload={() => setActiveResult(null)}
        onLogout={handleLogout}
      />

      <OrbitalRocketWidget />
      <main className="flex-1 h-screen overflow-y-auto relative z-10 px-6 py-8 md:px-12 md:py-10">
        {activeTab === 'mission-control' && (
          <HomeUploadView
            onStartAnalysis={handleStartAnalysis}
            onSelectDemoMission={handleSelectDemoMission}
          />
        )}

        {activeTab === 'scene-analysis' && (
          <MainAnalysisWorkspace
            activeResult={activeResult}
            onBackToHome={() => setActiveTab('mission-control')}
            onGenerateReport={() => setActiveTab('reports')}
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

        {(activeTab === 'gallery' || activeTab === 'mission-gallery') && (
          <MissionGalleryView
            missions={DEMO_MISSIONS}
            onSelectMission={handleSelectDemoMission}
          />
        )}

        {(activeTab === 'history' || activeTab === 'history-logs') && (
          <AnalysisHistoryView
            logs={historyLogs}
            historyLogs={historyLogs}
            onSelectLog={handleSelectHistoryItem}
            onSelectResult={handleSelectHistoryItem}
            onGenerateReport={(item) => {
              setActiveResult(item);
              setActiveTab('reports');
            }}
          />
        )}

        {(activeTab === 'reports' || activeTab === 'report-generator') && (
          <ReportGeneratorView activeResult={activeResult} />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'evaluation' && <EvaluationView />}

        {activeTab === 'profile' && <ProfileView user={user} setUser={setUser} onSignOut={handleLogout} />}

        {activeTab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}

        {activeTab === 'help' && <HelpView />}
      </main>
    </div>
  );
};

export default App;
