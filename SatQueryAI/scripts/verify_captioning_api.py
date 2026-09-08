"""
SatQuery AI — Verify Single Image Captioning API with Multiple Satellites
"""

import requests
import json

base_url = 'http://localhost:8000'

# 1. Upload & Analyze Cartosat Optical
with open('c:/Users/hasin/OneDrive/Desktop/sat1/SatQueryAI/tests/sample_cartosat_utm43n.tif', 'rb') as f:
    up1 = requests.post(f'{base_url}/api/upload', data=f.read(), headers={'X-File-Name': 'sample_cartosat_utm43n.tif'}).json()
file1_id = up1['fileId']

an1 = requests.post(f'{base_url}/api/analyze', json={
    'file_id': file1_id,
    'analysis_id': 'cap_test_cartosat_01',
    'query': 'Describe this satellite scene in detail.',
    'configuration': {'model_type': 'DOMAIN-ADAPTED'}
}).json()

# 2. Upload & Analyze RISAT SAR
with open('c:/Users/hasin/OneDrive/Desktop/sat1/SatQueryAI/tests/sample_risat1_sar_cband.tif', 'rb') as f:
    up2 = requests.post(f'{base_url}/api/upload', data=f.read(), headers={'X-File-Name': 'sample_risat1_sar_cband.tif'}).json()
file2_id = up2['fileId']

an2 = requests.post(f'{base_url}/api/analyze', json={
    'file_id': file2_id,
    'analysis_id': 'cap_test_sar_02',
    'query': 'Describe this satellite scene in detail.',
    'configuration': {'model_type': 'DOMAIN-ADAPTED'}
}).json()

print("=" * 70)
print("SATQUERY AI — SINGLE IMAGE CAPTIONING API BENCHMARK")
print("=" * 70)

print("\n--- TEST SCENE 1: Cartosat Multi-Spectral Optical ---")
print("Detected Task:", an1['detectedTask'])
print("Text Answer (Scene Description):\n ", an1['textAnswer'])
print("Key Findings:")
for kf in an1['keyFindings']:
    print("  *", kf)
print("Confidence:", an1['confidence'])

print("\n--- TEST SCENE 2: RISAT-1 Synthetic Aperture Radar (SAR) ---")
print("Detected Task:", an2['detectedTask'])
print("Text Answer (Scene Description):\n ", an2['textAnswer'])
print("Key Findings:")
for kf in an2['keyFindings']:
    print("  *", kf)
print("Confidence:", an2['confidence'])

# Verify Answers are strictly different
assert an1['textAnswer'] != an2['textAnswer'], "FAIL: Outputs must not be identical"
assert "Multi-spectral" in an1['textAnswer'], "FAIL: Scene 1 must identify multi-spectral"
assert "Synthetic Aperture Radar" in an2['textAnswer'], "FAIL: Scene 2 must identify SAR"
assert an1['confidence'] is not None and an2['confidence'] is not None

print("\n" + "=" * 70)
print("PASS: Single image captioning dynamically produces distinct physics-grounded descriptions!")
print("=" * 70)
