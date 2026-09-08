# SATQUERY AI — UI/UX LOCK SPECIFICATION

> **DOCUMENT STATUS: FROZEN & LOCKED**  
> **Target Version:** SatQuery AI v2.6.0 (SIH 2026 Problem Statement 26167)  
> **Rule of Enforcement:** Strict Visual Immutability. Backend integration must occur underneath this exact interface without modifying components, colors, typography, spacing, navigation, or animations.

---

## 1. DESIGN SYSTEM CORE

### 1.1 Color Palette
The interface enforces a deep aerospace dark-mode palette ("Mission Control Glassmorphism"):

```css
:root {
  --bg-deep: #000000;              /* Main viewport background */
  --sat-blue: #0084ff;             /* Primary SatQuery blue brand accent */
  --sat-cyan: #00e5ff;             /* Technical cyan for telemetry & highlights */
  --sidebar-w: 240px;              /* Persistent sidebar width */
}
```

| Token / Usage | Hex / Tailwind Class | Visual Role |
| :--- | :--- | :--- |
| **Viewport Base** | `#000000` (`bg-black`) | Deep void black background |
| **Primary Panel** | `#0b0f19` | Surface color for toolbars, control strips & cards |
| **Inner Card** | `#070a12` | Nested cards, image canvas background & preview wells |
| **Input Surface** | `#05090f` | High-contrast query text inputs and terminal strips |
| **Brand Blue** | `#0084ff` | Primary buttons, active nav indicators, focus rings |
| **Telemetry Cyan** | `#00e5ff` / `text-cyan-400` | Machine telemetry, active task badges, bounding boxes |
| **Status Green** | `#10b981` / `emerald-400` | Online beacons, completed trace checks, high confidence |
| **Alert Rose** | `#f43f5e` / `rose-400` | Incompatibility notices, validation errors |
| **Spectral Purple**| `#a855f7` / `purple-400` | False-Color NIR composite indicators & secondary sensor |
| **Borders** | `border-white/10`, `border-slate-800` | Subtle hairline separation (1px solid) |

### 1.2 Typography System
Three designated font families are loaded via Google Fonts in `index.html`:

1. **Body & Prose:** `'Inter', sans-serif` (`font-sans`)
   - Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
   - Used for descriptive analysis paragraphs, button labels, and general copy.
2. **Technical Telemetry & Badges:** `'IBM Plex Mono', monospace` (`.mono` / `font-mono`)
   - Used for CRS coordinates, resolution (GSD), file metadata, trace latencies, and telemetry tags.
3. **Hero & Mission Headings:** `'Space Grotesk', sans-serif` (`.heading`)
   - Letter-spacing: `0.05em`
   - Weight: `800` (Extrabold), `text-transform: uppercase`
   - Used for main hero banners: `"EARTH OBSERVATION INTELLIGENCE"`.

---

## 2. PAGE & LAYOUT STRUCTURE

### 2.1 Viewport Scaffold
```
┌─────────────────┬────────────────────────────────────────────────────────┐
│  SIDEBAR        │  SPACE BACKGROUND (Orbital grid, starfields, nebulae)  │
│  (w-[240px])    ├────────────────────────────────────────────────────────┤
│                 │  ACTIVE VIEW CONTAINER (max-w-6xl mx-auto space-y-12)  │
│  • Logo link    │                                                        │
│  • Nav items    │  • Hero Section / Header Strip                         │
│  • Systems nav  │  • Data Ingestion Console / Dual-Column Workspace      │
│  • Status dot   │  • Telemetry Footer                                    │
└─────────────────┴────────────────────────────────────────────────────────┘
```

- **Sidebar:** Left-aligned, fixed width of exactly `240px` (`w-[240px]`), `border-r border-white/10`, sticky top-0, height `h-screen`, `z-50`.
- **Main Content:** Flex container (`flex-1 min-h-[calc(100vh-4rem)]`), `overflow-y-auto`, padded container (`max-w-6xl mx-auto px-6 py-8`).
- **Space Atmosphere:** Layered behind all views with fixed positioning (`SpaceBackground.tsx`):
  - `.orbital-bg`: 160px × 160px coordinate grid (`rgba(0, 132, 255, 0.04)`) pulsing at 2s alternate.
  - `.starfield`: 3 drifting star layers (18s, 24s, 30s linear translations).
  - `.planet-glow-sphere`: Floating radial glow at bottom-right (580px × 580px).
  - `.moon-orbit-sphere`: Secondary orbital sphere at top-left (140px × 140px).
  - `.orbital-arcs`: Concentric celestial orbit rings (80vw × 80vw) rotating continuously.

