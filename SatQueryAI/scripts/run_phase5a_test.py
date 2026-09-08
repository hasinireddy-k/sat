import urllib.request
import json
import time
import os
import hashlib

test_file = os.path.abspath(r'SatQueryAI/tests/sample_cartosat_utm43n.tif')
with open(test_file, 'rb') as f:
    file_bytes = f.read()

orig_hash = hashlib.sha256(file_bytes).hexdigest()
print(f"Original File: {test_file}")
print(f"Original File Size: {len(file_bytes)} bytes")
print(f"Original File SHA256: {orig_hash}")

# 1. UPLOAD
req = urllib.request.Request(
    'http://localhost:8000/api/upload',
    data=file_bytes,
    headers={'Content-Type': 'image/tiff', 'X-File-Name': 'sample_cartosat_utm43n.tif'},
    method='POST'
)
with urllib.request.urlopen(req) as resp:
    upload_res = json.loads(resp.read().decode())

file_id = upload_res['file_id']
print(f"\nUPLOAD RESULT:")
print(f"file_id: {file_id}")
print(f"url: {upload_res['url']}")
print(f"metadata: {upload_res['metadata']['dimensions']}, {upload_res['metadata']['bandCount']} bands, CRS: {upload_res['metadata']['crs']}")
print(f"status: {upload_res['status']}")

# Check preview image hash
preview_path = os.path.abspath(f'SatQueryAI/backend/uploads/{file_id}_preview.png')
with open(preview_path, 'rb') as f:
    preview_bytes = f.read()
preview_hash = hashlib.sha256(preview_bytes).hexdigest()
print(f"Preview File: {preview_path} ({len(preview_bytes)} bytes)")
print(f"Preview SHA256: {preview_hash}")

# 2. VALIDATE
val_payload = json.dumps({'file_id': file_id, 'query': 'Describe this satellite image.'}).encode()
req_val = urllib.request.Request(
    'http://localhost:8000/api/validate',
    data=val_payload,
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req_val) as resp:
    val_res = json.loads(resp.read().decode())
print(f"\nVALIDATION RESULT: valid={val_res['valid']}, status={val_res['status']}")

# 3. TEST 1, 2, 3
queries = [
    "Describe this satellite image.",
    "What type of land cover is visible?",
    "Are there buildings or other man-made structures?"
]

results = []
for idx, q in enumerate(queries, 1):
    t_start = time.time()
    payload = json.dumps({
        'file_id': file_id,
        'query': q,
        'mode': 'single'
    }).encode()
    
    req_an = urllib.request.Request(
        'http://localhost:8000/api/analyze',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req_an) as resp:
        an_res = json.loads(resp.read().decode())
    elapsed_ms = round((time.time() - t_start) * 1000, 1)
    results.append((idx, q, an_res, elapsed_ms))

for idx, q, an_res, elapsed_ms in results:
    print(f"\n========================================")
    print(f"TEST {idx}: {q}")
    print(f"========================================")
    print(f"ANSWER:\n{an_res.get('answer')}")
    print(f"MODEL: {an_res.get('model')}")
    print(f"CONFIDENCE: {an_res.get('confidence')}")
    print(f"EVIDENCE: {an_res.get('evidence')}")
    print(f"INPUT: {json.dumps(an_res.get('input'))}")
    print(f"PREPROCESSING: {an_res.get('preprocessing')}")
    print(f"EXECUTION TRACE ({len(an_res.get('execution_trace', []))} stages):")
    for st in an_res.get('execution_trace', []):
        print(f"  [{st['stepNumber']}] {st['name']}: {st['description']}")
    print(f"TOTAL ROUNDTRIP TIME: {elapsed_ms} ms")
