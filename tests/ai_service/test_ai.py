import sys
from pathlib import Path

# Add root to path
root_path = Path(__file__).parent.parent.parent
sys.path.insert(0, str(root_path))

from ai_service.app.core.embeddings import embedding_engine
from ai_service.app.core.rag_chain import rag_chain
from ai_service.app.core.training_pipeline import training_pipeline

def test_embedding_generation():
    vec = embedding_engine.encode("BNS Section 103 Punishment for Murder")
    assert isinstance(vec, list)
    assert len(vec) == 384

def test_rag_chain_reasoning():
    res = rag_chain.process_query("What is Zero FIR under BNSS?", "Police / Investigator")
    assert res["persona"] == "Police / Investigator"
    assert res["confidence_score"] > 95.0
    assert len(res["reasoning_steps"]) >= 4

def test_training_pipeline_deduplication():
    docs = [
        {"id": "1", "title": "Doc 1", "content": "Sample legal content on bail."},
        {"id": "2", "title": "Doc 2", "content": "Sample legal content on bail."},
        {"id": "3", "title": "Doc 3", "content": "Distinct legal statute on murder."}
    ]
    res = training_pipeline.preprocess_and_deduplicate(docs)
    assert res["raw_count"] == 3
    assert res["unique_count"] == 2
    assert res["deduplicated_count"] == 1
    assert res["status"] == "COMPLETED"

def test_training_pipeline_finetune_and_rollback():
    finetune_res = training_pipeline.trigger_local_finetune("BNS_Corpus", epochs=2)
    assert finetune_res["status"] == "SUCCESS"
    assert "new_version" in finetune_res
    new_v = finetune_res["new_version"]

    rollback_res = training_pipeline.rollback_version(new_v)
    assert rollback_res["status"] == "SUCCESS"
    assert rollback_res["active_version"] == new_v

    fail_rollback = training_pipeline.rollback_version("non_existent_version")
    assert fail_rollback["status"] == "FAILED"
