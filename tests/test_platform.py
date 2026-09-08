import unittest
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))
sys.path.insert(0, str(ROOT_DIR / "ai_service"))
sys.path.insert(0, str(ROOT_DIR))

from run_local import app
from fastapi.testclient import TestClient
from app.core.embeddings import embedding_engine
from app.core.rag_chain import rag_chain

class TestLegalAIPlatform(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_check(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "HEALTHY")

    def test_statutes_acts(self):
        res = self.client.get("/api/v1/statutes/acts")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(len(data), 1)

    def test_search_endpoint(self):
        res = self.client.get("/api/v1/search?q=murder")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("statutes", data)
        self.assertIn("judgments", data)

    def test_rag_query(self):
        res = self.client.post("/api/v1/rag/query", json={
            "query": "What is punishment for murder under BNS 2023?",
            "persona": "Advocate"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("103", data["answer"])
        self.assertGreater(data["confidence_score"], 90.0)

    def test_drafting_endpoint(self):
        res = self.client.post("/api/v1/drafting/generate", json={
            "draft_type": "Bail Petition",
            "petitioner_name": "Rohan Sharma",
            "respondent_name": "State of Delhi",
            "facts": "Falsely implicated under BNS 103.",
            "sections_invoked": ["BNSS Section 480"]
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("Bail Petition", data["title"])

    def test_embeddings_generation(self):
        vec = embedding_engine.encode("BNS Section 103")
        self.assertEqual(len(vec), 384)

    def test_rag_chain_persona(self):
        res = rag_chain.process_query("What is Zero FIR?", "Police / Investigator")
        self.assertEqual(res["persona"], "Police / Investigator")
        self.assertGreater(res["confidence_score"], 90.0)

if __name__ == "__main__":
    unittest.main()
