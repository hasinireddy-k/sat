# SATQUERY AI — OPTICAL + SAR CROSS-MODAL FUSION SPECIFICATION
> **SIH 2026 Problem Statement 26167: Vision-Language Assistant for Orbital Remote Sensing**  
> **Status:** VERIFIED & OPERATIONAL  
> **Backend Integration:** `models/optical_sar_specialist.py` → `backend/server.py` (`/api/analyze`)  
> **UI Lock Compliance:** 100% strict adherence to `docs/UI_LOCK.md`

---

## 1. Executive Summary & Physics Foundation

Generic multimodal LLMs (e.g. standard chatbots) fail at Earth Observation because they cannot comprehend the distinct wave physics of **Multi-Spectral Optical (VNIR)** versus **Synthetic Aperture Radar (SAR C-Band)** sensors. Feeding both rasters into a generic chatbot and prompting it to hallucinate text does not constitute sensor fusion.

SatQuery AI introduces a dedicated **Optical + SAR Cross-Modal Fusion Specialist** based on genuine physical wave properties:

1. **Multi-Spectral Optical (Passive VNIR Albedo):**
   - Measures solar irradiance reflected from the top-of-canopy and surface materials.
   - Computes **NDVI** (Normalized Difference Vegetation Index: \(\frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}\)) to assess chlorophyll vitality and vegetative biomass.
   - Vulnerable to atmospheric interference: clouds, cirrus, aerosol haze, and cloud shadows obscure surface targets completely.

2. **SAR Microwave Radar (Active C-Band Backscatter):**
   - Emits active electromagnetic waves at \(5.405\text{ GHz}\) (\(\lambda \approx 5.55\text{ cm}\)).
   - **All-weather / day-and-night penetration:** Penetrates cloud banks, smoke, and haze unhindered.
   - **Dihedral Double-Bounce:** Sharp corner reflections between vertical building walls and ground tarmac create localized high-intensity backscatter spikes (\(> +2.5\sigma\)), pinpointing urban structures even under thick cloud cover.
   - **Specular Reflection:** Smooth open water bodies reflect radar pulses away from the antenna, producing distinct dark returns (\(< -20\text{ dB}\) or near-zero DN), distinguishing real water from dark optical cloud shadows.

---

## 2. Input Validation & Strict Anti-Fabrication Guarantees

Before fusion occurs, the specialist enforces rigorous validation checks:

| Validation Step | Requirement | Implementation Behavior |
| :--- | :--- | :--- |
| **Number of Inputs** | Exactly 2 rasters | Rejects single-image or 3+ image payloads with explicit errors. |
| **Modality Compatibility** | One Optical + One SAR | Inspects TIFF metadata and band counts. If two optical or two SAR rasters are provided, reports `"Modality mismatch"` and does not pretend to fuse. |
| **Dimensions & Grid** | Spatial Resolution & Grid | Validates pixel dimensions; resamples SAR grid to optical raster via bilinear interpolation if grid scales differ. |
| **CRS Verification** | Coordinate Reference System | Extracts EPSG/WKT projection tag. If CRS does not exist, explicitly reports `"Not available"`. |
| **Co-Registration State** | Spatial Bounding Overlap | Evaluates Jaccard IoU between geographic extents. If bounds do not overlap, outputs `"Disjoint Extents (No geographic intersection in CRS)"`. **NEVER fabricates co-registration.** |

---

## 3. Specialist Output Schema (`UI_LOCK.md` Compliance)

The specialist returns structured telemetry seamlessly consumed by `MainAnalysisWorkspace.tsx` and `MinimalViewer.tsx`:

