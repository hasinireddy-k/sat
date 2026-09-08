import { ModelInfo, TaskType } from '../types/satquery';

export const SPECIALIST_MODELS: ModelInfo[] = [
  {
    id: 'geovlm-isro-v3',
    name: 'GeoVLM PyTorch Engine',
    provider: 'SatQuery Remote Sensing AI Lab',
    version: '2.6.0',
    taskSuitability: ['Visual Question Answering', 'Scene Description & Captioning'],
    accuracy: 'Evaluated per raster',
    latencyAvg: '180ms',
    supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
    maxResolution: 'Native GSD',
    status: 'online',
  },
  {
    id: 'rs-grounding-dino',
    name: 'RS-Grounding PyTorch Model',
    provider: 'SatQuery Vision Transformer Suite',
    version: '2.1.0',
    taskSuitability: ['Text-Guided Region Grounding'],
    accuracy: 'Contour IoU Evaluated',
    latencyAvg: '210ms',
    supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
    maxResolution: 'Native GSD',
    status: 'online',
  },
  {
    id: 'siam-changeformer-v2',
    name: 'Siam-ChangeFormer PyTorch',
    provider: 'SatQuery Earth-Temporal AI',
    version: '2.0.8',
    taskSuitability: ['Temporal Change Analysis'],
    accuracy: 'Difference Matrix Evaluated',
    latencyAvg: '310ms',
    supportedInputTypes: ['GeoTIFF Pair', 'TIFF Pair', 'PNG Pair'],
    maxResolution: 'Native GSD',
    status: 'online',
  },
  {
    id: 'sar-opt-fusionnet',
    name: 'SAR-Opt-FusionNet',
    provider: 'SatQuery Multimodal Sensing',
    version: '1.9.4',
    taskSuitability: ['Cross-Modal Optical-SAR Fusion'],
    accuracy: 'Microwave Backscatter Co-registered',
    latencyAvg: '280ms',
    supportedInputTypes: ['Optical + SAR GeoTIFF Pair'],
    maxResolution: 'Native GSD',
    status: 'online',
  },
  {
    id: 'geocaptioner-pro',
    name: 'GeoCaptioner PyTorch Engine',
    provider: 'SatQuery Remote Sensing NRSC',
    version: '2.6.0',
    taskSuitability: ['Scene Description & Captioning'],
    accuracy: 'Raster Analysis',
    latencyAvg: '150ms',
    supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
    maxResolution: 'Native GSD',
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
        crsAwareness: 'TIFF Header Auto-Detect',
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
        bitemporalCoRegistration: 'Affine Matrix',
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
        detailLevel: 'Scientific Spatial Analysis',
        landUseTaxonomy: 'Level 3 LULC',
        maxSentenceCount: 6,
      };
    default:
      return { confidenceThreshold: 0.5 };
  }
}
