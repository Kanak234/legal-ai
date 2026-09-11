#!/usr/bin/env python3
import unittest
import sys
from pathlib import Path

import asyncio

# Add root and backend to path
root = Path(__file__).parent.parent
sys.path.insert(0, str(root))
sys.path.insert(0, str(root / "backend"))

from fastapi.testclient import TestClient
from app.main import app
from app.db.seed import init_db
from ai_service.app.core.embeddings import embedding_engine
from ai_service.app.core.rag_chain import rag_chain

class TestBackendAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        asyncio.run(init_db())
        cls.client = TestClient(app)

    def test_01_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "HEALTHY")

    def test_02_auth_and_login(self):
        reg = self.client.post("/api/v1/auth/register", json={
            "email": "advocate_test@legalai.org",
            "full_name": "Advocate Test",
            "password": "TestPassword123!",
            "role": "Advocate"
        })
        if reg.status_code == 200:
            self.assertEqual(reg.json()["email"], "advocate_test@legalai.org")

        login = self.client.post("/api/v1/auth/login", json={
            "email": "advocate_test@legalai.org",
            "password": "TestPassword123!"
        })
        self.assertEqual(login.status_code, 200)
        self.assertIn("access_token", login.json())

    def test_03_search(self):
        response = self.client.get("/api/v1/search?q=murder")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertIn("statutes", res)
        self.assertIn("judgments", res)

    def test_04_rag_query(self):
        response = self.client.post("/api/v1/rag/query", json={
            "query": "What is punishment for murder under BNS 2023?",
            "persona": "Advocate"
        })
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertIn("Section 103", res["answer"])
        self.assertGreater(res["confidence_score"], 90.0)

    def test_05_drafting(self):
        response = self.client.post("/api/v1/drafting/generate", json={
            "draft_type": "Bail Petition",
            "petitioner_name": "Rohan Sharma",
            "respondent_name": "State of Delhi",
            "facts": "Falsely implicated under BNS 103.",
            "sections_invoked": ["BNSS Section 480"]
        })
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertIn("Rohan Sharma", res["generated_content"])

class TestAIService(unittest.TestCase):
    def test_embeddings(self):
        vec = embedding_engine.encode("BNS Section 103")
        self.assertIsInstance(vec, list)
        self.assertEqual(len(vec), 384)

    def test_rag_chain(self):
        res = rag_chain.process_query("What is Zero FIR?", "Police / Investigator")
        self.assertEqual(res["persona"], "Police / Investigator")
        self.assertGreater(res["confidence_score"], 90.0)

if __name__ == "__main__":
    unittest.main()
