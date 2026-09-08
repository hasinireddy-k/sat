# SATQUERY AI — AGENTIC ORCHESTRATION SPECIFICATION (PHASE 9)
> **SIH 2026 Problem Statement 26167: Vision-Language Assistant for Orbital Remote Sensing**  
> **Status:** VERIFIED & FULLY OPERATIONAL  
> **Backend Integration:** `models/orchestrator.py` → `backend/server.py` (`/api/analyze`)  
> **UI Lock Compliance:** 100% strict adherence to `docs/UI_LOCK.md`

---

## 1. Executive Summary

Phase 9 establishes a **deterministic Agent / Controller** that eliminates random guessing or passing inputs to generic conversational chatbots. The controller inspects incoming metadata, modalities, temporal baselines, and query intent, and autonomously selects the appropriate specialist from a defined registry.

Every specialist actually executes with real algorithmic calculations. The agent produces an **auditable, observable execution trace** across 7 sequential stages without exposing internal chain-of-thought or fabricating false progress.

---

## 2. Multi-Dimensional Input Inspection Matrix

The Agentic Controller deterministically evaluates 7 distinct dimensions:

```
                  ┌────────────────────────────────────────────────────────┐
                  │              INCOMING ANALYSIS REQUEST                 │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
             ┌───────────────────────────────┴──────────────────────────────┐
             ▼                                                              ▼
    [Image Metadata & Modality]                                     [Query Intent]
    • Number of Images (1 vs 2)                                     • Grounding triggers
    • Sensor Types (Optical VNIR vs SAR C-Band)                     • Captioning triggers
    • Format (GeoTIFF / TIFF)                                       • Temporal change triggers
    • Spatial Reference & CRS (WGS 84 / UTM 43N)                    • Cross-modal triggers
    • Dimensions & Grid Resolution                                  • Spectral VQA triggers
    • Temporal timestamps (Acquisition DateTime)                    
             │                                                              │
             └───────────────────────────────┬──────────────────────────────┘
                                             │
                                             ▼
                             [DETERMINISTIC AGENT CONTROLLER]
                                             │
      ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
      ▼                  ▼                   ▼                   ▼                  ▼
    [VQA]          [CAPTIONING]         [GROUNDING]      [CHANGE_ANALYSIS]   [OPT_SAR_FUSION]
```

### Deterministic Routing Rules

1. **`OPTICAL_SAR_FUSION`**:
   - Condition: \(2\text{ images}\) present AND sensor modalities are complementary (One Optical/VNIR + One SAR Radar) OR query explicitly targets Optical-SAR cross-modal fusion.
   - Specialist: `Optical + SAR Cross-Modal Fusion Specialist` (`models/optical_sar_specialist.py`).
2. **`CHANGE_ANALYSIS`**:
   - Condition: \(2\text{ images}\) present AND both are same modality (T1 & T2) OR query specifies temporal comparison/flood damage differencing.
   - Specialist: `Bi-Temporal Change Analysis Specialist` (`models/change_detection.py`).
3. **`GROUNDING`**:
   - Condition: \(1\text{ image}\) present AND query specifies spatial target localization (`"find"`, `"locate"`, `"where"`, `"detect"`, `"building"`, `"center"`).
   - Specialist: `Text-Guided Region Grounding Specialist` (`models/grounding.py`).
4. **`CAPTIONING`**:
   - Condition: \(1\text{ image}\) present AND query requests holistic scene description (`"describe"`, `"caption"`, `"overview"`, or empty prompt).
   - Specialist: `Remote Sensing Scene Captioning Specialist` (`models/captioning.py`).
5. **`VQA`**:
   - Condition: \(1\text{ image}\) present AND query poses specific land-cover or radiometric classification question.
   - Specialist: `Visual Question Answering Specialist` (`scripts/inference.py` via BigEarthNet-19 LoRA).

---

## 3. Specialist Registry Specification

| Specialist Key | Specialist Name | Model Tier | Provider / Checkpoint | Primary Capability |
| :--- | :--- | :--- | :--- | :--- |
| **`VQA`** | Visual Question Answering Specialist | `DOMAIN-ADAPTED MODEL` | Qwen-VL-2B + BigEarthNet-19 LoRA | Multi-spectral classification, radiometric VQA |
| **`CAPTIONING`** | Remote Sensing Scene Captioning Specialist | `DOMAIN-ADAPTED MODEL` | SatQuery Captioner (BigEarthNet-19) | Holistic scene narration, land-use summary |
| **`GROUNDING`** | Text-Guided Region Grounding Specialist | `SPECIALIST MODEL` | SatQuery Grounding Engine | Spatial contours, geographic coordinates |
| **`CHANGE_ANALYSIS`** | Bi-Temporal Change Analysis Specialist | `SPECIALIST MODEL` | SatQuery Matrix Differencing Engine | Pixel difference matrix, change polygon localization |
| **`OPTICAL_SAR_FUSION`**| Optical + SAR Cross-Modal Fusion Specialist | `SPECIALIST MODEL` | SatQuery VNIR-Microwave Physics Engine| Microwave cloud penetration, double-bounce facades |

---

## 4. Observable 7-Stage Execution Trace

Conforming to `docs/UI_LOCK.md` (`Section 6.4`), the agent emits a clean, non-fabricated observable trace without hidden chain-of-thought:

