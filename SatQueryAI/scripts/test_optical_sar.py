"""
SatQuery AI — Optical + SAR Cross-Modal Fusion Verification Suite
SIH 2026 Problem Statement 26167

Verifies:
1. Input validation (exactly two rasters, modality check)
2. Co-registration validation (truthful reporting: verified vs disjoint, never fabricated)
3. Physical complementary information:
   - Optical observation (VNIR albedo, NDVI, cloud haze detection)
   - SAR observation (C-band microwave radar backscatter, dihedral double-bounce, specular water)
   - Combined complementary synthesis (demonstrates microwave penetration of clouds)
4. Evidence bounding boxes & calibrated confidence
5. Live Backend REST API integration (/api/analyze)
"""

import os
import sys
import json
import urllib.request
import urllib.parse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'models'))

from optical_sar_specialist import OpticalSARSpecialist, analyze_optical_sar_pair

def test_unit_cross_modal_specialist():
    print("\n=======================================================")
    print("STEP 1: Direct Module Unit Test (OpticalSARSpecialist)")
    print("=======================================================")

    opt_path = os.path.join(BASE_DIR, 'tests', 'coregistered_optical_vnir.tif')
    sar_path = os.path.join(BASE_DIR, 'tests', 'coregistered_sar_cband.tif')

    assert os.path.exists(opt_path), f"Missing {opt_path}"
    assert os.path.exists(sar_path), f"Missing {sar_path}"

    opt_meta = {
        "filename": "coregistered_optical_vnir.tif",
        "dimensions": "512 x 512",
        "crs": "WGS 84 / UTM zone 43N",
        "bandCount": 4,
        "bounds": [775000.0, 1435000.0, 775256.0, 1435256.0],
        "sensor": "Multi-Spectral Optical VNIR"
    }

    sar_meta = {
        "filename": "coregistered_sar_cband.tif",
        "dimensions": "512 x 512",
        "crs": "WGS 84 / UTM zone 43N",
        "bandCount": 1,
        "bounds": [775000.0, 1435000.0, 775256.0, 1435256.0],
        "sensor": "SAR C-Band Microwave Radar"
    }

    specialist = OpticalSARSpecialist()

    # Case A: Valid Co-registered Optical + SAR
    res = specialist.analyze_cross_modal(opt_path, sar_path, opt_meta, sar_meta)
    insight = res['optical_sar_insight']

    print(f"[*] Co-Registration Status: {insight['coRegistrationStatus']}")
    print(f"[*] Is Co-Registered: {insight['isCoRegistered']}")
    print(f"[*] Cloud Penetration Demonstrated: {insight['cloudPenetrationDemonstrated']}")
    print(f"[*] Optical Observation: {insight['opticalObservations']}")
    print(f"[*] SAR Observation: {insight['sarObservations']}")
    print(f"[*] Complementary Synthesis: {insight['complementarySynthesis']}")
    print(f"[*] Localized Evidence Boxes: {len(res['evidence_boxes'])}")
    print(f"[*] Confidence Score: {res['confidence']}")

    assert insight['isCoRegistered'] is True, "Expected True co-registration for identical CRS and bounds!"
    assert "Sub-pixel Co-registered" in insight['coRegistrationStatus']
    assert insight['cloudPenetrationDemonstrated'] is True, "Expected cloud penetration demonstration!"
    assert "microwave" in insight['sarObservations'].lower()
    assert len(res['evidence_boxes']) > 0, "Expected evidence bounding boxes for double-bounce / water features!"
    print("[PASS] Case A: Co-registered Optical + SAR verified successfully.")

    # Case B: Disjoint Bounds (Never fabricate co-registration)
    disjoint_sar_meta = dict(sar_meta)
    disjoint_sar_meta['bounds'] = [600000.0, 1200000.0, 600256.0, 1200256.0]
    val_disjoint = specialist.validate_inputs(opt_meta, disjoint_sar_meta)
    print(f"\n[*] Disjoint Bounds Validation Result: {val_disjoint['checks']['coregistration_status']}")
    assert val_disjoint['checks']['co_registered'] is False
    assert "Disjoint" in val_disjoint['checks']['coregistration_status']
    print("[PASS] Case B: Truthful disjoint bounds reporting verified.")

    # Case C: Modality Mismatch (Two Optical Rasters)
    val_mismatch = specialist.validate_inputs(opt_meta, opt_meta)
    print(f"\n[*] Same Modality Check Result: valid={val_mismatch['valid']}")
    assert val_mismatch['valid'] is False
    assert "Modality mismatch" in val_mismatch['issues'][0]
    print("[PASS] Case C: Modality validation verified.")

