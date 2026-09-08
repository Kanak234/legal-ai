import sys
from pathlib import Path

ai_path = Path(__file__).parent.parent.parent / "ai_service"
sys.path.insert(0, str(ai_path))

from app.core.embeddings import embedding_engine
from app.core.rag_chain import rag_chain

def test_embedding_generation():
    vec = embedding_engine.encode("BNS Section 103 Punishment for Murder")
    assert isinstance(vec, list)
    assert len(vec) == 384

def test_rag_chain_reasoning():
    res = rag_chain.process_query("What is Zero FIR under BNSS?", "Police / Investigator")
    assert res["persona"] == "Police / Investigator"
    assert res["confidence_score"] > 95.0
    assert len(res["reasoning_steps"]) >= 4
