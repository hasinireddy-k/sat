import { ModelInfo, TaskType } from '../types/satquery';

export const SPECIALIST_MODELS: ModelInfo[] = [
  {
    id: 'geovlm-isro-v3',
    name: 'GeoVLM-ISRO v3',
    provider: 'ISRO SAC / Remote Sensing AI Lab',
    version: '3.4.1-fp16',
    taskSuitability: ['Visual Question Answering', 'Scene Description & Captioning'],
    accuracy: '94.8% VQA-RS',
    latencyAvg: '420ms',
    supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
    maxResolution: '0.25m / pixel',
    status: 'online',
  },
  {
    id: 'rs-grounding-dino',
    name: 'RS-GroundingDINO Pro',
    provider: 'ISRO DeepEarth Suite',
    version: '2.1.0',
    taskSuitability: ['Text-Guided Region Grounding'],
    accuracy: '89.4% mAP50',
    latencyAvg: '350ms',
    supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
    maxResolution: '0.1m / pixel',
    status: 'online',
  },
  {
    id: 'siam-changeformer-v2',
    name: 'Siam-ChangeFormer v2',
    provider: 'ISRO Earth-Temporal AI',
    version: '2.0.8',
    taskSuitability: ['Temporal Change Analysis'],
    accuracy: '93.2% F1-Score',
    latencyAvg: '680ms',
    supportedInputTypes: ['GeoTIFF Pair', 'TIFF Pair', 'PNG Pair'],
    maxResolution: '0.5m / pixel',
    status: 'online',
  },
  {
    id: 'sar-opt-fusionnet',
    name: 'SAR-Opt-FusionNet',
    provider: 'ISRO Microwave & Optical Sensing Division',
    version: '1.9.4',
    taskSuitability: ['Cross-Modal Optical-SAR Fusion'],
    accuracy: '96.1% Co-registration IoU',
    latencyAvg: '540ms',
    supportedInputTypes: ['Optical + SAR GeoTIFF Pair'],
    maxResolution: '1.0m / pixel',
    status: 'online',
  },
  {
    id: 'geocaptioner-pro',
    name: 'GeoCaptioner-Pro',
    provider: 'ISRO National Remote Sensing Centre (NRSC)',
    version: '4.0.1',
    taskSuitability: ['Scene Description & Captioning'],
    accuracy: '91.7% CIDEr',
    latencyAvg: '290ms',
    supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
    maxResolution: '0.5m / pixel',
    status: 'online',
  },
];

export function selectSpecialistModel(task: TaskType): ModelInfo {
  const matched = SPECIALIST_MODELS.find((m) => m.taskSuitability.includes(task));
  return matched || SPECIALIST_MODELS[0];
}

export function getDefaultModelParameters(modelId: string): Record<string, string | number | boolean> {
  switch (modelId) {
    case 'geovlm-isro-v3':
      return {
        temperature: 0.2,
        topP: 0.95,
        maxTokens: 512,
        spatialGroundingEnabled: true,
        crsAwareness: 'EPSG Auto-Detect',
      };
    case 'rs-grounding-dino':
      return {
        boxThreshold: 0.35,
        textThreshold: 0.25,
        nmsIoUThreshold: 0.5,
        maxBoxes: 25,
      };
    case 'siam-changeformer-v2':
      return {
        changeThreshold: 0.45,
        bitemporalCoRegistration: 'Affine + Elastic',
        minChangeAreaSqM: 100,
        noiseFilterRadius: 3,
      };
    case 'sar-opt-fusionnet':
      return {
        sarPolarization: 'VV + VH',
        speckleFilter: 'Lee 5x5',
        opticalBandCombination: 'RGB + NIR',
        coRegistrationMode: 'Phase Correlation',
      };
    case 'geocaptioner-pro':
      return {
        detailLevel: 'Comprehensive Scientific',
        landUseTaxonomy: 'ISRO LULC Level 3',
        maxSentenceCount: 6,
      };
    default:
      return { confidenceThreshold: 0.5 };
  }
}