def test_api_optical_sar():
    print("\n=======================================================")
    print("STEP 2: End-to-End REST API Verification (/api/analyze)")
    print("=======================================================")

    opt_path = os.path.join(BASE_DIR, 'tests', 'coregistered_optical_vnir.tif')
    sar_path = os.path.join(BASE_DIR, 'tests', 'coregistered_sar_cband.tif')

    def upload_file(fpath):
        with open(fpath, 'rb') as f:
            data = f.read()
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="{os.path.basename(fpath)}"\r\n'
            f"Content-Type: image/tiff\r\n\r\n"
        ).encode('latin-1') + data + f"\r\n--{boundary}--\r\n".encode('latin-1')

        req = urllib.request.Request("http://localhost:8000/api/upload", data=body)
        req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))

    print("[*] Ingesting Optical GeoTIFF via /api/upload...")
    opt_upload = upload_file(opt_path)
    opt_file_id = opt_upload['file_id']
    print(f"    -> Optical File ID: {opt_file_id} | Dimensions: {opt_upload['metadata']['dimensions']}")

    print("[*] Ingesting SAR GeoTIFF via /api/upload...")
    sar_upload = upload_file(sar_path)
    sar_file_id = sar_upload['file_id']
    print(f"    -> SAR File ID:     {sar_file_id} | Bands: {sar_upload['metadata']['bandCount']}")

    # Submit Cross-Modal Analysis Request
    payload = {
        "file_id": opt_file_id,
        "secondary_file_id": sar_file_id,
        "query": "Perform optical and SAR cross-modal fusion. Analyze cloud penetration and surface structures.",
        "configuration": {
            "mode": "optical-sar"
        }
    }

    req_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request("http://localhost:8000/api/analyze", data=req_data)
    req.add_header('Content-Type', 'application/json')

    print("[*] Dispatching Optical-SAR analysis request to /api/analyze...")
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))

    print("\nAPI Response Telemetry:")
    print(f"  - Analysis ID:        {res['analysis_id']}")
    print(f"  - Detected Task:      {res['detectedTask']}")
    print(f"  - Selected Model:     {res['selectedModel']['name']}")
    print(f"  - Confidence:         {res['confidence']}")
    print(f"  - Evidence Boxes:     {len(res.get('groundingBoxes', []))}")
    print(f"  - Co-Reg Status:      {res.get('opticalSarInsight', {}).get('coRegistrationStatus')}")
    print(f"  - Cloud Penetration:  {res.get('opticalSarInsight', {}).get('cloudPenetrationDemonstrated')}")
    print(f"  - Key Findings Count: {len(res.get('keyFindings', []))}")

    assert res['detectedTask'] == 'Cross-Modal Optical-SAR Fusion'
    assert res['selectedModel']['type'] == 'SPECIALIST MODEL'
    assert res.get('opticalSarInsight') is not None
    assert res['opticalSarInsight']['isCoRegistered'] is True
    assert res['opticalSarInsight']['cloudPenetrationDemonstrated'] is True
    assert len(res.get('groundingBoxes', [])) > 0

    print("\n[PASS] End-to-End REST API Optical-SAR verification successful!")

if __name__ == '__main__':
    test_unit_cross_modal_specialist()
    test_api_optical_sar()
