# SATQUERY AI — INPUT COMPATIBILITY GUARDIAN SPECIFICATION
> **SIH 2026 Problem Statement 26167: Vision-Language Assistant for Orbital Remote Sensing**  
> **Status:** VERIFIED & FULLY OPERATIONAL  
> **Backend Integration:** `models/guardian.py` → `models/orchestrator.py` → `backend/server.py` (`/api/validate` & `/api/analyze`)  
> **UI Lock Compliance:** 100% strict adherence to `docs/UI_LOCK.md`

---

## 1. Purpose & Guarantees

In orbital and Earth Observation applications, executing deep vision-language or specialist models on incompatible imagery leads to hallucinated inferences, fabricated metrics, or catastrophic runtime failures.

The **Input Compatibility Guardian** serves as a pre-execution verification sentinel. Before any specialist model is configured or executed, the Guardian audits the inputs against **10 remote-sensing dimensions**.

### Core Guarantees:
1. **Zero Hallucinated Execution:** If an input violates spatial, spectral, temporal, or modality constraints, execution is halted immediately. Invalid inputs **never reach** the specialist model.
2. **Anti-Fabrication:** The Guardian never assumes or fabricates co-registration, spatial overlap, or CRS alignment.
3. **Structured Diagnostics:** Returns explicit reasons for rejection and warnings for sub-optimal inputs.
4. **Frozen UI Compliance:** Respects `UI_LOCK.md` by populating the standard `validationResult` object in the response payload.

---

## 2. The 10 Validation Dimensions

| Dimension | Description | Acceptance Criteria | Rejection Behavior |
| :--- | :--- | :--- | :--- |
| **1. Number of Images** | Input cardinality | Exact match per task (\(1\) for VQA/Captioning/Grounding; \(2\) for Temporal Change and Optical-SAR Fusion). | Rejects single images submitted to change/fusion workflows. |
| **2. File Format** | Raster container | GeoTIFF, TIFF, PNG, JPEG. | Rejects corrupted or unsupported file types. |
| **3. Modality** | Sensor physics | Optical/Multispectral (VNIR) vs SAR (C-Band Radar). | Flags mismatched modalities. |
| **4. Dimensions** | Spatial grid resolution | Valid positive height & width (\(H, W > 0\)). | Enforces geometric alignment for change differencing. |
| **5. Bands** | Spectral channels | \(\ge 1\) band for SAR; \(\ge 3\) bands for true-color/multispectral. | Warns if single-band optical raster cannot support NDVI. |
| **6. CRS** | Projection reference | Valid EPSG/WKT projection tag. | Rejects mismatched CRS projections (e.g. UTM Zone 43N vs 44N). |
| **7. Geographic Bounds** | Spatial extents | Real bounding box coordinates \([X_{\min}, Y_{\min}, X_{\max}, Y_{\max}]\). | Rejects missing coordinates when required for geospatial tasks. |
| **8. Spatial Compatibility**| Spatial overlap IoU | Calculates Jaccard bounding intersection. | **Blocks** disjoint extents (\(0\%\) spatial intersection). |
| **9. Temporal Baseline** | Acquisition timestamps | Valid TIFF DateTime (Tag 306). | **Blocks** identical timestamps for temporal change detection. |
| **10. Optical/SAR Match** | Cross-modal pairing | Exactly \(1\) Optical + \(1\) SAR raster for fusion tasks. | **Blocks** dual-optical or dual-SAR submissions for cross-modal fusion. |

---

## 3. Integration & Blocking Flow

```
User / API Request (/api/analyze)
          │
          ▼
[Input Compatibility Guardian]  ──(Audit 10 Dimensions)──
          │
    ┌─────┴────────────────────────────────┐
    ▼                                      ▼
[REJECTED: status = BLOCKED]       [APPROVED: status = READY]
    │                                      │
    ├─ Halts execution immediately         ├─ Passes inputs to Orchestrator
    ├─ Model ID: 'input-guardian-sentinel' ├─ Executes Selected Specialist
    ├─ Trace Step 2 marked as 'failure'    ├─ Generates Evidence & Synthesis
    └─ Returns structured rejection array  └─ Returns full 7-stage Trace
```

