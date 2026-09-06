import {
  AnalysisMode,
  ExecutionResult,
  GeoMetadata,
  GroundingBox,
  ChangeDetectionArea,
  OpticalSarInsight,
  TaskType,
  ModelInfo
} from '../../types/satquery';

export interface ServiceExecutionInput {
  query: string;
  primaryImage: string;
  secondaryImage?: string;
  primaryMetadata?: GeoMetadata;
  secondaryMetadata?: GeoMetadata;
  parameters: Record<string, string | number | boolean>;
}

export interface ServiceExecutionOutput {
  textAnswer: string;
  keyFindings: string[];
  confidence: number;
  spatialInterpretation: string;
  groundingBoxes?: GroundingBox[];
  changeAreas?: ChangeDetectionArea[];
  opticalSarInsight?: OpticalSarInsight;
}

export interface IRemoteSensingService {
  taskType: TaskType;
  modelId: string;
  execute(input: ServiceExecutionInput): Promise<ServiceExecutionOutput>;
}
