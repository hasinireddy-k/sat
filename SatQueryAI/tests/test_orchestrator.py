"""
SatQuery AI — Agentic Orchestration Verification Suite
SIH 2026 Problem Statement 26167: Phase 9 Verification

Validates:
1. Deterministic Agent Controller inspecting:
   - query
   - number of images
   - modality
   - format
   - metadata
   - temporal relationship
   - cross-modal compatibility
2. Specialist Registry Selection:
   - VQA
   - CAPTIONING
   - GROUNDING
   - CHANGE_ANALYSIS
   - OPTICAL_SAR_FUSION
3. Observable Execution Trace:
   - UNDERSTANDING QUERY
   - VALIDATING INPUT
   - SELECTING SPECIALIST
   - CONFIGURING
   - EXECUTING
   - EXTRACTING EVIDENCE
   - GENERATING ANSWER
4. Real execution of every selected specialist without fake messages or hidden chain-of-thought.
5. End-to-end REST API integration via /api/analyze.
"""

import os
import sys
import json
import urllib.request
import urllib.parse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'models'))

from orchestrator import AgenticOrchestrator

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

def verify_trace_structure(trace, expected_stage_names):
    assert len(trace) == len(expected_stage_names), f"Expected {len(expected_stage_names)} trace steps, found {len(trace)}"
    for i, (step, expected_name) in enumerate(zip(trace, expected_stage_names)):
        assert step['name'] == expected_name, f"Step {i+1} name mismatch: expected '{expected_name}', got '{step['name']}'"
        assert step['status'] == 'success', f"Step {i+1} did not succeed"
        assert 'description' in step and len(step['description']) > 0, f"Step {i+1} missing observable description"
        # Ensure no hidden chain of thought keywords
        assert "think" not in step['description'].lower() and "chain-of-thought" not in step['description'].lower()