---

## 3. SIDEBAR NAVIGATION

### 3.1 Header & Brand Mark
- **Container:** `p-6 flex items-center gap-2`
- **Icon Mark:** 32px × 32px (`w-8 h-8`) solid `#0084ff` square with `rounded-sm` containing white satellite glyph.
- **Brand Text:** `font-mono font-bold text-lg tracking-tighter text-white` — `"SATQUERY AI"`.

### 3.2 Navigation Items
Each navigation item follows the exact interaction states:
- **Active State (`.nav-item-active`):**
  - Background: `rgba(0, 132, 255, 0.15)`
  - Borders: `border-left: 2px solid #0084ff; border-right: 2px solid #0084ff;`
  - Text: `#ffffff font-medium`
- **Inactive State (`.nav-item-hover-dashed`):**
  - Text: `text-slate-400 hover:text-white`
  - Hover outline: `1px dashed rgba(0, 132, 255, 0.5)` with `-1px` offset.

**Items List:**
1. `Mission Control` (`id="nav-mission-control"`, tab: `mission-control`)
2. `Missions` (`id="nav-missions"`, tab: `gallery`)
3. `Analysis History` (`id="nav-history"`, tab: `history`)
4. `Reports` (`id="nav-reports"`, tab: `reports`)
5. `Evaluation Lab` (`id="nav-lab"`, tab: `evaluation`)
6. *Systems Section Divider* (`text-[10px] text-slate-500 uppercase tracking-widest mono`)
7. `Settings` (`id="nav-settings"`, tab: `settings`)
8. `Help Support` (`id="nav-help"`, tab: `help`)

### 3.3 Status Footer
- Positioned at bottom: `p-6 border-t border-white/10`
- Pulsing Green Beacon:
  - Outer ring: `animate-ping rounded-full bg-emerald-400 opacity-75` (10px × 10px)
  - Core dot: `bg-emerald-500 status-dot-glow` (`box-shadow: 0 0 10px rgba(16, 185, 129, 0.8)`)
- Text: `mono text-[10px] text-slate-400 uppercase tracking-widest` — `"AI ENGINE ONLINE"`.

---

## 4. UPLOAD INTERFACE (DATA INGESTION CONSOLE)

Located in `HomeUploadView.tsx`:

### 4.1 Modality Selector Slots (4-Column Matrix)
Grid layout: `grid grid-cols-2 lg:grid-cols-4 border border-white/15`:
1. **OPTICAL:** Camera icon (`lucide-react`), label: `"OPTICAL"`, subtext: `"OPTICAL: RGB Panchromatic"`.
2. **MULTISPECTRAL:** Layers icon, label: `"MULTISPECTRAL"`, subtext: `"8-13 BANDS (GeoTIFF)"`.
3. **SAR / RADAR:** Microwave radar waves icon, label: `"SAR"`, subtext: `"C-BAND HH/VV"`.
4. **BI-TEMPORAL:** Double temporal arrows icon, label: `"BI-TEMPORAL"`, subtext: `"T1 BEFORE + T2 AFTER"`.

**Slot Styling:**
- Height: `h-[180px]`, background: `bg-white/[0.02]`, border: `border-r border-white/10`.
- Hover Effect (`.shimmer-trigger`): `hover:bg-[#0084ff]/10 hover:border-[#0084ff] hover:shadow-[0_0_20px_rgba(0,132,255,0.15)]`, scale `1.03` with 0.15s linear shimmer reflection.

