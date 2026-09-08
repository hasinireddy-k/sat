"""
SatQuery AI — Bi-Temporal Change Analysis Verification Test
"""

import os
import sys
import json
import tifffile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
from models.change_detection import analyze_bitemporal_change

t1_file = os.path.join(BASE_DIR, 'tests', 'bitemporal_t1_cartosat.tif')
t2_file = os.path.join(BASE_DIR, 'tests', 'bitemporal_t2_cartosat.tif')
diff_output = os.path.join(BASE_DIR, 'backend', 'uploads', 'test_diff.png')

# Read metadata for both
with tifffile.TiffFile(t1_file) as tif:
    p1 = tif.pages[0]
    tags1 = {tag.code: tag.value for tag in p1.tags.values()}
    t1_meta = {
        'filename': 'bitemporal_t1_cartosat.tif',
        'width': p1.shape[2],
        'height': p1.shape[1],
        'bandCount': p1.shape[0],
        'crs': 'WGS 84 / UTM zone 43N',
        'bounds': [775000.0, 1434744.0, 775256.0, 1435000.0],
        'transform': [775000.0, 0.5, 0.0, 1435000.0, 0.0, -0.5],
        'resolution': '0.5 m/px',
        'sensor': 'Cartosat Multi-Spectral (VNIR)',
        'acquisitionDate': tags1.get(306, 'Not available')
    }

with tifffile.TiffFile(t2_file) as tif:
    p2 = tif.pages[0]
    tags2 = {tag.code: tag.value for tag in p2.tags.values()}
    t2_meta = {
        'filename': 'bitemporal_t2_cartosat.tif',
        'width': p2.shape[2],
        'height': p2.shape[1],
        'bandCount': p2.shape[0],
        'crs': 'WGS 84 / UTM zone 43N',
        'bounds': [775000.0, 1434744.0, 775256.0, 1435000.0],
        'transform': [775000.0, 0.5, 0.0, 1435000.0, 0.0, -0.5],
        'resolution': '0.5 m/px',
        'sensor': 'Cartosat Multi-Spectral (VNIR)',
        'acquisitionDate': tags2.get(306, 'Not available')
    }

print("=" * 70)
print("SATQUERY AI — BI-TEMPORAL CHANGE ANALYSIS BENCHMARK")
print("=" * 70)

res = analyze_bitemporal_change(t1_file, t2_file, t1_meta, t2_meta, diff_output)

print(f"\n[1. METADATA VALIDATIONS]:")
for k, v in res['validations'].items():
    if k != 'validation_notes':
        print(f"  {k}: {v}")
print("  Validation Notes:")
for n in res['validations']['validation_notes']:
    print(f"    * {n}")

print(f"\n[2. EXACT NON-FABRICATED CHANGE METRICS]:")
print(f"  Percentage Change: {res['percentage_change']}%")
print(f"  Changed Pixel Count: {res['changed_pixel_count']:,} / {res['total_pixels']:,} px")

print(f"\n[3. DETECTED CHANGE REGIONS]: {len(res['change_areas'])} region(s)")
for chg in res['change_areas']:
    print(f"  - ID: {chg['id']} | Type: {chg['type']} | Severity: {chg['changeSeverity']}")
    print(f"    Box: {chg['box']} (ymin%, xmin%, ymax%, xmax%)")
    print(f"    Ground Area: {chg['areaSqMeters']} m^2 ({chg['pixelCount']} pixels)")
    print(f"    Description: {chg['description']}")

print(f"\n[4. CHANGE DESCRIPTION]:\n  {res['change_description']}")
print(f"\n[5. VISUALIZATION MASK GENERATED]: {diff_output} (Exists: {os.path.exists(diff_output)})")

# Assertions
assert res['validations']['exactly_two_images'] is True
assert res['validations']['dimensions_compatible'] is True
assert res['validations']['crs_compatible'] is True
assert res['validations']['extent_compatible'] is True
assert res['percentage_change'] > 0.0, "Real physical changes must be detected"
assert len(res['change_areas']) >= 1, "Must localize changed regions"
assert os.path.exists(diff_output), "Diff visualization image must be created"

print("\n" + "=" * 70)
print("ALL BI-TEMPORAL CHANGE ANALYSIS CHECKS PASSED!")
print("=" * 70)