def run_tests():
    print("=======================================================================")
    print("SATQUERY AI — PHASE 9: AGENTIC ORCHESTRATION VERIFICATION")
    print("=======================================================================\n")

    opt_path = os.path.join(BASE_DIR, 'tests', 'coregistered_optical_vnir.tif')
    sar_path = os.path.join(BASE_DIR, 'tests', 'coregistered_sar_cband.tif')
    t1_path = os.path.join(BASE_DIR, 'tests', 'bitemporal_t1_cartosat.tif')
    t2_path = os.path.join(BASE_DIR, 'tests', 'bitemporal_t2_cartosat.tif')

    print("[*] Ingesting test rasters into SatQuery backend...")
    opt_upload = upload_file(opt_path)
    sar_upload = upload_file(sar_path)
    t1_upload = upload_file(t1_path)
    t2_upload = upload_file(t2_path)

    expected_7_stages = [
        "UNDERSTANDING QUERY",
        "VALIDATING INPUT",
        "SELECTING SPECIALIST",
        "CONFIGURING",
        "EXECUTING",
        "EXTRACTING EVIDENCE",
        "GENERATING ANSWER"
    ]

    # TEST 1: GROUNDING SPECIALIST SELECTION
    print("\n--- TEST 1: GROUNDING SPECIALIST SELECTION ---")
    q1 = "Find buildings near the center."
    res1 = send_analyze_request(opt_upload['file_id'], query=q1)
    print(f"Query: \"{q1}\"")
    print(f"Selected Specialist: {res1['orchestratorDecision']['specialistKey']} ({res1['orchestratorDecision']['specialistName']})")
    print(f"Detected Task:       {res1['detectedTask']}")
    print(f"Grounding Boxes:     {len(res1.get('groundingBoxes', []))}")
    assert res1['orchestratorDecision']['specialistKey'] == "GROUNDING"
    assert res1['detectedTask'] == "Text-Guided Region Grounding"
    assert len(res1.get('groundingBoxes', [])) > 0
    verify_trace_structure(res1['trace'], expected_7_stages)
    print("Trace Steps Observable:")
    for step in res1['trace']:
        print(f"  [{step['stepNumber']}] {step['name']} -> {step['description']}")
    print("[PASS] Test 1 passed.")

    # TEST 2: CAPTIONING SPECIALIST SELECTION
    print("\n--- TEST 2: CAPTIONING SPECIALIST SELECTION ---")
    q2 = "Describe this satellite scene."
    res2 = send_analyze_request(opt_upload['file_id'], query=q2)
    print(f"Query: \"{q2}\"")
    print(f"Selected Specialist: {res2['orchestratorDecision']['specialistKey']} ({res2['orchestratorDecision']['specialistName']})")
    print(f"Detected Task:       {res2['detectedTask']}")
    assert res2['orchestratorDecision']['specialistKey'] == "CAPTIONING"
    assert res2['detectedTask'] == "Single Image Captioning"
    assert len(res2['keyFindings']) > 0
    verify_trace_structure(res2['trace'], expected_7_stages)
    print("[PASS] Test 2 passed.")

    # TEST 3: CHANGE ANALYSIS SPECIALIST SELECTION (2 Optical Images)
    print("\n--- TEST 3: CHANGE ANALYSIS SPECIALIST SELECTION ---")
    q3 = "Analyze flood damage and land changes between T1 and T2."
    res3 = send_analyze_request(t1_upload['file_id'], secondary_id=t2_upload['file_id'], query=q3)
    print(f"Query: \"{q3}\"")
    print(f"Selected Specialist: {res3['orchestratorDecision']['specialistKey']} ({res3['orchestratorDecision']['specialistName']})")
    print(f"Detected Task:       {res3['detectedTask']}")
    print(f"Change Areas:        {len(res3.get('changeAreas', []))}")
    print(f"Diff Map URL:        {res3['images']['diff']}")
    assert res3['orchestratorDecision']['specialistKey'] == "CHANGE_ANALYSIS"
    assert res3['detectedTask'] == "Temporal Change Analysis"
    assert res3['images']['diff'] is not None
    verify_trace_structure(res3['trace'], expected_7_stages)
    print("[PASS] Test 3 passed.")

    # TEST 4: OPTICAL + SAR FUSION SPECIALIST SELECTION (Optical + SAR Pair)
    print("\n--- TEST 4: OPTICAL + SAR FUSION SPECIALIST SELECTION ---")
    q4 = "Perform optical and SAR cross-modal fusion. Check microwave cloud penetration."
    res4 = send_analyze_request(opt_upload['file_id'], secondary_id=sar_upload['file_id'], query=q4)
    print(f"Query: \"{q4}\"")
    print(f"Selected Specialist: {res4['orchestratorDecision']['specialistKey']} ({res4['orchestratorDecision']['specialistName']})")
    print(f"Detected Task:       {res4['detectedTask']}")
    print(f"Co-Reg Status:       {res4['opticalSarInsight']['coRegistrationStatus']}")
    print(f"Cloud Penetrated:    {res4['opticalSarInsight']['cloudPenetrationDemonstrated']}")
    assert res4['orchestratorDecision']['specialistKey'] == "OPTICAL_SAR_FUSION"
    assert res4['detectedTask'] == "Cross-Modal Optical-SAR Fusion"
    assert res4['opticalSarInsight']['isCoRegistered'] is True
    assert res4['opticalSarInsight']['cloudPenetrationDemonstrated'] is True
    verify_trace_structure(res4['trace'], expected_7_stages)
    print("[PASS] Test 4 passed.")

    # TEST 5: VQA SPECIALIST SELECTION (Specific spectral question)
    print("\n--- TEST 5: VQA SPECIALIST SELECTION ---")
    q5 = "What is the dominant land cover class and spectral reflectance characteristics?"
    res5 = send_analyze_request(opt_upload['file_id'], query=q5)
    print(f"Query: \"{q5}\"")
    print(f"Selected Specialist: {res5['orchestratorDecision']['specialistKey']} ({res5['orchestratorDecision']['specialistName']})")
    print(f"Detected Task:       {res5['detectedTask']}")
    assert res5['orchestratorDecision']['specialistKey'] == "VQA"
    assert res5['detectedTask'] == "Visual Question Answering"
    verify_trace_structure(res5['trace'], expected_7_stages)
    print("[PASS] Test 5 passed.")

    print("\n=======================================================================")
    print("ALL 5 SPECIALIST ORCHESTRATION TESTS PASSED WITH OBSERVABLE TRACES!")
    print("=======================================================================")

if __name__ == '__main__':
    run_tests()