### 4.2 Loaded Imagery Preview Card
When a file is ingested, a preview well mounts:
- Container: `p-4 bg-[#070a12] border border-cyan-500/40 rounded-xl font-mono text-xs shadow-lg`
- Thumbnail: `w-24 h-20 rounded object-cover border border-cyan-500/30`
- Metadata rows:
  - `FILENAME`: Bold cyan text
  - `ROLE`: `"PRIMARY / T1 SCENE"` or `"SECONDARY / T2 / SAR SCENE"`
  - `SENSOR`: e.g., `"Multispectral GeoTIFF Sensor"`
  - `DIM`: e.g., `"2048x2048"` | `CRS`: e.g., `"EPSG:32643"`
- Action: `"✕ REMOVE INPUT IMAGERY"` button (`text-[10px] bg-slate-900 border border-slate-700`).

---

## 5. MISSION QUERY CONSOLE

Located in `HomeUploadView.tsx`:

### 5.1 Main Query Bar
- Glow Container (`.query-glow`): `p-[1px] rounded-sm bg-white/10 group-focus-within:bg-[#0084ff]/20` with breathing shadow `0 0 15px rgba(0, 132, 255, 0.15)`.
- Live Status Indicator: 8px green dot `bg-emerald-500` shifting to blue `bg-[#0084ff]` on input focus.
- Input Element:
  ```html
  <input
    type="text"
    placeholder="ENTER YOUR MISSION QUERY..."
    className="w-full bg-[#05090f] border-none px-4 py-7 text-white placeholder-slate-600 outline-none font-medium text-lg rounded-sm"
  />
  ```
- Shortcut Badge: `mono text-[10px] text-slate-500` displaying keyboard icon + `"CMD + ENTER"`.
- Execute Button (`#cta-execute`):
  - Style: `bg-[#0084ff] hover:bg-blue-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,132,255,0.5)] text-white p-3 rounded-sm`
  - Icon: Arrow right (20px × 20px).

### 5.2 Suggestion Chips
Pill buttons rendered horizontally below the query input:
- Classes: `px-4 py-2.5 bg-transparent border border-white/20 hover:border-[#0084ff] hover:bg-[#0084ff]/10 hover:scale-105 transition-all text-xs text-white font-semibold rounded-full`
- Presets:
  - `"What areas show recent deforestation?"`
  - `"Detect urban expansion in 2023-2024"`
  - `"SAR coherence analysis for stability"`
  - `"Compare vegetation indices T1 vs T2"`

### 5.3 Live Telemetry Footer
- Horizontal bar at bottom: `border-t border-slate-900 flex justify-between items-center text-[10px] mono text-slate-500 tracking-widest uppercase`
- Items:
  - `LAT: -23.5521` (live animated jitter)
  - `LON: 85.3402` (live animated jitter)
  - `SENSOR: IDLE / ACTIVE`
  - `STATUS: ORBITAL STREAM READY`

---

## 6. MAIN ANALYSIS WORKSPACE (70 / 30 SPLIT)

Located in `MainAnalysisWorkspace.tsx`:

### 6.1 Top Header Control Strip
- Container: `bg-[#0b0f19] border border-slate-800 p-3.5 rounded-xl shadow-md font-mono text-xs flex justify-between items-center`
- Left:
  - `+ ADD OBSERVATION` button (`bg-slate-950 hover:bg-slate-900 border border-slate-700 text-slate-300 rounded px-3 py-1.5`)
  - Title: Raster filename + Task Pill (`text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 uppercase`)
- Right:
  - Telemetry badges: `MODALITY: ... • GSD: ... • CRS: ...`
  - `GENERATE REPORT` button (`bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 py-1.5 rounded`)

### 6.2 70% Stage: Image Viewer (`MinimalViewer.tsx`)
- Outer Container: `lg:col-span-8 bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col`
- **Viewer Toolbar:**
  - `SPECTRAL: RGB / NIR` composite toggle (`bg-purple-950 border-purple-700 text-purple-300 font-bold` when active).
  - Mode Switchers (when bitemporal/SAR): `SIDE BY SIDE`, `SLIDER`, `OVERLAY` pills (`bg-slate-800 text-cyan-300`).
  - `EVIDENCE (N)` toggle button (`Eye` / `EyeOff`).
  - `Grid Lines` toggle (`Layers` icon).
  - Zoom Controller: `ZoomOut`, `[Zoom %]`, `ZoomIn`, `Maximize2` (reset zoom).
  - `Fullscreen` toggle.
