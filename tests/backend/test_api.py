import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

import asyncio

# Add backend and root directories to sys.path
root_path = Path(__file__).parent.parent.parent
backend_path = root_path / "backend"
sys.path.insert(0, str(root_path))
sys.path.insert(0, str(backend_path))

from app.main import app
from app.db.seed import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    asyncio.run(init_db())

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

    # Duplicate register -> 400
    dup_resp = client.post("/api/v1/auth/register", json=user_payload)
    assert dup_resp.status_code == 400

    # Login
    login_resp = client.post("/api/v1/auth/login", json={"email": email, "password": "TestPassword123!"})
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Login failure
    bad_login = client.post("/api/v1/auth/login", json={"email": email, "password": "WrongPassword"})
    assert bad_login.status_code == 401

    # /me endpoint with token
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == email

    # /me endpoint without token -> 401
    bad_me = client.get("/api/v1/auth/me")
    assert bad_me.status_code == 401

def test_statutes_api():
    acts_resp = client.get("/api/v1/statutes/acts")
    assert acts_resp.status_code == 200
    acts = acts_resp.json()
    assert len(acts) > 0
    act_id = acts[0]["act_id"]

    sections_resp = client.get(f"/api/v1/statutes/acts/{act_id}/sections")
    assert sections_resp.status_code == 200
    sections = sections_resp.json()
    assert len(sections) > 0

    section_id = sections[0]["id"]
    sec_resp = client.get(f"/api/v1/statutes/sections/{section_id}")
    assert sec_resp.status_code == 200
    assert sec_resp.json()["id"] == section_id

    bad_sec = client.get("/api/v1/statutes/sections/999999")
    assert bad_sec.status_code == 404

    mappings_resp = client.get("/api/v1/statutes/mappings?old_act=IPC&new_act=BNS")
    assert mappings_resp.status_code == 200
    assert isinstance(mappings_resp.json(), list)

def test_search_api():
    response = client.get("/api/v1/search?q=murder")
    assert response.status_code == 200
    res = response.json()
    assert "statutes" in res
    assert "judgments" in res
    assert "mappings" in res

    filtered_resp = client.get("/api/v1/search?q=murder&act_id=bns_2023&court=Supreme+Court&year=2023")
    assert filtered_resp.status_code == 200

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

    # Different persona and unspecific query
    rag_payload_2 = {
        "query": "Explain general rights under Article 21",
        "persona": "Citizen"
    }
    resp2 = client.post("/api/v1/rag/query", json=rag_payload_2)
    assert resp2.status_code == 200

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

    legal_notice_payload = {
        "draft_type": "Legal Notice",
        "petitioner_name": "Kanak Corp",
        "respondent_name": "Defaulting Partner",
        "facts": "Breach of supply agreement section 12."
    }
    ln_resp = client.post("/api/v1/drafting/generate", json=legal_notice_payload)
    assert ln_resp.status_code == 200
    assert "LEGAL NOTICE" in ln_resp.json()["generated_content"]

    generic_draft = {
        "draft_type": "Custom Affidavit",
        "petitioner_name": "Test Person",
        "respondent_name": "State",
        "facts": "Sworn declaration."
    }
    gen_resp = client.post("/api/v1/drafting/generate", json=generic_draft)
    assert gen_resp.status_code == 200
    assert "Test Person" in gen_resp.json()["generated_content"]

def test_analytics_and_model_manager():
    summary_resp = client.get("/api/v1/analytics/summary")
    assert summary_resp.status_code == 200
    data = summary_resp.json()
    assert "metrics" in data
    assert "charts" in data

    status_resp = client.get("/api/v1/models/status")
    assert status_resp.status_code == 200
    model_data = status_resp.json()
    assert "system_hardware" in model_data
    assert "loaded_models" in model_data

def test_ocr_endpoint():
    files = {"file": ("test_doc.pdf", b"%PDF-1.4 test content", "application/pdf")}
    resp = client.post("/api/v1/ocr/process", files=files)
    assert resp.status_code == 200
    assert resp.json()["status"] == "SUCCESS"

    bad_files = {"file": ("malicious.exe", b"MZ...", "application/octet-stream")}
    bad_resp = client.post("/api/v1/ocr/process", files=bad_files)
    assert bad_resp.status_code == 400

def test_graphql_endpoint():
    schema_query = client.post("/api/v1/graphql/query", json={"query": "{ __schema { types { name } } }"})
    assert schema_query.status_code == 200
    assert "__schema" in schema_query.json()["data"]

    acts_query = client.post("/api/v1/graphql/query", json={"query": "{ acts { actId actName } }"})
    assert acts_query.status_code == 200
    assert "acts" in acts_query.json()["data"]

    judgments_query = client.post("/api/v1/graphql/query", json={"query": "{ judgments { caseTitle } }"})
    assert judgments_query.status_code == 200
    assert "judgments" in judgments_query.json()["data"]

    fallback_query = client.post("/api/v1/graphql/query", json={"query": "{ customQuery }"})
    assert fallback_query.status_code == 200
    assert "schema" in fallback_query.json()["data"]

def test_training_pipeline_api():
    status_resp = client.get("/api/v1/training/status")
    assert status_resp.status_code == 200
    assert "active_model_version" in status_resp.json()

    finetune_resp = client.post("/api/v1/training/finetune", json={
        "dataset_name": "Test_Corpus",
        "epochs": 1,
        "learning_rate": 0.0001
    })
    assert finetune_resp.status_code == 200
    new_v = finetune_resp.json()["new_version"]

    rollback_resp = client.post("/api/v1/training/rollback", json={"target_version": new_v})
    assert rollback_resp.status_code == 200

    bad_rollback = client.post("/api/v1/training/rollback", json={"target_version": "invalid_version_xyz"})
    assert bad_rollback.status_code == 400
