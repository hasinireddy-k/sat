"""
SatQuery AI — Input Compatibility Guardian Verification Suite
SIH 2026 Problem Statement 26167: Input Compatibility Guardian

Verifies strict pre-execution validation across 10 dimensions:
1. Number of images
2. File format
3. Modality
4. Dimensions
5. Bands
6. CRS
7. Geographic bounds
8. Spatial compatibility
9. Temporal compatibility
10. Optical/SAR compatibility

Asserts:
- Invalid input is blocked and NEVER reaches specialist models.
- Structured validation results are returned with exact rejection reasons.
- No fabricated compatibility.
- Works over live REST API endpoints (/api/validate and /api/analyze).
"""

import os
import sys
import json
import urllib.request
import urllib.parse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'models'))

from guardian import InputCompatibilityGuardian, validate_remote_sensing_inputs

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

def send_validate_request(primary_id, secondary_id=None, mode="single", query=""):
    payload = {
        "file_id": primary_id,
        "secondary_file_id": secondary_id,
        "mode": mode,
        "query": query
    }
    req_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request("http://localhost:8000/api/validate", data=req_data)
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as he:
        return he.code, json.loads(he.read().decode('utf-8'))

def send_analyze_request(primary_id, secondary_id=None, query="", config=None):
    payload = {
        "file_id": primary_id,
        "secondary_file_id": secondary_id,
        "query": query,
        "configuration": config or {}
    }
    req_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request("http://localhost:8000/api/analyze", data=req_data)
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def run_tests():
    print("=======================================================================")
    print("SATQUERY AI — INPUT COMPATIBILITY GUARDIAN VERIFICATION")
    print("=======================================================================\n")

    guardian = InputCompatibilityGuardian()

    opt_path = os.path.join(BASE_DIR, 'tests', 'coregistered_optical_vnir.tif')
    sar_path = os.path.join(BASE_DIR, 'tests', 'coregistered_sar_cband.tif')
    t1_path = os.path.join(BASE_DIR, 'tests', 'bitemporal_t1_cartosat.tif')
    t2_path = os.path.join(BASE_DIR, 'tests', 'bitemporal_t2_cartosat.tif')

    print("[*] Ingesting authentic GeoTIFFs to backend...")
    opt_up = upload_file(opt_path)
    sar_up = upload_file(sar_path)
    t1_up = upload_file(t1_path)
    t2_up = upload_file(t2_path)

    # -------------------------------------------------------------
    # TEST 1: APPROVED VALID INPUTS (10/10 Passed)
    # -------------------------------------------------------------
    print("\n--- TEST 1: APPROVED VALID INPUTS (Optical + SAR) ---")
    status_code, val_resp = send_validate_request(opt_up['file_id'], secondary_id=sar_up['file_id'], mode="optical-sar")
    print(f"HTTP Status: {status_code} | Guardian Verdict: {val_resp['status']}")
    print(f"Notes: {val_resp['message']}")
    assert status_code == 200
    assert val_resp['valid'] is True
    assert val_resp['status'] == "APPROVED"
    assert len(val_resp['rejections']) == 0
    print("[PASS] Test 1 passed: Valid Optical+SAR pair successfully approved.")

    # -------------------------------------------------------------
    # TEST 2: REJECT NUMBER OF IMAGES (Single image to 2-image task)
    # -------------------------------------------------------------
    print("\n--- TEST 2: REJECT NUMBER OF IMAGES (Single image for Change Analysis) ---")
    status_code, val_resp = send_validate_request(opt_up['file_id'], secondary_id=None, mode="change")
    print(f"HTTP Status: {status_code} | Guardian Verdict: {val_resp['status']}")
    print(f"Rejection: {val_resp['rejections']}")
    assert status_code == 400
    assert val_resp['valid'] is False
    assert val_resp['status'] == "BLOCKED"
    assert any("Number of Images" in r for r in val_resp['rejections'])
    print("[PASS] Test 2 passed: Single image rejected for 2-image task.")

    # -------------------------------------------------------------
    # TEST 3: REJECT INCOMPATIBLE MODALITIES (Dual SAR for Optical-SAR Fusion)
    # -------------------------------------------------------------
    print("\n--- TEST 3: REJECT INCOMPATIBLE MODALITIES (Two SAR images to Optical-SAR) ---")
    status_code, val_resp = send_validate_request(sar_up['file_id'], secondary_id=sar_up['file_id'], mode="optical-sar")
    print(f"HTTP Status: {status_code} | Guardian Verdict: {val_resp['status']}")
    print(f"Rejection: {val_resp['rejections']}")
    assert status_code == 400
    assert val_resp['valid'] is False
    assert val_resp['status'] == "BLOCKED"
    assert any("Cross-Modal" in r or "Modality" in r for r in val_resp['rejections'])
    print("[PASS] Test 3 passed: Dual-SAR inputs rejected for Optical-SAR fusion.")

    # -------------------------------------------------------------
    # TEST 4: REJECT DISJOINT GEOGRAPHIC EXTENTS (0% Spatial Overlap)
    # -------------------------------------------------------------
    print("\n--- TEST 4: REJECT DISJOINT GEOGRAPHIC EXTENTS ---")
    mock_primary = {
        "filepath": opt_path,
        "metadata": {
            "format": "GeoTIFF",
            "dimensions": "512 x 512",
            "crs": "WGS 84 / UTM zone 43N",
            "bandCount": 4,
            "bounds": [775000.0, 1435000.0, 775256.0, 1435256.0]
        }
    }
    mock_disjoint_secondary = {
        "filepath": sar_path,
        "metadata": {
            "format": "GeoTIFF",
            "dimensions": "512 x 512",
            "crs": "WGS 84 / UTM zone 43N",
            "bandCount": 1,
            "bounds": [600000.0, 1200000.0, 600256.0, 1200256.0]
        }
    }
    g_res = guardian.validate_inputs("OPTICAL_SAR_FUSION", mock_primary, mock_disjoint_secondary)
    print(f"Guardian Verdict: {g_res['status']}")
    print(f"Rejection: {g_res['rejection_reasons']}")
    assert g_res['allowed'] is False
    assert g_res['status'] == "BLOCKED"
    assert any("Disjoint" in r or "Spatial Incompatibility" in r for r in g_res['rejection_reasons'])
    print("[PASS] Test 4 passed: Disjoint geographic bounds rejected without fabrication.")

    # -------------------------------------------------------------
    # TEST 5: REJECT INCOMPATIBLE CRS (Spatial Projection Mismatch)
    # -------------------------------------------------------------
    print("\n--- TEST 5: REJECT INCOMPATIBLE CRS ---")
    mock_crs_mismatch_secondary = {
        "filepath": sar_path,
        "metadata": {
            "format": "GeoTIFF",
            "dimensions": "512 x 512",
            "crs": "WGS 84 / UTM zone 44N", # Mismatch!
            "bandCount": 1,
            "bounds": [775000.0, 1435000.0, 775256.0, 1435256.0]
        }
    }
    g_crs_res = guardian.validate_inputs("OPTICAL_SAR_FUSION", mock_primary, mock_crs_mismatch_secondary)
    print(f"Guardian Verdict: {g_crs_res['status']}")
    print(f"Rejection: {g_crs_res['rejection_reasons']}")
    assert g_crs_res['allowed'] is False
    assert any("CRS Mismatch" in r for r in g_crs_res['rejection_reasons'])
    print("[PASS] Test 5 passed: CRS projection mismatch blocked.")

    # -------------------------------------------------------------
    # TEST 6: REJECT SAME-TIMESTAMP CHANGE DETECTION
    # -------------------------------------------------------------
    print("\n--- TEST 6: REJECT SAME-TIMESTAMP CHANGE DETECTION ---")
    mock_same_date_t1 = {
        "filepath": t1_path,
        "metadata": {
            "format": "GeoTIFF",
            "dimensions": "512 x 512",
            "crs": "WGS 84 / UTM zone 43N",
            "bandCount": 4,
            "acquisitionDate": "2024:05:10 10:00:00"
        }
    }
    mock_same_date_t2 = {
        "filepath": t2_path,
        "metadata": {
            "format": "GeoTIFF",
            "dimensions": "512 x 512",
            "crs": "WGS 84 / UTM zone 43N",
            "bandCount": 4,
            "acquisitionDate": "2024:05:10 10:00:00" # Same date!
        }
    }
    g_time_res = guardian.validate_inputs("CHANGE_ANALYSIS", mock_same_date_t1, mock_same_date_t2)
    print(f"Guardian Verdict: {g_time_res['status']}")
    print(f"Rejection: {g_time_res['rejection_reasons']}")
    assert g_time_res['allowed'] is False
    assert any("Temporal Incompatibility" in r for r in g_time_res['rejection_reasons'])
    print("[PASS] Test 6 passed: Same-timestamp temporal change detected and rejected.")

    # -------------------------------------------------------------
    # TEST 7: END-TO-END EXECUTION BLOCK IN /api/analyze
    # Asserts invalid input NEVER reaches specialist models!
    # -------------------------------------------------------------
    print("\n--- TEST 7: END-TO-END EXECUTION BLOCK IN /api/analyze ---")
    # Submitting single image with forced mode 'change' to /api/analyze
    blocked_analyze = send_analyze_request(opt_up['file_id'], secondary_id=None, query="Compare changes", config={"forcedMode": "change"})
    print(f"Status: {blocked_analyze.get('status')}")
    print(f"Model ID: {blocked_analyze['selectedModel']['id']}")
    print(f"Answer: {blocked_analyze['textAnswer'][:120]}...")
    print(f"Trace Steps: {[s['name'] + ' (' + s['status'] + ')' for s in blocked_analyze['trace']]}")

    assert blocked_analyze.get('status') == 'BLOCKED'
    assert blocked_analyze['validationResult']['valid'] is False
    assert blocked_analyze['selectedModel']['id'] == 'input-guardian-sentinel'
    assert blocked_analyze['trace'][1]['status'] == 'failure'
    assert len(blocked_analyze['groundingBoxes']) == 0
    assert len(blocked_analyze['changeAreas']) == 0
    print("[PASS] Test 7 passed: Invalid input halted at Guardian stage without executing specialist model.")

    print("\n=======================================================================")
    print("ALL INPUT COMPATIBILITY GUARDIAN TESTS PASSED!")
    print("=======================================================================")

if __name__ == '__main__':
    run_tests()