- **Stage Canvas:**
  - Cursor: `cursor-crosshair`.
  - Grid overlay: 6 × 6 coordinate grid (`opacity-20 border border-slate-800 text-slate-600 text-[9px]`).
  - Primary Image: Transform matrix `scale(${zoom}) translate(${panX}px, ${panY}px)` with smooth GPU acceleration.
  - False-color filter: `contrast(1.2) saturate(1.45) hue-rotate(-28deg)`.
- **Bounding Box Evidence Overlays:**
  - Coordinates: Normalized percentage bounds `[xMin, yMin, xMax, yMax]`.
  - Box Border: `2px solid {color}` (`#0084ff`, `#00e5ff`, or `#0ea5e9`).
  - Fill: `{color}15` (normal), `{color}33` with `box-shadow: 0 0 16px {color}` (hovered/selected).
  - Identification Label: Positioned at `-top-5 left-0`, `px-1.5 py-0.2 text-[9px] font-mono font-bold text-slate-950 rounded`:
    `"EVIDENCE 0{N} | {LABEL} | CONF {score}"`.
- **Temporal Split Slider:**
  - Center drag bar: Vertical cyan divider with circular double-arrow handle.
  - Left clip: T1 raster; Right clip: T2 raster.
- **Click-to-Ask Marker:**
  - Crosshair circle showing normalized coordinates `(normX, normY)` with rapid action popup.
- **GeoJSON Export Button:**
  - Triggers download of `satquery_{filename}_evidence.geojson` with real geographic polygons.

### 6.3 30% Stage: AI Observation & Inspection Panel
Located in right column (`lg:col-span-4`):
- **Model Card Header:** Model name (`GeoVLM`, `RS-GroundingDINO`), provider, and latency.
- **Synthesized Observation Text:** Rich typography in `text-slate-100 font-sans leading-relaxed text-sm`.
- **Key Findings Checklist:** Numbered bullet findings with `CheckCircle2` emerald icons.
- **Confidence Rating Badge:** `bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono text-xs`.
- **Grounded Evidence List:** Interactive cards for each detected bounding box; clicking focuses the camera directly onto the target region (`handleFocusEvidence()`).

### 6.4 Collapsible Technical Trace Drawer (`AnalysisDetailsDrawer.tsx`)
Mounted beneath the analysis view:
- **Collapsible Trigger:** Full-width button `HOW THIS ANALYSIS WAS PERFORMED` (`bg-[#0b0f19] border border-slate-800 rounded-xl`).
- **Inside Drawer (3-Panel Grid):**
  1. `DATASET STATUS & VALIDATION`: Checks for format, readability, modality, spatial dimensions, and CRS.
  2. `AGENTIC EXECUTION TRACE`: 7 sequential observable pipeline stages (`INGESTING OBSERVATION`, `VALIDATING INPUT`, `INTERPRETING QUERY`, `SELECTING ANALYSIS`, `PROCESSING IMAGERY`, `EXTRACTING EVIDENCE`, `GENERATING OBSERVATION`).
  3. `RS MODEL / ADAPTATION`: Shows dataset lineage, sensor bands, encoder architecture (`Dual-Stream Swin-RS`), and alignment taxonomy.
- **Parameters Strip:** 5 metric blocks (`TASK`, `INPUT`, `SPECIALIST ENGINE`, `PARAMETERS`, `STATUS: COMPLETED`).

---

## 7. REPORT GENERATOR VIEW

Located in `ReportGeneratorView.tsx`:
- **Header:** `EARTH OBSERVATION INTELLIGENCE REPORT` with `PRINT REPORT (PDF)` button (`window.print()`).
- **Paper Document Card:** Max width `max-w-4xl mx-auto`, styled for screen dark mode (`bg-[#0b0f19] border border-slate-800 rounded-2xl p-12`) with full clean white-paper `@media print` CSS overrides (`print:bg-white print:text-black print:border-none`).
- **Official Header:** Satellite emblem, `ISRO SIH 26167 REMOTE SENSING`, Mission ID, Timestamp, Confidence.
- **Data Sections:**
  - Input raster specifications & CRS.
  - Synthesized scientific narrative (`textAnswer`).
  - Key findings bullet list (`keyFindings`).
  - Auditable execution trace log table.

