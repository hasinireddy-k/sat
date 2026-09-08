"""
SatQuery AI — Bi-Temporal Change Analysis API Verification
"""

import requests
import json
import time

base_url = 'http://localhost:8000'

t1_path = 'c:/Users/hasin/OneDrive/Desktop/sat1/SatQueryAI/tests/bitemporal_t1_cartosat.tif'
t2_path = 'c:/Users/hasin/OneDrive/Desktop/sat1/SatQueryAI/tests/bitemporal_t2_cartosat.tif'

# 1. Upload T1
with open(t1_path, 'rb') as f:
    up1 = requests.post(f'{base_url}/api/upload', data=f.read(), headers={'X-File-Name': 'bitemporal_t1_cartosat.tif'}).json()
t1_id = up1['fileId']
print(f"[1. UPLOADED T1]: {t1_id} | Date: {up1['metadata']['acquisitionDate']}")

# 2. Upload T2
with open(t2_path, 'rb') as f:
    up2 = requests.post(f'{base_url}/api/upload', data=f.read(), headers={'X-File-Name': 'bitemporal_t2_cartosat.tif'}).json()
t2_id = up2['fileId']
print(f"[2. UPLOADED T2]: {t2_id} | Date: {up2['metadata']['acquisitionDate']}")

# 3. Analyze Bi-Temporal Change
an_req = {
    'file_id': t1_id,
    'secondary_file_id': t2_id,
    'analysis_id': 'bitemporal_change_analysis_01',
    'query': 'Perform bi-temporal change analysis and detect new structures.',
    'mode': 'change',
    'configuration': {'model_type': 'DOMAIN-ADAPTED', 'mode': 'change'}
}

an_resp = requests.post(f'{base_url}/api/analyze', json=an_req).json()

print("=" * 70)
print("SATQUERY AI — BI-TEMPORAL CHANGE ANALYSIS API RESULTS")
print("=" * 70)

print(f"Mode: {an_resp.get('mode')}")
print(f"Detected Task: {an_resp.get('detectedTask')}")
print(f"Text Answer:\n  {an_resp.get('textAnswer')}")

print("\nKey Findings:")
for kf in an_resp.get('keyFindings', []):
    print(f"  * {kf}")

change_areas = an_resp.get('changeAreas', [])
print(f"\nChange Areas Count: {len(change_areas)}")
for ca in change_areas:
    print(f"  - ID: {ca['id']} | Type: {ca['type']} | Severity: {ca['changeSeverity']}")
    print(f"    Bounding Box: {ca['box']}")
    print(f"    Ground Area: {ca['areaSqMeters']} m^2 ({ca.get('pixelCount')} px)")
    print(f"    Description: {ca['description']}")

images = an_resp.get('images', {})
print(f"\nImages:")
print(f"  Primary (T1):   {images.get('primary')}")
print(f"  Secondary (T2): {images.get('secondary')}")
print(f"  Diff Heatmap:   {images.get('diff')}")

# Verify diff visualization image is accessible
diff_url = images.get('diff')
if diff_url:
    diff_get = requests.get(diff_url)
    print(f"Diff Image HTTP Status: {diff_get.status_code} | Bytes: {len(diff_get.content)}")
    assert diff_get.status_code == 200, "Diff image preview must return 200 OK"

# Assertions
assert an_resp.get('mode') == 'change', "Mode must be 'change'"
assert an_resp.get('detectedTask') == 'Temporal Change Analysis', "Task must be 'Temporal Change Analysis'"
assert len(change_areas) >= 1, "Must return at least 1 change region"
assert change_areas[0]['type'] in ['added', 'removed', 'modified']
assert "2024:01:15" in an_resp.get('textAnswer'), "Actual TIFF tag date must be in answer"

print("\n" + "=" * 70)
print("PASS: Bi-temporal change analysis successfully verified end-to-end!")
print("=" * 70)