```json
{
  "opticalSarInsight": {
    "opticalObservations": "Multi-spectral VNIR analysis (4 channels) indicates mean canopy NDVI of 0.356...",
    "sarObservations": "SAR C-Band radar backscatter operates at active microwave frequency (penetrating cloud cover). Dynamic intensity spans [0.2, 645.0] DN...",
    "complementarySynthesis": "SAR microwaves (5.4 GHz) successfully penetrated the 7.48% cloud/haze bank obscuring the optical frame, resolving underlying structural boundaries...",
    "coRegistrationStatus": "Sub-pixel Co-registered (Identical CRS, Bounds & Grid)",
    "isCoRegistered": true,
    "cloudPenetrationDemonstrated": true
  },
  "groundingBoxes": [
    {
      "id": "ev-01",
      "label": "Built Infrastructure (Double-Bounce)",
      "confidence": 0.94,
      "box": [0.6289, 0.1211, 0.9023, 0.3945],
      "modality_cross_evidence": "SAR Double-Bounce + Optical Verification",
      "description": "SAR dihedral corner reflection confirms vertical building walls through optical haze."
    },
    {
      "id": "ev-02",
      "label": "Quiescent Water Body",
      "confidence": 0.97,
      "box": [0.0977, 0.5859, 0.3516, 0.8789],
      "modality_cross_evidence": "Specular Microwave Absence + Low Optical NIR",
      "description": "Smooth specular water surface reflects microwave radar pulses away from sensor."
    }
  ],
  "confidence": 0.93,
  "confidenceLevel": "High"
}
```

---

## 4. Verification & Audit Results

Automated test executed via `scripts/test_optical_sar.py`:

```
=======================================================
STEP 1: Direct Module Unit Test (OpticalSARSpecialist)
=======================================================
[*] Co-Registration Status: Sub-pixel Co-registered (Identical CRS, Bounds & Grid)
[*] Is Co-Registered: True
[*] Cloud Penetration Demonstrated: True
[*] Optical Observation: Multi-spectral VNIR analysis (4 channels) indicates mean canopy NDVI of 0.356. Vegetated zones demonstrate strong near-infrared plateau reflectance (mean DN: 141.7). Substantial atmospheric attenuation / cloud haze detected affecting 7.48% of the optical aperture.
[*] SAR Observation: SAR C-Band radar backscatter operates at active microwave frequency (penetrating cloud cover). Dynamic intensity spans [0.2, 645.0] DN (mean: 42.8, sigma: 34.6). Identified 8.42% specular dark returns (quiescent water bodies / smooth flat surfaces) and 2628 discrete high-intensity double-bounce returns corresponding to vertical metallic/masonry facades.
[*] Complementary Synthesis: SAR microwaves (5.4 GHz) successfully penetrated the 7.48% cloud/haze bank obscuring the optical frame, resolving underlying structural boundaries and ground geometry that were unidentifiable in VNIR. Water bodies delineated by specular radar reflection (8.42%) corroborate low optical NIR absorption zones, eliminating false-positive shadows in optical imagery. Dihedral radar wall-ground corner reflections (2628 spikes) pinpoint built structures regardless of optical shadow or illumination azimuth.
[*] Localized Evidence Boxes: 7
[*] Confidence Score: 0.93
[PASS] Case A: Co-registered Optical + SAR verified successfully.

[*] Disjoint Bounds Validation Result: Disjoint Extents (No geographic intersection in CRS)
[PASS] Case B: Truthful disjoint bounds reporting verified.

[*] Same Modality Check Result: valid=False
[PASS] Case C: Modality validation verified.

=======================================================
STEP 2: End-to-End REST API Verification (/api/analyze)
=======================================================
[*] Ingesting Optical GeoTIFF via /api/upload...
    -> Optical File ID: file_1788868041_5bddb9fd | Dimensions: 512 x 512 px
[*] Ingesting SAR GeoTIFF via /api/upload...
    -> SAR File ID:     file_1788868044_61674e97 | Bands: 1
[*] Dispatching Optical-SAR analysis request to /api/analyze...

API Response Telemetry:
  - Analysis ID:        analysis_1788868046_1c893103
  - Detected Task:      Cross-Modal Optical-SAR Fusion
  - Selected Model:     Optical + SAR Cross-Modal Fusion Specialist [SPECIALIST MODEL]
  - Confidence:         0.93
  - Evidence Boxes:     7
  - Co-Reg Status:      Sub-pixel Co-registered (Identical CRS, Bounds & Grid)
  - Cloud Penetration:  True
  - Key Findings Count: 5

[PASS] End-to-End REST API Optical-SAR verification successful!
```