```json
[
  {
    "id": "trace-stage-1",
    "stepNumber": 1,
    "name": "UNDERSTANDING QUERY",
    "description": "Query: \"Find buildings near the center.\" -> Task Classified as Text-Guided Region Grounding. Reason: Query requests localized spatial boundaries and coordinates for visual targets.",
    "status": "success",
    "latencyMs": 18
  },
  {
    "id": "trace-stage-2",
    "stepNumber": 2,
    "name": "VALIDATING INPUT",
    "description": "1 image(s) ingested. Format: GeoTIFF | Primary: Optical VNIR (4 bands) (512 x 512 px), CRS: WGS 84 / UTM zone 43N.",
    "status": "success",
    "latencyMs": 22
  },
  {
    "id": "trace-stage-3",
    "stepNumber": 3,
    "name": "SELECTING SPECIALIST",
    "description": "Selected Specialist: Text-Guided Region Grounding Specialist [SPECIALIST MODEL]. Provider: SatQuery Remote Sensing Grounding Engine.",
    "status": "success",
    "latencyMs": 14
  },
  {
    "id": "trace-stage-4",
    "stepNumber": 4,
    "name": "CONFIGURING",
    "description": "Configured parameters: temperature=0.1, topP=0.9. Modality constraints verified.",
    "status": "success",
    "latencyMs": 12
  },
  {
    "id": "trace-stage-5",
    "stepNumber": 5,
    "name": "EXECUTING",
    "description": "Status: completed. Latency: 67ms. Grounding contour search completed. Localized 1 target bounding regions.",
    "status": "success",
    "latencyMs": 67
  },
  {
    "id": "trace-stage-6",
    "stepNumber": 6,
    "name": "EXTRACTING EVIDENCE",
    "description": "Extracted 1 calibrated bounding box coordinates with spatial cross-evidence.",
    "status": "success",
    "latencyMs": 28
  },
  {
    "id": "trace-stage-7",
    "stepNumber": 7,
    "name": "GENERATING ANSWER",
    "description": "Completed. Synthesized answer narrative (44 words) with 4 verified findings.",
    "status": "success",
    "latencyMs": 16
  }
]
```

---

## 5. Verification Results (`scripts/test_orchestrator.py`)

All 5 specialists were executed and verified end-to-end through the backend REST API:

```
=======================================================================
SATQUERY AI — PHASE 9: AGENTIC ORCHESTRATION VERIFICATION
=======================================================================

[*] Ingesting test rasters into SatQuery backend...

--- TEST 1: GROUNDING SPECIALIST SELECTION ---
Query: "Find buildings near the center."
Selected Specialist: GROUNDING (Text-Guided Region Grounding Specialist)
Detected Task:       Text-Guided Region Grounding
Grounding Boxes:     1
Trace Steps Observable:
  [1] UNDERSTANDING QUERY -> Query: "Find buildings near the center." -> Task Classified as Text-Guided Region Grounding. Reason: Query requests localized spatial boundaries and coordinates for visual targets.
  [2] VALIDATING INPUT -> 1 image(s) ingested. Format: GeoTIFF | Primary: Optical VNIR (4 bands) (512 x 512 px), CRS: WGS 84 / UTM zone 43N.
  [3] SELECTING SPECIALIST -> Selected Specialist: Text-Guided Region Grounding Specialist [SPECIALIST MODEL]. Provider: SatQuery Remote Sensing Grounding Engine.
  [4] CONFIGURING -> Configured parameters: temperature=0.1, topP=0.9. Modality constraints verified.
  [5] EXECUTING -> Status: completed. Latency: 67ms. Grounding contour search completed. Localized 1 target bounding regions.
  [6] EXTRACTING EVIDENCE -> Extracted 1 calibrated bounding box coordinates with spatial cross-evidence.
  [7] GENERATING ANSWER -> Completed. Synthesized answer narrative (44 words) with 4 verified findings.
[PASS] Test 1 passed.

--- TEST 2: CAPTIONING SPECIALIST SELECTION ---
Query: "Describe this satellite scene."
Selected Specialist: CAPTIONING (Remote Sensing Scene Captioning Specialist)
Detected Task:       Single Image Captioning
[PASS] Test 2 passed.

--- TEST 3: CHANGE ANALYSIS SPECIALIST SELECTION ---
Query: "Analyze flood damage and land changes between T1 and T2."
Selected Specialist: CHANGE_ANALYSIS (Bi-Temporal Change Analysis Specialist)
Detected Task:       Temporal Change Analysis
Change Areas:        1
Diff Map URL:        http://localhost:8000/uploads/analysis_1788868270_91ad7522_diff.png
[PASS] Test 3 passed.

--- TEST 4: OPTICAL + SAR FUSION SPECIALIST SELECTION ---
Query: "Perform optical and SAR cross-modal fusion. Check microwave cloud penetration."
Selected Specialist: OPTICAL_SAR_FUSION (Optical + SAR Cross-Modal Fusion Specialist)
Detected Task:       Cross-Modal Optical-SAR Fusion
Co-Reg Status:       Sub-pixel Co-registered (Identical CRS, Bounds & Grid)
Cloud Penetrated:    True
[PASS] Test 4 passed.

--- TEST 5: VQA SPECIALIST SELECTION ---
Query: "What is the dominant land cover class and spectral reflectance characteristics?"
Selected Specialist: VQA (Visual Question Answering Specialist)
Detected Task:       Visual Question Answering
[PASS] Test 5 passed.

=======================================================================
ALL 5 SPECIALIST ORCHESTRATION TESTS PASSED WITH OBSERVABLE TRACES!
=======================================================================
```
