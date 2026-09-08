import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "LegalAI" in data["service"]

def test_register_and_login_flow():
    email = "advocate_test@legalai.org"
    user_payload = {
        "email": email,
        "full_name": "Advocate Test User",
        "password": "TestPassword123!",
        "role": "Advocate",
        "organization": "Delhi High Court Bar Association"
    }
    
    # Register
    reg_resp = client.post("/api/v1/auth/register", json=user_payload)
    if reg_resp.status_code == 200:
        assert reg_resp.json()["email"] == email

    # Login
    login_resp = client.post("/api/v1/auth/login", json={"email": email, "password": "TestPassword123!"})
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

def test_search_api():
    response = client.get("/api/v1/search?q=murder")
    assert response.status_code == 200
    res = response.json()
    assert "statutes" in res
    assert "judgments" in res
    assert "mappings" in res

def test_rag_query():
    rag_payload = {
        "query": "What is the penalty for murder under BNS 2023?",
        "persona": "Advocate"
    }
    response = client.post("/api/v1/rag/query", json=rag_payload)
    assert response.status_code == 200
    res = response.json()
    assert "Section 103" in res["answer"]
    assert res["confidence_score"] > 90.0
    assert len(res["citations"]) > 0

def test_draft_generation():
    draft_payload = {
        "draft_type": "Bail Petition",
        "petitioner_name": "Rohan Sharma",
        "respondent_name": "State of Delhi",
        "facts": "Falsely accused under BNS Section 103(1). No recovery made.",
        "sections_invoked": ["BNSS Section 480"]
    }
    response = client.post("/api/v1/drafting/generate", json=draft_payload)
    assert response.status_code == 200
    res = response.json()
    assert "IN THE COURT OF THE HON'BLE" in res["generated_content"]
    assert "Rohan Sharma" in res["generated_content"]