---

## 8. ANIMATIONS & TRANSITIONS SPECIFICATION

All animations defined in `src/index.css` must remain pixel-exact:

| Animation Class | Keyframes / Duration | Visual Purpose |
| :--- | :--- | :--- |
| `.orbital-bg` | `grid-pulse 2s ease-in-out infinite alternate` | Background coordinate grid breathing |
| `.star-layer-1/2/3` | `star-drift 18s / 24s / 30s linear infinite` | Parallax cosmic star motion |
| `.star-twinkle` | `star-sparkle 3s ease-in-out infinite alternate` | Twinkling stars |
| `.planet-glow-sphere` | `planet-float 12s ease-in-out infinite alternate` | Ambient floating light orb |
| `.orbital-arcs` | `arc-rotate 30s linear infinite` | Concentric orbital rings rotation |
| `.scanline` | `scan-sweep 2.5s linear infinite` | High-tech CRT scanning sweep over upload cards |
| `.query-glow` | `glow-breathe 1.2s ease-in-out infinite alternate` | Query box neon pulse |
| `.shimmer-trigger:hover` | `box-glow-pulse 1.5s` + `shimmer-effect 0.15s` | Hover reflection on modality cards |
| `.status-dot-glow` | `status-pulse 0.8s ease-in-out infinite alternate` | Emerald radar ping on active status dots |
| `.stagger-in > *` | `fade-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)` | Staggered entrance for suggestion chips |

---

## 9. BACKEND CONTRACT REQUIREMENTS (STRICT UI COMPATIBILITY)

To prevent visual disruption when connecting real PyTorch and geospatial backends, all backend endpoints MUST return responses strictly matching the following TypeScript interface:

```typescript
export interface ExecutionResult {
  id: string;                                // Unique analysis execution ID
  query: string;                             // Prompt evaluated
  mode: 'single' | 'change' | 'optical-sar'; // Analysis modality
  detectedTask: string;                      // e.g. "Visual Question Answering", "Text-Guided Region Grounding"
  selectedModel: {
    id: string;
    name: string;
    provider: string;
    version: string;
    status: 'online' | 'offline' | 'busy';
  };
  configuredParameters: Record<string, any>;
  validationResult: {
    valid: boolean;
    format: string;
    crsFound: boolean;
    dimensions: string;
    notes: string;
  };
  textAnswer: string;                        // Real scientific synthesized narrative
  keyFindings: string[];                     // Bullet points for AI observation panel
  confidence: number | null;                 // Numerical score (e.g., 94.2)
  confidenceLevel: 'High' | 'Medium' | 'Low';
  spatialInterpretation?: string;
  groundingBoxes?: Array<{                   // Real predicted bounding boxes
    id: string;
    label: string;
    category: string;
    confidence: number;
    box: [number, number, number, number];   // [ymin%, xmin%, ymax%, xmax%] (0-100 scale)
    color?: string;
  }>;
  changeAreas?: Array<{
    id: string;
    label: string;
    box: [number, number, number, number];
    type: 'added' | 'removed' | 'modified';
    changeSeverity: 'minor' | 'moderate' | 'significant';
    areaSqMeters: number;
    description: string;
  }>;
  opticalSarInsight?: {
    opticalObservations: string;
    sarObservations: string;
    complementarySynthesis: string;
  };
  trace: Array<{
    id: string;
    stepNumber: number;
    name: string;
    description: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    latencyMs: number;
    timestamp: string;
  }>;
  geoMetadata: GeoMetadata;
  geoMetadataSecondary?: GeoMetadata;
  timestamp: string;
  executionTimeTotalMs: number;
  images: {
    primary: string;
    secondary?: string;
  };
}
```

---

## 10. CONCLUSION & LOCK DECLARATION

This UI specification is hereby permanently locked. All subsequent phases (Backend Modernization, GeoTIFF Parsing, PyTorch Model Serving, Grounding Inference, Change Detection, and Benchmark Evaluation) MUST integrate directly under this exact interface without modifying layout, colors, typography, or animations.