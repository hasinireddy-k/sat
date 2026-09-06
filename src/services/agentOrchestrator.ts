import { ExecutionResult, TraceStep, AnalysisMode, GeoMetadata } from '../types/satquery';
import { agentController } from './agentController';

export interface ExecuteParams {
  mode: AnalysisMode;
  query: string;
  primaryImage: string;
  secondaryImage?: string;
  primaryMetadata?: GeoMetadata;
  secondaryMetadata?: GeoMetadata;
}

export async function runAgentOrchestration(
  params: ExecuteParams,
  onTraceUpdate?: (steps: TraceStep[]) => void
): Promise<ExecutionResult> {
  return agentController.runOrchestration(
    {
      query: params.query,
      primaryImage: params.primaryImage,
      secondaryImage: params.secondaryImage,
      primaryMetadata: params.primaryMetadata,
      secondaryMetadata: params.secondaryMetadata,
      forcedMode: params.mode
    },
    onTraceUpdate
  );
}
