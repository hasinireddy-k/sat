export type AnalysisMode = 'single' | 'optical-sar' | 'change';

export type ViewTab =
  | 'login'
  | 'mission-control'
  | 'scene-analysis'
  | 'change-detection'
  | 'optical-sar'
  | 'gallery'
  | 'history'
  | 'reports'
  | 'profile'
  | 'settings'
  | 'help'
  | 'architecture'
  | 'evaluation';

export type TaskType =
  | 'Visual Question Answering'
  | 'Scene Description & Captioning'
  | 'Text-Guided Region Grounding'
  | 'Temporal Change Analysis'
  | 'Cross-Modal Optical-SAR Fusion';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface GeoMetadata {
  filename: string;
  fileSize: string;
  dimensions: string;
  crs: string;
  resolution: string;
  sensor: string;
  acquisitionDate: string;
  bands: string[];
  bounds?: [number, number, number, number];
  format: 'GeoTIFF' | 'TIFF' | 'PNG' | 'JPEG';
  fileId?: string;
  file_id?: string;
  secondary_file_id?: string;
  secondaryFileId?: string;
  bandCount?: number;
}

export interface GroundingBox {
  id: string;
  label: string;
  category: string;
  confidence: number;
  box: [number, number, number, number];
  color?: string;
}

export interface ChangeDetectionArea {
  id: string;
  label: string;
  box: [number, number, number, number];
  type: 'added' | 'removed' | 'modified';
  changeSeverity: 'high' | 'medium' | 'low';
  areaSqMeters: number;
  description: string;
}

export interface OpticalSarInsight {
  opticalObservations: string;
  sarObservations: string;
  complementarySynthesis: string;
  penetrationEvidence: string;
}

export interface TraceStep {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  latencyMs: number;
  detail?: string;
  timestamp: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  version: string;
  taskSuitability: TaskType[];
  accuracy: string;
  latencyAvg: string;
  supportedInputTypes: string[];
  maxResolution: string;
  status: 'online' | 'standby' | 'busy';
}

export interface ExecutionResult {
  id: string;
  missionName?: string;
  query: string;
  mode: AnalysisMode;
  detectedTask: TaskType;
  selectedModel: ModelInfo;
  configuredParameters: Record<string, string | number | boolean>;
  validationResult: {
    valid: boolean;
    format: string;
    crsFound: boolean;
    dimensions: string;
    notes: string;
  };
  textAnswer: string;
  keyFindings: string[];
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  spatialInterpretation: string;
  groundingBoxes?: GroundingBox[];
  changeAreas?: ChangeDetectionArea[];
  opticalSarInsight?: OpticalSarInsight;
  trace: TraceStep[];
  geoMetadata: GeoMetadata;
  geoMetadataSecondary?: GeoMetadata;
  timestamp: string;
  executionTimeTotalMs: number;
  isPrecomputed?: boolean;
  isDemoAnalysis?: boolean;
  images: {
    primary: string;
    secondary?: string;
    overlayMask?: string;
  };
}

export interface DemoMission {
  id: string;
  title: string;
  subtitle: string;
  domain: 'Disaster Assessment' | 'Urban & Infrastructure' | 'Agriculture & Forestry' | 'Maritime & Defense' | 'Environmental';
  mode: AnalysisMode;
  location: string;
  coordinates: string;
  sensor: string;
  description: string;
  sampleQueries: string[];
  precomputedResult: ExecutionResult;
  thumbnail: string;
}

export interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
  joinedDate: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'system';
  language: string;
  responseDetail: 'Concise' | 'Balanced' | 'Detailed';
  showVisualEvidence: boolean;
  showConfidence: boolean;
  autoDetectModality: boolean;
  notificationsEnabled: boolean;
}
