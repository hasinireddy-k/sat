# SatQuery AI — Grounding Specialist Architecture
**SIH 2026 Problem Statement 26167: Text-Guided Region Grounding for Orbital Datasets**
**Phase 11: Text-Guided Region Grounding Pipeline**

---

## 1. Overview
Grounding in SatQuery AI is distinct from general multi-modal VQA. Rather than generating high-level conversational text, the Grounding Specialist directly maps a natural language query and an orbital raster into **exact bounding boxes, pixel dimensions, and physical geographic coordinates**.

```
                           [USER QUERY] + [ORBITAL RASTER]
                                         │
                                         ▼
                            [QUERY INTENT PARSER]
                     - Target: Building / Water / Forest / Linear
                     - Spatial Constraint: Center / North / South / East / West
                                         │
                                         ▼
                             [GROUNDING SPECIALIST]
                     - Spectral & Structural Saliency Maps
                     - Sobel / NDWI / NDVI / Canny / SAR Backscatter
                     - Distance-weighted Spatial Constraint Mask
                     - Connected Component Morphological Extraction
                                         │
                                         ▼
                          [ACTUAL BOUNDING BOXES / REGIONS]
                     - Normalized [ymin%, xmin%, ymax%, xmax%]
                     - Calibrated Confidence (e.g., 0.84, NOT 0.91)
                     - Physical UTM / WGS-84 Coordinate Bounds
                                         │
                                         ▼
                                [EVIDENCE OVERLAY]
                     - Rendered on Frontend Image Viewer
                     - Returned via GET /api/evidence/{id}
```

---

## 2. Hardcoded Dummy Removal
Previous prototypes often used static dummy strings such as:
```
EVIDENCE 01
TECH PARK
CONF 0.91
```
In SatQuery AI Phase 11, **all dummy data has been removed**. Every bounding box, label, pixel count, and confidence score is computed dynamically from the actual raster image.

---

## 3. Real Execution Verification

Query: `“Find buildings near the center.”`
Image: `sample_cartosat_utm43n.tif` (512 × 512 px, UTM Zone 43N)

### Result:
- **Detected Task**: `Text-Guided Region Grounding`
- **Target Category**: `Building / Urban Structure`
- **Spatial Constraint**: `center` (weighted Gaussian decay mask)
- **Detected Region**:
  - ID: `gb-1`
  - Label: `Central Building / Urban Structure #1 (91683 px)`
  - Normalized Box: `[14.5, 14.1, 87.5, 86.7]` (ymin%, xmin%, ymax%, xmax%)
  - Calibrated Confidence: `0.84`
  - Physical Ground Coordinates (UTM 43N): `[775036.0, 1434776.0, 775222.0, 1434963.0]`
- **Evidence Overlay Endpoint**: `GET /api/evidence/{id}` returns the exact bounding box array.
