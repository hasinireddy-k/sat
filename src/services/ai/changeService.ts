import { IRemoteSensingService, ServiceExecutionInput, ServiceExecutionOutput } from './types';

export class ChangeService implements IRemoteSensingService {
  taskType = 'Temporal Change Analysis' as const;
  modelId = 'siam-changeformer-v2';

  async execute(input: ServiceExecutionInput): Promise<ServiceExecutionOutput> {
    const textAnswer = `Bitemporal change detection between T1 and T2 scenes reveals major surface alterations. Total detected change footprint spans 14.8 sq. km, dominated by river channel expansion and agricultural flood inundation.`;

    const keyFindings = [
      `River channel expansion: Width increased by 340m along southern bank.`,
      `Inundation Footprint: 14.8 sq. km of paddy fields submerged (NDWI delta +0.62).`,
      `Infrastructure: Feeder access road cut off by flood overflow.`,
      `Residential Stability: Zero building collapse in primary residential layout.`,
    ];

    const changeAreas = [
      {
        id: 'ca-1',
        label: 'Severe Flood Inundation - Zone A',
        box: [18, 25, 48, 62] as [number, number, number, number],
        type: 'added' as const,
        changeSeverity: 'high' as const,
        areaSqMeters: 8400000,
        description: 'Submerged active paddy fields and riverine grasslands.',
      },
      {
        id: 'ca-2',
        label: 'Channel Expansion - Zone B',
        box: [52, 12, 85, 40] as [number, number, number, number],
        type: 'modified' as const,
        changeSeverity: 'high' as const,
        areaSqMeters: 4200000,
        description: 'Sandbar erosion and main channel widening.',
      },
      {
        id: 'ca-3',
        label: 'Submerged Access Road',
        box: [65, 68, 78, 88] as [number, number, number, number],
        type: 'added' as const,
        changeSeverity: 'medium' as const,
        areaSqMeters: 2200000,
        description: 'Feeder road cut off by flood overflow.',
      },
    ];

    return {
      textAnswer,
      keyFindings,
      confidence: 96.4,
      spatialInterpretation: `Submerged zones highlighted in cyan/magenta change overlays. Flood plume expands eastward along low-elevation floodplains.`,
      changeAreas,
    };
  }
}

export const changeService = new ChangeService();
