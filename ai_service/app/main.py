from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from app.core.embeddings import embedding_engine
from app.core.rag_chain import rag_chain

app = FastAPI(title="LegalAI Service", version="1.0.0")

class EmbeddingRequest(BaseModel):
    text: str

class RAGGenerationRequest(BaseModel):
    query: str
    persona: str = "Advocate"
    act_filter: Optional[str] = None

@app.get("/health")
def health():
    return {"status": "HEALTHY", "service": "LegalAI AI Microservice"}

@app.post("/embeddings/generate")
def generate_embeddings(req: EmbeddingRequest):
    vec = embedding_engine.encode(req.text)
    return {"dimension": len(vec), "vector": vec}

@app.post("/rag/generate")
def generate_rag_response(req: RAGGenerationRequest):
    return rag_chain.process_query(req.query, req.persona, req.act_filter)
