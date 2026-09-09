import { DemoMission } from '../types/satquery';

export const DEMO_MISSIONS: DemoMission[] = [
  {
    id: 'mission-01-single-image',
    title: 'MISSION 01 — SINGLE IMAGE INTELLIGENCE',
    subtitle: 'Text-Guided Region Grounding & VQA on High-Res Cartosat Scene',
    domain: 'Urban & Infrastructure',
    mode: 'single',
    location: 'Bengaluru Tech Corridor, India',
    coordinates: '12.9249° N, 77.6792° E',
    sensor: 'Cartosat-3 (0.3m GSD)',
    thumbnail: './assets/scenes/scene-01.jpg',
    description: 'Single-scene visual question answering and text-guided region grounding detecting built-up commercial complexes, road networks, and land cover features.',
    sampleQueries: ['Where are the commercial office complexes and buildings?'],
    precomputedResult: {
      id: 'res-mission-01',
      missionName: 'MISSION 01 — SINGLE IMAGE INTELLIGENCE',
      query: 'Where are the commercial office complexes and buildings?',
      mode: 'single',
      detectedTask: 'Text-Guided Region Grounding',
      selectedModel: {
        id: 'rs-grounding-dino',
        name: 'RS-GroundingDINO Pro',
        provider: 'ISRO DeepEarth Suite',
        version: '2.1.0',
        taskSuitability: ['Text-Guided Region Grounding', 'Visual Question Answering'],
        accuracy: 'Domain Adapted',
        latencyAvg: '350ms',
        supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
        maxResolution: '0.3m / pixel',
        status: 'online'
      },
      configuredParameters: {
        boxThreshold: 0.35,
        textThreshold: 0.25,
        maxBoxes: 25
      },
      validationResult: {
        valid: true,
        format: 'GeoTIFF',
        crsFound: true,
        dimensions: '2048 × 2048',
        notes: 'Validated single-scene high-resolution optical image.'
      },
      textAnswer: 'Located 4 primary commercial office complexes along the main transport corridor. 12 roof-mounted solar photovoltaic arrays identified across the sector.',
      keyFindings: [
        'Commercial infrastructure occupies 38.2% of visible scene.',
        'Rooftop solar photovoltaic footprint: ~18,400 sq. m.',
        'Stormwater retention basin isolated on eastern perimeter.'
      ],
      confidence: 96.4,
      confidenceLevel: 'High',
      spatialInterpretation: 'Bounding boxes demarcate high-density commercial towers and rooftop solar installations.',
      groundingBoxes: [
        { id: 'gb-1', label: 'Commercial Complex Alpha', category: 'Infrastructure', confidence: 96.5, box: [20, 25, 45, 55], color: '#0ea5e9' },
        { id: 'gb-2', label: 'Commercial Complex Beta', category: 'Infrastructure', confidence: 94.2, box: [48, 10, 78, 42], color: '#0ea5e9' }
      ],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Validated single-scene GeoTIFF. EPSG:32643.', status: 'success', latencyMs: 38, timestamp: '19:48:00' },
        { id: 't2', stepNumber: 2, name: 'Query Classification', description: 'Query classified as "Text-Guided Region Grounding".', status: 'success', latencyMs: 50, timestamp: '19:48:00' },
        { id: 't3', stepNumber: 3, name: 'Specialist Selection', description: 'Selected RS-GroundingDINO Pro.', status: 'success', latencyMs: 35, timestamp: '19:48:01' },
        { id: 't4', stepNumber: 4, name: 'Execution', description: 'Evaluated visual feature pyramid.', status: 'success', latencyMs: 240, timestamp: '19:48:01' }
      ],
      geoMetadata: {
        filename: 'Bengaluru_Cartosat3_Single.tif',
        fileSize: '48 MB',
        dimensions: '2048 × 2048',
        crs: 'EPSG:32643 (UTM Zone 43N)',
        resolution: '0.3 m / pixel',
        sensor: 'Cartosat-3',
        acquisitionDate: '10-JAN-2026',
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        bounds: [77.67, 12.91, 77.69, 12.93],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:01',
      executionTimeTotalMs: 363,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: {
        primary: './assets/scenes/cartosat_sample.png'
      }
    }
  },
  {
    id: 'mission-02-bitemporal-change',
    title: 'MISSION 02 — BI-TEMPORAL CHANGE ANALYSIS',
    subtitle: 'Bitemporal Pre (T1) vs Post (T2) Urban Construction & Inundation',
    domain: 'Disaster & Urban',
    mode: 'change',
    location: 'Brahmaputra Basin, Assam, India',
    coordinates: '26.5775° N, 93.1711° E',
    sensor: 'Cartosat-3 + Sentinel-2',
    thumbnail: './assets/scenes/bitemporal_t1.png',
    description: 'Bitemporal change detection comparing pre-event (T1 2024) and post-event (T2 2026) satellite scenes to measure construction expansion and inundation extent.',
    sampleQueries: ['What changed between these pre-event and post-event images?'],
    precomputedResult: {
      id: 'res-mission-02',
      missionName: 'MISSION 02 — BI-TEMPORAL CHANGE ANALYSIS',
      query: 'What changed between these pre-event and post-event images?',
      mode: 'change',
      detectedTask: 'Temporal Change Analysis',
      selectedModel: {
        id: 'siam-changeformer-v2',
        name: 'Siam-ChangeFormer v2',
        provider: 'ISRO Earth-Temporal AI',
        version: '2.0.8',
        taskSuitability: ['Temporal Change Analysis'],
        accuracy: 'Domain Adapted',
        latencyAvg: '680ms',
        supportedInputTypes: ['GeoTIFF Pair', 'TIFF Pair', 'PNG Pair'],
        maxResolution: '0.5m / pixel',
        status: 'online'
      },
      configuredParameters: {
        changeThreshold: 0.45,
        bitemporalCoRegistration: 'Sub-pixel Affine',
        noiseFilterRadius: 3
      },
      validationResult: {
        valid: true,
        format: 'GeoTIFF Pair',
        crsFound: true,
        dimensions: '2048 × 2048',
        notes: 'Validated bitemporal pair (T1 pre-event vs T2 post-event).'
      },
      textAnswer: 'Significant changes are visible in the central built-up region. A total new construction footprint of 3.8 hectares is detected, alongside a 420m extension of the access road artery.',
      keyFindings: [
        '3 new commercial structural foundations detected in Sector 4.',
        'Vegetation clearance footprint: 1.6 hectares along eastern perimeter.',
        'Zero impact to stormwater drainage channels.'
      ],
      confidence: 96.4,
      confidenceLevel: 'High',
      spatialInterpretation: 'Change overlays demarcate new construction footprints in yellow and vegetative clearance in cyan.',
      changeAreas: [
        {
          id: 'ca-1',
          label: 'Urban Construction Expansion',
          box: [20, 25, 45, 55],
          type: 'added',
          changeSeverity: 'high',
          areaSqMeters: 38000,
          description: 'New building foundation footprint.'
        }
      ],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Validated T1 & T2 GeoTIFF headers. EPSG:32646.', status: 'success', latencyMs: 45, timestamp: '19:48:10' },
        { id: 't2', stepNumber: 2, name: 'Query Classification', description: 'Query classified as "Temporal Change Analysis".', status: 'success', latencyMs: 60, timestamp: '19:48:10' },
        { id: 't3', stepNumber: 3, name: 'Specialist Selection', description: 'Selected Siam-ChangeFormer v2.', status: 'success', latencyMs: 35, timestamp: '19:48:11' },
        { id: 't4', stepNumber: 4, name: 'Execution', description: 'Extracted deep spatial change feature matrices.', status: 'success', latencyMs: 310, timestamp: '19:48:11' }
      ],
      geoMetadata: {
        filename: 'Assam_T1_PreEvent_2024.tif',
        fileSize: '48 MB',
        dimensions: '2048 × 2048',
        crs: 'EPSG:32646 (UTM Zone 46N)',
        resolution: '0.5 m / pixel',
        sensor: 'Cartosat-3',
        acquisitionDate: '12-APR-2024',
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        bounds: [93.12, 26.54, 93.22, 26.61],
        format: 'GeoTIFF'
      },
      geoMetadataSecondary: {
        filename: 'Assam_T2_PostEvent_2026.tif',
        fileSize: '50 MB',
        dimensions: '2048 × 2048',
        crs: 'EPSG:32646 (UTM Zone 46N)',
        resolution: '0.5 m / pixel',
        sensor: 'Cartosat-3',
        acquisitionDate: '15-JAN-2026',
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        bounds: [93.12, 26.54, 93.22, 26.61],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:11',
      executionTimeTotalMs: 450,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: {
        primary: './assets/scenes/bitemporal_t1.png',
        secondary: './assets/scenes/bitemporal_t2.png'
      }
    }
  },
  {
    id: 'mission-03-optical-sar',
    title: 'MISSION 03 — OPTICAL × SAR FUSION',
    subtitle: 'Sentinel-2 (Optical) + RISAT-1 (SAR C-Band) Maritime Intelligence',
    domain: 'Maritime & Defense',
    mode: 'optical-sar',
    location: 'JNPT Port, Mumbai, India',
    coordinates: '18.9500° N, 72.9500° E',
    sensor: 'Sentinel-2 MSI + RISAT-1 SAR',
    thumbnail: './assets/scenes/optical_vnir.png',
    description: 'Cross-modal cloud penetration using C-band radar backscatter to resolve vessel traffic hidden beneath monsoon stratocumulus clouds.',
    sampleQueries: ['What information does SAR reveal that optical imagery misses?'],
    precomputedResult: {
      id: 'res-mission-03',
      missionName: 'MISSION 03 — OPTICAL × SAR FUSION',
      query: 'What information does SAR reveal that optical imagery misses?',
      mode: 'optical-sar',
      detectedTask: 'Cross-Modal Optical-SAR Fusion',
      selectedModel: {
        id: 'sar-opt-fusionnet',
        name: 'SAR-Opt-FusionNet',
        provider: 'ISRO Microwave & Optical Sensing Division',
        version: '1.9.4',
        taskSuitability: ['Cross-Modal Optical-SAR Fusion'],
        accuracy: 'Domain Adapted',
        latencyAvg: '540ms',
        supportedInputTypes: ['Optical + SAR GeoTIFF Pair'],
        maxResolution: '1.0m / pixel',
        status: 'online'
      },
      configuredParameters: {
        sarPolarization: 'VV + VH',
        speckleFilter: 'Lee 5x5 Filter',
        coRegistrationMode: 'Phase Correlation'
      },
      validationResult: {
        valid: true,
        format: 'GeoTIFF Pair',
        crsFound: true,
        dimensions: '2048 × 2048',
        notes: 'Co-registered Sentinel-2 RGB + RISAT-1 C-band pair.'
      },
      textAnswer: 'Optical imagery exhibits 65% dense cloud cover obscuring outer harbor anchorages. However, RISAT-1 C-Band SAR penetrates the cloud deck completely, detecting 14 cargo vessels and metallic port cranes with high radar backscatter (RCS > +22 dB).',
      keyFindings: [
        'Optical Evidence: Dense stratocumulus cloud layer hiding 65% of sea surface.',
        'SAR Evidence: 14 metallic ship target backscatter peaks clearly resolved.',
        'Combined Interpretation: Complete 24/7 port operational status achieved despite cloud cover.'
      ],
      confidence: 97.2,
      confidenceLevel: 'High',
      spatialInterpretation: 'Optical view shows cloud obstruction; SAR view highlights bright metallic backscatter points indicating vessel locations.',
      opticalSarInsight: {
        opticalObservations: 'Dense cloud layer hides 65% of harbor surface.',
        sarObservations: 'Clear microwave penetration revealing 14 vessel RCS targets.',
        complementarySynthesis: 'Combining Optical spectral land-use with SAR all-weather backscatter delivers full operational awareness.',
        penetrationEvidence: 'Double-bounce return from steel ship hulls enables 100% vessel detection through clouds.'
      },
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Validated Optical RGB + SAR VV/VH GeoTIFF pair.', status: 'success', latencyMs: 50, timestamp: '19:48:20' },
        { id: 't2', stepNumber: 2, name: 'Query Classification', description: 'Query classified as "Cross-Modal Optical-SAR Fusion".', status: 'success', latencyMs: 40, timestamp: '19:48:20' },
        { id: 't3', stepNumber: 3, name: 'Specialist Selection', description: 'Selected SAR-Opt-FusionNet.', status: 'success', latencyMs: 30, timestamp: '19:48:21' },
        { id: 't4', stepNumber: 4, name: 'Execution', description: 'Fused spectral reflectance with Radar Cross Section matrix.', status: 'success', latencyMs: 290, timestamp: '19:48:21' }
      ],
      geoMetadata: {
        filename: 'JNPT_Port_Sentinel2_Optical.tif',
        fileSize: '54 MB',
        dimensions: '2048 × 2048',
        crs: 'EPSG:32643 (UTM Zone 43N)',
        resolution: '1.0 m / pixel',
        sensor: 'Sentinel-2A MSI',
        acquisitionDate: '04-AUG-2025',
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        bounds: [72.90, 18.90, 73.00, 19.00],
        format: 'GeoTIFF'
      },
      geoMetadataSecondary: {
        filename: 'JNPT_Port_RISAT1_SAR.tif',
        fileSize: '58 MB',
        dimensions: '2048 × 2048',
        crs: 'EPSG:32643 (UTM Zone 43N)',
        resolution: '1.0 m / pixel',
        sensor: 'RISAT-1 C-Band SAR',
        acquisitionDate: '04-AUG-2025',
        bands: ['VV Polarization', 'VH Polarization'],
        bounds: [72.90, 18.90, 73.00, 19.00],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:21',
      executionTimeTotalMs: 410,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: {
        primary: './assets/scenes/optical_vnir.png',
        secondary: './assets/scenes/sar_cband.png'
      }
    }
  },
  {
    id: 'mission-03-urban-scene',
    title: 'Mission 03 — Urban Scene Grounding',
    subtitle: 'Text-Guided Bounding Box Localization on WorldView-3 / Cartosat-2E',
    domain: 'Urban & Infrastructure',
    mode: 'single',
    location: 'Outer Ring Road, Bengaluru, India',
    coordinates: '12.9249° N, 77.6792° E',
    sensor: 'Cartosat-2E High-Res',
    thumbnail: './assets/scenes/scene-01.jpg',
    description: 'Text-guided region grounding isolating commercial office complexes, rooftop solar arrays, and rainwater harvesting basins.',
    sampleQueries: ['Where are the major built-up regions?'],
    precomputedResult: {
      id: 'res-mission-03',
      missionName: 'Mission 03 — Urban Scene Grounding',
      query: 'Where are the major built-up regions?',
      mode: 'single',
      detectedTask: 'Text-Guided Region Grounding',
      selectedModel: {
        id: 'rs-grounding-dino',
        name: 'RS-GroundingDINO Pro',
        provider: 'ISRO DeepEarth Suite',
        version: '2.1.0',
        taskSuitability: ['Text-Guided Region Grounding'],
        accuracy: 'Domain Adapted',
        latencyAvg: '350ms',
        supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
        maxResolution: '0.1m / pixel',
        status: 'online'
      },
      configuredParameters: { boxThreshold: 0.35, textThreshold: 0.25, maxBoxes: 25 },
      validationResult: { valid: true, format: 'GeoTIFF', crsFound: true, dimensions: '3072 x 3072px (0.3m/px)', notes: 'Validated RGB+NIR GeoTIFF.' },
      textAnswer: 'Located 4 primary commercial office complexes along the main transport corridor. 12 roof-mounted solar photovoltaic arrays identified across the sector.',
      keyFindings: [
        'Commercial infrastructure occupies 38.2% of visible scene.',
        'Rooftop solar photovoltaic footprint: ~18,400 sq. m.',
        'Stormwater retention basin isolated on eastern perimeter.'
      ],
      confidence: 94.8,
      confidenceLevel: 'High',
      spatialInterpretation: 'Bounding boxes demarcate high-density commercial towers (green) and rooftop solar installations (yellow).',
      groundingBoxes: [
        { id: 'gb-1', label: 'Tech Park Block Alpha', category: 'Commercial Infrastructure', confidence: 96.5, box: [15, 12, 42, 45], color: '#10B981' },
        { id: 'gb-2', label: 'Tech Park Block Beta', category: 'Commercial Infrastructure', confidence: 94.2, box: [48, 10, 78, 42], color: '#10B981' }
      ],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Parsed GeoTIFF tags. EPSG:32643.', status: 'success', latencyMs: 38, timestamp: '19:48:20' },
        { id: 't2', stepNumber: 2, name: 'Query Classification', description: 'Classified task as Region Grounding.', status: 'success', latencyMs: 50, timestamp: '19:48:20' },
        { id: 't3', stepNumber: 3, name: 'Specialist Selection', description: 'Selected RS-GroundingDINO Pro.', status: 'success', latencyMs: 20, timestamp: '19:48:21' },
        { id: 't4', stepNumber: 4, name: 'Execution', description: 'Evaluated text tokens against visual feature pyramid.', status: 'success', latencyMs: 240, timestamp: '19:48:21' }
      ],
      geoMetadata: {
        filename: 'Bengaluru_ORR_Sector_03.tif',
        fileSize: '62 MB',
        dimensions: '3072 x 3072 px',
        crs: 'EPSG:32643 (UTM Zone 43N)',
        resolution: '0.3 m / pixel',
        sensor: 'Cartosat-2E High-Res',
        acquisitionDate: '15-JAN-2026',
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        bounds: [77.67, 12.91, 77.69, 12.93],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:21',
      executionTimeTotalMs: 348,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: { primary: './assets/scenes/scene-01.jpg' }
    }
  },
  {
    id: 'mission-04-agriculture',
    title: 'Mission 04 — Agricultural Landscape',
    subtitle: 'Resourcesat-2A LISS-IV Vegetation Vigor Scene Description',
    domain: 'Agriculture & Forestry',
    mode: 'single',
    location: 'Ludhiana District, Punjab, India',
    coordinates: '30.9010° N, 75.8573° E',
    sensor: 'Resourcesat-2A LISS-IV',
    thumbnail: './assets/scenes/scene-04.jpg',
    description: 'Multispectral scene description analyzing paddy crop growth stages, NDVI health index, and harvested stubble risk areas.',
    sampleQueries: ['Describe the dominant land-cover patterns.'],
    precomputedResult: {
      id: 'res-mission-04',
      missionName: 'Mission 04 — Agricultural Landscape',
      query: 'Describe the dominant land-cover patterns.',
      mode: 'single',
      detectedTask: 'Scene Description & Captioning',
      selectedModel: {
        id: 'geocaptioner-pro',
        name: 'GeoCaptioner-Pro',
        provider: 'ISRO NRSC',
        version: '4.0.1',
        taskSuitability: ['Scene Description & Captioning'],
        accuracy: 'Domain Adapted',
        latencyAvg: '290ms',
        supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
        maxResolution: '0.5m / pixel',
        status: 'online'
      },
      configuredParameters: { detailLevel: 'Comprehensive', landUseTaxonomy: 'ISRO LULC Level 3' },
      validationResult: { valid: true, format: 'GeoTIFF', crsFound: true, dimensions: '2048 x 2048px (0.8m/px)', notes: 'Multispectral 4-band image.' },
      textAnswer: 'The scene depicts an agricultural landscape dominated by paddy rice cultivation in central Punjab. Approximately 68% of the plot area shows healthy vegetative canopy (NDVI > 0.72). 22% of fields are recently harvested.',
      keyFindings: [
        'Dominant Land Cover: Paddy rice fields (68% coverage).',
        'Crop Vigor: High canopy vigor (Mean NDVI = 0.76).',
        'Harvest Status: 22% harvested fields exhibit high SWIR backscatter.'
      ],
      confidence: 95.3,
      confidenceLevel: 'High',
      spatialInterpretation: 'Regular rectangular parcel layout typical of irrigated Gangetic plains.',
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Validated 4-band image. EPSG:32643.', status: 'success', latencyMs: 32, timestamp: '19:48:30' },
        { id: 't2', stepNumber: 2, name: 'Query Classification', description: 'Classified task as Scene Description.', status: 'success', latencyMs: 44, timestamp: '19:48:30' }
      ],
      geoMetadata: {
        filename: 'Punjab_Ludhiana_LISS4.tif',
        fileSize: '42 MB',
        dimensions: '2048 x 2048 px',
        crs: 'EPSG:32643 (UTM Zone 43N)',
        resolution: '0.8 m / pixel',
        sensor: 'Resourcesat-2A LISS-IV',
        acquisitionDate: '20-OCT-2025',
        bands: ['Green', 'Red', 'NIR', 'SWIR'],
        bounds: [75.80, 30.85, 75.90, 30.95],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:31',
      executionTimeTotalMs: 296,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: { primary: './assets/scenes/scene-04.jpg' }
    }
  },
  {
    id: 'mission-05-infrastructure',
    title: 'Mission 05 — Linear Infrastructure Grounding',
    subtitle: 'Transport Artery & Bridge Structure Localization',
    domain: 'Urban & Infrastructure',
    mode: 'single',
    location: 'Transport & Highway Bridge Corridor, India',
    coordinates: '19.0365° N, 72.8172° E',
    sensor: 'Cartosat-3 PAN-Sharpened (0.28m GSD)',
    thumbnail: './assets/scenes/scene-05.jpg',
    description: 'Text-guided region grounding detecting national highway bridge spans, rail embankments, and culverts.',
    sampleQueries: ['Identify major linear structures.'],
    precomputedResult: {
      id: 'res-mission-05',
      missionName: 'Mission 05 — Linear Infrastructure Grounding',
      query: 'Identify major linear structures.',
      mode: 'single',
      detectedTask: 'Text-Guided Region Grounding',
      selectedModel: {
        id: 'rs-grounding-dino',
        name: 'RS-GroundingDINO Pro',
        provider: 'ISRO DeepEarth Suite',
        version: '2.1.0',
        taskSuitability: ['Text-Guided Region Grounding'],
        accuracy: 'Domain Adapted',
        latencyAvg: '350ms',
        supportedInputTypes: ['GeoTIFF', 'TIFF', 'PNG', 'JPEG'],
        maxResolution: '0.1m / pixel',
        status: 'online'
      },
      configuredParameters: { boxThreshold: 0.35 },
      validationResult: { valid: true, format: 'GeoTIFF', crsFound: true, dimensions: '2048 x 2048px (0.5m/px)', notes: 'Validated PAN-Sharpened scene.' },
      textAnswer: 'Located 2 major linear transport structures: the 4-lane National Highway corridor and an adjacent rail bridge span.',
      keyFindings: [
        'National Highway Span: 100% structural continuity verified.',
        'Rail Embankment: Clear setback along river bank.',
        'Feeder bridge: Free from debris obstruction.'
      ],
      confidence: 96.1,
      confidenceLevel: 'High',
      spatialInterpretation: 'Green bounding boxes indicate major transport bridge spans.',
      groundingBoxes: [
        { id: 'gb-infra-1', label: 'National Highway Rail/Bridge Corridor', category: 'Infrastructure', confidence: 96.5, box: [30, 20, 65, 75], color: '#10B981' }
      ],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Validated GeoTIFF. EPSG:32646.', status: 'success', latencyMs: 38, timestamp: '19:48:40' }
      ],
      geoMetadata: {
        filename: 'Assam_Corridor_Cartosat3.tif',
        fileSize: '45 MB',
        dimensions: '2048 x 2048 px',
        crs: 'EPSG:32646 (UTM Zone 46N)',
        resolution: '0.5 m / pixel',
        sensor: 'Cartosat-3',
        acquisitionDate: '12-APR-2025',
        bounds: [93.12, 26.54, 93.22, 26.61],
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:41',
      executionTimeTotalMs: 310,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: { primary: './assets/scenes/scene-05.jpg' }
    }
  },
  {
    id: 'mission-06-change-intelligence',
    title: 'Mission 06 — Change Intelligence',
    subtitle: 'Brahmaputra River Inundation & Sandbar Erosion',
    domain: 'Disaster Assessment',
    mode: 'change',
    location: 'Kaziranga Brahmaputra Basin, Assam, India',
    coordinates: '26.5775° N, 93.1711° E',
    sensor: 'Sentinel-2A MSI + Cartosat-3',
    thumbnail: './assets/scenes/bitemporal_t1.png',
    description: 'Comprehensive change intelligence analyzing flood inundation extent and river bank erosion.',
    sampleQueries: ['Summarize the most significant changes.'],
    precomputedResult: {
      id: 'res-mission-06',
      missionName: 'Mission 06 — Change Intelligence',
      query: 'Summarize the most significant changes.',
      mode: 'change',
      detectedTask: 'Temporal Change Analysis',
      selectedModel: {
        id: 'siam-changeformer-v2',
        name: 'Siam-ChangeFormer v2',
        provider: 'ISRO Earth-Temporal AI',
        version: '2.0.8',
        taskSuitability: ['Temporal Change Analysis'],
        accuracy: 'Domain Adapted',
        latencyAvg: '680ms',
        supportedInputTypes: ['GeoTIFF Pair', 'TIFF Pair', 'PNG Pair'],
        maxResolution: '0.5m / pixel',
        status: 'online'
      },
      configuredParameters: { changeThreshold: 0.45 },
      validationResult: { valid: true, format: 'GeoTIFF Pair', crsFound: true, dimensions: '2048 x 2048px (0.5m/px)', notes: 'Co-registered pair verified.' },
      textAnswer: 'The most significant changes are widespread agricultural inundation (14.8 sq. km) and river bank erosion expanding the main channel by 340m.',
      keyFindings: [
        '14.8 sq. km flood inundation footprint across floodplains.',
        'River channel widening along southern bank.',
        'Two rural feeder roads isolated by water.'
      ],
      confidence: 96.4,
      confidenceLevel: 'High',
      spatialInterpretation: 'Cyan change overlays demarcate standing water expansion.',
      changeAreas: [
        { id: 'ca-flood-1', label: 'Flood Inundation Polygon', box: [18, 25, 48, 62], type: 'added', changeSeverity: 'high', areaSqMeters: 8400000, description: 'Submerged paddy grasslands.' }
      ],
      trace: [
        { id: 't1', stepNumber: 1, name: 'Input Validation', description: 'Validated T1 & T2 GeoTIFF headers.', status: 'success', latencyMs: 45, timestamp: '19:48:50' }
      ],
      geoMetadata: {
        filename: 'Assam_PreFlood_T1.tif',
        fileSize: '48 MB',
        dimensions: '2048 x 2048 px',
        crs: 'EPSG:32646 (UTM Zone 46N)',
        resolution: '0.5 m / pixel',
        sensor: 'Cartosat-3',
        acquisitionDate: '12-APR-2025',
        bands: ['Red', 'Green', 'Blue', 'NIR'],
        bounds: [93.12, 26.54, 93.22, 26.61],
        format: 'GeoTIFF'
      },
      timestamp: '2026-09-06 19:48:51',
      executionTimeTotalMs: 590,
      isPrecomputed: true,
      isDemoAnalysis: true,
      images: {
        primary: './assets/scenes/bitemporal_t1.png',
        secondary: './assets/scenes/bitemporal_t2.png'
      }
    }
  }
];
