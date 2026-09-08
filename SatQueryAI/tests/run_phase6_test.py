import urllib.request, urllib.parse, json, os, hashlib

BASE_URL = 'http://localhost:8000'
TEST_IMG = os.path.abspath(r'SatQueryAI\tests\sample_cartosat_utm43n.tif')

with open(TEST_IMG, 'rb') as f:
    orig_bytes = f.read()
orig_sha256 = hashlib.sha256(orig_bytes).hexdigest()

print(f'Original File: {TEST_IMG}')
print(f'Original SHA-256: {orig_sha256}')
print(f'Original Size: {len(orig_bytes)} bytes')

boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = []
body.append(f'--{boundary}'.encode())
body.append(f'Content-Disposition: form-data; name=\"file\"; filename=\"{os.path.basename(TEST_IMG)}\"'.encode())
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
    upload_data = json.loads(resp.read().decode())

file_id = upload_data['file_id']
stored_path = upload_data['filepath']
preview_url = upload_data.get('url')
print(f'Upload Successful: file_id={file_id}, stored_path={stored_path}, preview_url={preview_url}')

with open(stored_path, 'rb') as f:
    stored_bytes = f.read()
stored_sha256 = hashlib.sha256(stored_bytes).hexdigest()
print(f'Stored SHA-256 matches: {stored_sha256 == orig_sha256}')

queries = [
    'Find buildings and structures.',
    'Locate roads.',
    'Find large man-made structures.'
]

results = {}
for q in queries:
    print(f'\n==================================================')
    print(f'TESTING GROUNDING QUERY: \"{q}\"')
    print(f'==================================================')
    req_body = json.dumps({'file_id': file_id, 'query': q}).encode('utf-8')
    req = urllib.request.Request(f'{BASE_URL}/api/analyze', data=req_body, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
    results[q] = res
    print(f'Task: {res.get("task")}')
    print(f'Model: {res.get("model")}')
    print(f'Confidence: {res.get("confidence")}')
    print(f'Evaluation Metric: {res.get("evaluation_metric")}')
    print(f'Image: {res.get("image")}')
    print(f'Text Answer: {res.get("textAnswer")}')
    print(f'Detections Count: {len(res.get("detections", []))}')
    for det in res.get('detections', []):
        print(f'  [{det["id"]}] {det["label"]}')
        print(f'     bbox: {det["bbox"]}')
        print(f'     normalized_bbox: {det["normalized_bbox"]}')
        print(f'     pixel_dims: {det["pixel_dimensions"]}')
        if "geo_coordinates" in det:
            print(f'     geo: {det["geo_coordinates"]}')
    print('Execution Trace (7 stages):')
    for step in res.get('execution_trace', []):
        print(f'  [{step["stepNumber"]}] {step["name"]}: {step["description"]}')

print('\n==================================================')
print('VERIFYING PHASE 5A REGRESSION (VQA)')
print('==================================================')
vqa_body = json.dumps({'file_id': file_id, 'query': 'Are there buildings or other man-made structures in this satellite image?'}).encode('utf-8')
req = urllib.request.Request(f'{BASE_URL}/api/analyze', data=vqa_body, headers={'Content-Type': 'application/json'}, method='POST')
with urllib.request.urlopen(req) as resp:
    vqa_res = json.loads(resp.read().decode())
print(f'VQA Task: {vqa_res.get("task")}')
print(f'VQA Model: {vqa_res.get("model")}')
print(f'VQA Answer: {vqa_res.get("answer")}')
print(f'VQA Trace Steps: {len(vqa_res.get("execution_trace", []))}')

with open(r'SatQueryAI\tests\phase6_results.json', 'w') as f:
    json.dump({'grounding': results, 'vqa': vqa_res}, f, indent=2)
print('\nResults saved successfully to SatQueryAI/tests/phase6_results.json')