---

## 4. Verification Suite Results (`scripts/test_guardian.py`)

```
=======================================================================
SATQUERY AI — INPUT COMPATIBILITY GUARDIAN VERIFICATION
=======================================================================

[*] Ingesting authentic GeoTIFFs to backend...

--- TEST 1: APPROVED VALID INPUTS (Optical + SAR) ---
HTTP Status: 200 | Guardian Verdict: APPROVED
Notes: All 10 remote-sensing compatibility dimensions validated successfully.
[PASS] Test 1 passed: Valid Optical+SAR pair successfully approved.

--- TEST 2: REJECT NUMBER OF IMAGES (Single image for Change Analysis) ---
HTTP Status: 400 | Guardian Verdict: BLOCKED
Rejection: ["Dimension 1 (Number of Images): Task 'change' requires exactly 2 images. Received 1."]
[PASS] Test 2 passed: Single image rejected for 2-image task.

--- TEST 3: REJECT INCOMPATIBLE MODALITIES (Two SAR images to Optical-SAR) ---
HTTP Status: 400 | Guardian Verdict: BLOCKED
Rejection: ['Dimension 10 (Cross-Modal Incompatibility): Cross-modal fusion requires 1 Optical and 1 SAR raster. Received: Primary=SAR Microwave, Secondary=SAR Microwave.']
[PASS] Test 3 passed: Dual-SAR inputs rejected for Optical-SAR fusion.

--- TEST 4: REJECT DISJOINT GEOGRAPHIC EXTENTS ---
Guardian Verdict: BLOCKED
Rejection: ['Dimension 8 (Spatial Incompatibility): The two rasters have disjoint geographic bounds with 0% overlap. Spatial comparison impossible.', 'Dimension 10 (Cross-Modal Incompatibility): Cross-modal fusion requires 1 Optical and 1 SAR raster. Received: Primary=Optical/Multispectral, Secondary=Optical/Multispectral.']
[PASS] Test 4 passed: Disjoint geographic bounds rejected without fabrication.

--- TEST 5: REJECT INCOMPATIBLE CRS ---
Guardian Verdict: BLOCKED
Rejection: ["Dimension 6 (CRS Mismatch): Spatial projections do not match. Primary is 'WGS 84 / UTM zone 43N', Secondary is 'WGS 84 / UTM zone 44N'. Reprojection required before analysis.", 'Dimension 10 (Cross-Modal Incompatibility): Cross-modal fusion requires 1 Optical and 1 SAR raster. Received: Primary=Optical/Multispectral, Secondary=Optical/Multispectral.']
[PASS] Test 5 passed: CRS projection mismatch blocked.

--- TEST 6: REJECT SAME-TIMESTAMP CHANGE DETECTION ---
Guardian Verdict: BLOCKED
Rejection: ['Dimension 9 (Temporal Incompatibility): Both rasters possess identical acquisition timestamps (2024:05:10 10:00:00). Temporal change analysis requires different epochs.']
[PASS] Test 6 passed: Same-timestamp temporal change detected and rejected.

--- TEST 7: END-TO-END EXECUTION BLOCK IN /api/analyze ---
Status: BLOCKED
Model ID: input-guardian-sentinel
Answer: INPUT REJECTED BY COMPATIBILITY GUARDIAN:
Analysis could not proceed because the input violated 1 remote-sensing requirement(s):
- Dimension 1 (Number of Images): Task 'CHANGE_ANALYSIS' requires exactly 2 images. Received 1.
Trace Steps: ['UNDERSTANDING QUERY (success)', 'VALIDATING INPUT (failure)']
[PASS] Test 7 passed: Invalid input halted at Guardian stage without executing specialist model.

=======================================================================
ALL INPUT COMPATIBILITY GUARDIAN TESTS PASSED!
=======================================================================
```
