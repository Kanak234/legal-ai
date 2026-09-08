from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ai_service.app.core.training_pipeline import training_pipeline

router = APIRouter()

class FineTuneRequest(BaseModel):
    dataset_name: str = "BNS_2023_Legal_Corpus"
    epochs: int = 3
    learning_rate: float = 2e-5

class RollbackRequest(BaseModel):
    target_version: str

@router.get("/status")
async def get_training_pipeline_status():
    return {
        "active_model_version": training_pipeline.model_version,
        "training_status": training_pipeline.training_status,
        "corpus_statistics": training_pipeline.corpus_stats,
        "version_history": training_pipeline.version_history
    }

@router.post("/finetune")
async def trigger_local_model_finetune(req: FineTuneRequest):
    return training_pipeline.trigger_local_finetune(
        dataset_name=req.dataset_name,
        epochs=req.epochs,
        learning_rate=req.learning_rate
    )

@router.post("/rollback")
async def rollback_model_version(req: RollbackRequest):
    res = training_pipeline.rollback_version(req.target_version)
    if res["status"] == "FAILED":
        raise HTTPException(status_code=400, detail=res["error"])
    return res
