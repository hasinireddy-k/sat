import urllib.request, urllib.parse, json, os, hashlib, time

BASE_URL = 'http://localhost:8000'
TESTS_DIR = os.path.abspath(r'SatQueryAI\tests')

def upload_file(filepath):
    with open(filepath, 'rb') as f:
        orig_bytes = f.read()
    sha256 = hashlib.sha256(orig_bytes).hexdigest()
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(filepath)}\"'.encode())
    body.append(b'Content-Type: image/tiff')
    body.append(b'')
    body.append(orig_bytes)
    body.append(f'--{boundary}--'.encode())
    body.append(b'')
    payload = b'\r\n'.join(body)

    req = urllib.request.Request(
        f'{BASE_URL}/api/upload',
        data=payload,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
        method='POST'
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
    data['orig_sha256'] = sha256
    data['orig_path'] = filepath
    return data

def analyze(file_id, query, secondary_file_id=None, forced_mode=None):
    payload = {
        'file_id': file_id,
        'query': query,
        'secondary_file_id': secondary_file_id,
        'forcedMode': forced_mode
    }
    req_body = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        f'{BASE_URL}/api/analyze',
        data=req_body,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    t0 = time.time()
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
    res['roundtrip_time_ms'] = round((time.time() - t0) * 1000, 1)
    return res

print('======================================================================')
print('SATQUERY AI — MASTER SIH 2026 END-TO-END VERIFICATION SUITE')
print('======================================================================')

# Assets
single_opt_path = os.path.join(TESTS_DIR, 'sample_cartosat_utm43n.tif')
t1_path = os.path.join(TESTS_DIR, 'bitemporal_t1_cartosat.tif')
t2_path = os.path.join(TESTS_DIR, 'bitemporal_t2_cartosat.tif')
opt_coreg_path = os.path.join(TESTS_DIR, 'coregistered_optical_vnir.tif')
sar_coreg_path = os.path.join(TESTS_DIR, 'coregistered_sar_cband.tif')

# Ingest all test assets
print('\n[INGESTING REAL TEST GEOTIFFS]...')
up_single = upload_file(single_opt_path)
print("  Single Optical: ID=" + str(up_single["file_id"]) + ", SHA256=" + str(up_single["orig_sha256"][:16]) + "...")

up_t1 = upload_file(t1_path)
print("  T1 Baseline:    ID=" + str(up_t1["file_id"]) + ", SHA256=" + str(up_t1["orig_sha256"][:16]) + "...")

up_t2 = upload_file(t2_path)
print("  T2 Observation: ID=" + str(up_t2["file_id"]) + ", SHA256=" + str(up_t2["orig_sha256"][:16]) + "...")

up_opt = upload_file(opt_coreg_path)
print("  Co-reg Optical: ID=" + str(up_opt["file_id"]) + ", SHA256=" + str(up_opt["orig_sha256"][:16]) + "...")

up_sar = upload_file(sar_coreg_path)
print("  Co-reg SAR:     ID=" + str(up_sar["file_id"]) + ", SHA256=" + str(up_sar["orig_sha256"][:16]) + "...")

test_records = {}

# TEST A: Single optical GeoTIFF -> Describe
print('\n----------------------------------------------------------------------')
print('TEST A: Single Optical GeoTIFF — Scene Captioning')
print('Query: "Describe this satellite image."')
print('----------------------------------------------------------------------')
res_a = analyze(up_single['file_id'], 'Describe this satellite image.')
lat_a = res_a.get('executionTimeTotalMs', res_a.get('roundtrip_time_ms'))
test_records['TEST_A'] = {
    'input': os.path.basename(single_opt_path),
    'query': 'Describe this satellite image.',
    'task': res_a.get('task') or res_a.get('detectedTask'),
    'model': res_a.get('model') or res_a.get('selectedModel', {}).get('name'),
    'preprocessing': 'Standardized 4-band VNIR container to calibrated radiometric channels.',
    'result': res_a.get('textAnswer') or res_a.get('answer'),
    'evidence': len(res_a.get('evidence', []) or res_a.get('keyFindings', [])),
    'confidence': res_a.get('confidence'),
    'evaluation_metric': res_a.get('evaluation_metric', 'Not available'),
    'trace_steps': len(res_a.get('execution_trace', []) or res_a.get('trace', [])),
    'inference_time': f'{lat_a}ms',
    'status': 'PASS' if (res_a.get('textAnswer') or res_a.get('answer')) else 'FAIL'
}
print("Result: " + str(test_records['TEST_A']['result'])[:150] + "...")
print("Status: " + str(test_records['TEST_A']['status']))

# TEST B: Single optical GeoTIFF -> Grounding
print('\n----------------------------------------------------------------------')
print('TEST B: Single Optical GeoTIFF — Spatial Grounding')
print('Query: "Find buildings and structures."')
print('----------------------------------------------------------------------')
res_b = analyze(up_single['file_id'], 'Find buildings and structures.')
lat_b = res_b.get('executionTimeTotalMs', res_b.get('roundtrip_time_ms'))
detections_b = res_b.get('detections', []) or res_b.get('groundingBoxes', [])
test_records['TEST_B'] = {
    'input': os.path.basename(single_opt_path),
    'query': 'Find buildings and structures.',
    'task': res_b.get('task') or res_b.get('detectedTask'),
    'model': res_b.get('model') or res_b.get('selectedModel', {}).get('name'),
    'preprocessing': 'Native resolution (512x512) multi-spectral gradient extraction & non-vegetation mask.',
    'result': res_b.get('textAnswer') or res_b.get('answer'),
    'evidence': str(len(detections_b)) + ' bounding boxes localized',
    'confidence': res_b.get('confidence'),
    'evaluation_metric': res_b.get('evaluation_metric', 'Not available'),
    'trace_steps': len(res_b.get('execution_trace', []) or res_b.get('trace', [])),
    'inference_time': f'{lat_b}ms',
    'status': 'PASS' if len(detections_b) > 0 else 'FAIL'
}
print("Result: " + str(test_records['TEST_B']['result'])[:150] + "...")
print("Evidence: " + str(test_records['TEST_B']['evidence']))
print("Status: " + str(test_records['TEST_B']['status']))

# TEST C: Single optical GeoTIFF -> VQA Dominant Land Cover
print('\n----------------------------------------------------------------------')
print('TEST C: Single Optical GeoTIFF — Domain-Adapted VQA')
print('Query: "What type of land cover dominates this image?"')
print('----------------------------------------------------------------------')
res_c = analyze(up_single['file_id'], 'What type of land cover dominates this image?')
lat_c = res_c.get('executionTimeTotalMs', res_c.get('roundtrip_time_ms'))
test_records['TEST_C'] = {
    'input': os.path.basename(single_opt_path),
    'query': 'What type of land cover dominates this image?',
    'task': res_c.get('task') or res_c.get('detectedTask'),
    'model': res_c.get('model') or res_c.get('selectedModel', {}).get('name'),
    'preprocessing': 'BigEarthNet-19 19-class spectral distribution tensor mapping.',
    'result': res_c.get('textAnswer') or res_c.get('answer'),
    'evidence': len(res_c.get('keyFindings', [])),
    'confidence': res_c.get('confidence'),
    'evaluation_metric': res_c.get('evaluation_metric', 'Not available'),
    'trace_steps': len(res_c.get('execution_trace', []) or res_c.get('trace', [])),
    'inference_time': f'{lat_c}ms',
    'status': 'PASS' if (res_c.get('textAnswer') or res_c.get('answer')) else 'FAIL'
}
print("Result: " + str(test_records['TEST_C']['result'])[:150] + "...")
print("Status: " + str(test_records['TEST_C']['status']))

# TEST D: T1 + T2 -> Bi-Temporal Change Analysis
print('\n----------------------------------------------------------------------')
print('TEST D: T1 + T2 Bi-Temporal Pair — Change Analysis')
print('Query: "What changed between these images?"')
print('----------------------------------------------------------------------')
res_d = analyze(up_t1['file_id'], 'What changed between these images?', secondary_file_id=up_t2['file_id'], forced_mode='change')
lat_d = res_d.get('executionTimeTotalMs', res_d.get('roundtrip_time_ms'))
change_areas_d = res_d.get('changeAreas', [])
test_records['TEST_D'] = {
    'input': os.path.basename(t1_path) + ' + ' + os.path.basename(t2_path),
    'query': 'What changed between these images?',
    'task': res_d.get('task') or res_d.get('detectedTask'),
    'model': res_d.get('model') or res_d.get('selectedModel', {}).get('name'),
    'preprocessing': 'Spatial co-registration & pixel matrix radiometric differencing.',
    'result': res_d.get('textAnswer') or res_d.get('answer'),
    'evidence': str(len(change_areas_d)) + ' changed regions detected',
    'confidence': res_d.get('confidence'),
    'evaluation_metric': res_d.get('evaluation_metric', 'Not available'),
    'trace_steps': len(res_d.get('execution_trace', []) or res_d.get('trace', [])),
    'inference_time': f'{lat_d}ms',
    'status': 'PASS' if len(change_areas_d) > 0 else 'FAIL'
}
print("Result: " + str(test_records['TEST_D']['result'])[:150] + "...")
print("Evidence: " + str(test_records['TEST_D']['evidence']))
print("Status: " + str(test_records['TEST_D']['status']))

# TEST E: Optical + SAR -> Cross-Modal Analysis
print('\n----------------------------------------------------------------------')
print('TEST E: Optical + SAR Cross-Modal Pair — Complementary Analysis')
print('Query: "What information does SAR add compared with optical imagery?"')
print('----------------------------------------------------------------------')
res_e = analyze(up_opt['file_id'], 'What information does SAR add compared with optical imagery?', secondary_file_id=up_sar['file_id'], forced_mode='optical-sar')
lat_e = res_e.get('executionTimeTotalMs', res_e.get('roundtrip_time_ms'))
boxes_e = res_e.get('groundingBoxes', [])
test_records['TEST_E'] = {
    'input': os.path.basename(opt_coreg_path) + ' + ' + os.path.basename(sar_coreg_path),
    'query': 'What information does SAR add compared with optical imagery?',
    'task': res_e.get('task') or res_e.get('detectedTask'),
    'model': res_e.get('model') or res_e.get('selectedModel', {}).get('name'),
    'preprocessing': 'Sub-pixel grid alignment, VNIR NDVI vegetation mask, C-band SAR specular & dihedral backscatter extraction.',
    'result': res_e.get('textAnswer') or res_e.get('answer'),
    'evidence': str(len(boxes_e)) + ' cross-modal bounding boxes localized',
    'confidence': res_e.get('confidence'),
    'evaluation_metric': res_e.get('evaluation_metric', 'Not available'),
    'trace_steps': len(res_e.get('execution_trace', []) or res_e.get('trace', [])),
    'inference_time': f'{lat_e}ms',
    'status': 'PASS' if bool(res_e.get('opticalSarInsight')) else 'FAIL'
}
print("Result: " + str(test_records['TEST_E']['result'])[:150] + "...")
print("Evidence: " + str(test_records['TEST_E']['evidence']))
print("Status: " + str(test_records['TEST_E']['status']))

# TEST F: Agentic Query -> Autonomous Specialist Routing
print('\n----------------------------------------------------------------------')
print('TEST F: Agentic Query — Autonomous Specialist Routing')
print('Query: "Are there buildings or other man-made structures in this satellite image?"')
print('----------------------------------------------------------------------')
res_f = analyze(up_single['file_id'], 'Are there buildings or other man-made structures in this satellite image?')
lat_f = res_f.get('executionTimeTotalMs', res_f.get('roundtrip_time_ms'))
test_records['TEST_F'] = {
    'input': os.path.basename(single_opt_path),
    'query': 'Are there buildings or other man-made structures in this satellite image?',
    'task': res_f.get('task') or res_f.get('detectedTask'),
    'model': res_f.get('model') or res_f.get('selectedModel', {}).get('name'),
    'preprocessing': 'Orchestrator Intent Classifier & Input Guardian 10-dimension validation.',
    'result': res_f.get('textAnswer') or res_f.get('answer'),
    'evidence': len(res_f.get('keyFindings', [])),
    'confidence': res_f.get('confidence'),
    'evaluation_metric': res_f.get('evaluation_metric', 'Not available'),
    'trace_steps': len(res_f.get('execution_trace', []) or res_f.get('trace', [])),
    'inference_time': f'{lat_f}ms',
    'status': 'PASS' if (res_f.get('detectedTask') == 'Visual Question Answering' or res_f.get('task') == 'vqa') else 'FAIL'
}
print("Task Routed: " + str(test_records['TEST_F']['task']))
print("Model Selected: " + str(test_records['TEST_F']['model']))
print("Status: " + str(test_records['TEST_F']['status']))

# Input Compatibility Guardian Test (Invalid Input Block)
print('\n----------------------------------------------------------------------')
print('GUARDIAN VERIFICATION: Negative Case (Single Image given for Change Analysis)')
print('----------------------------------------------------------------------')
guard_body = json.dumps({'file_id': up_single['file_id'], 'secondary_file_id': None, 'mode': 'change', 'query': 'What changed?'}).encode('utf-8')
guard_req = urllib.request.Request(f'{BASE_URL}/api/validate', data=guard_body, headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(guard_req) as resp:
        guard_res = json.loads(resp.read().decode())
except urllib.error.HTTPError as he:
    guard_res = json.loads(he.read().decode())

print("Guardian Allowed: " + str(guard_res.get("valid")))
print("Guardian Status:  " + str(guard_res.get("status")))
print("Rejection Reason: " + str(guard_res.get("rejections", [guard_res.get("message")])))
guardian_pass = (guard_res.get('valid') is False or guard_res.get('status') == 'BLOCKED')
print("Guardian Block Verified: " + str(guardian_pass))

# Save report
os.makedirs(r'SatQueryAI\reports', exist_ok=True)
report_path = r'SatQueryAI\reports\master_test_results.json'
with open(report_path, 'w') as f:
    json.dump({
        'test_records': test_records,
        'guardian_test': {
            'passed': guardian_pass,
            'response': guard_res
        },
        'raw_responses': {
            'test_a': res_a,
            'test_b': res_b,
            'test_c': res_c,
            'test_d': res_d,
            'test_e': res_e,
            'test_f': res_f
        }
    }, f, indent=2)

print(f'\nMaster verification results written to {report_path}')
print('======================================================================')
print('ALL MASTER VERIFICATION TESTS COMPLETED!')
print('======================================================================')
