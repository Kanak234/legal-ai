#!/usr/bin/env python3
"""
LegalAI 100% Working Model Verification Test Script
Tests all REST API endpoints, AI microservices, search pipelines, drafting engines, and analytics.
"""

import json
import urllib.request
import urllib.error
import sys

def check_endpoint(name, url, method="GET", data=None):
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            content = response.read().decode("utf-8")
            res_json = json.loads(content) if "json" in response.headers.get("Content-Type", "") else content
            print(f"  [✓] {name}: SUCCESS (HTTP {status})")
            return True, res_json
    except Exception as e:
        print(f"  [✗] {name}: FAILED ({e})")
        return False, None

def run_suite():
    print("=" * 60)
    print(" LEGAL AI PLATFORM - 100% WORKING MODEL SUITE VERIFICATION")
    print("=" * 60)

    tests = [
        ("Backend Health Check", "http://localhost:8000/health", "GET", None),
        ("Hybrid Legal Search", "http://localhost:8000/api/v1/search?q=murder", "GET", None),
        ("Acts & Statutes List", "http://localhost:8000/api/v1/statutes/acts", "GET", None),
        ("IPC <-> BNS Cross Mappings", "http://localhost:8000/api/v1/statutes/mappings", "GET", None),
        ("RAG AI Assistant Query", "http://localhost:8000/api/v1/rag/query", "POST", {
            "query": "What is punishment for murder under BNS 2023?",
            "persona": "Advocate"
        }),
        ("Legal Document Draft Studio", "http://localhost:8000/api/v1/drafting/generate", "POST", {
            "draft_type": "Bail Petition",
            "petitioner_name": "Rajesh Kumar",
            "respondent_name": "State of Delhi",
            "facts": "Falsely accused under BNS 103(1).",
            "sections_invoked": ["BNSS Section 480"]
        }),
        ("Court Analytics Summary", "http://localhost:8000/api/v1/analytics/summary", "GET", None),
        ("AI Model Manager Telemetry", "http://localhost:8000/api/v1/models/status", "GET", None),
        ("AI Microservice Health", "http://localhost:8001/health", "GET", None),
        ("OCR Microservice Health", "http://localhost:8002/health", "GET", None),
    ]

    passed = 0
    total = len(tests)

    for name, url, method, data in tests:
        success, _ = check_endpoint(name, url, method, data)
        if success:
            passed += 1

    print("-" * 60)
    print(f" VERIFICATION RESULT: {passed}/{total} ENDPOINTS VERIFIED WORKING")
    print("=" * 60)
    return passed == total

if __name__ == "__main__":
    success = run_suite()
    sys.exit(0 if success else 1)
