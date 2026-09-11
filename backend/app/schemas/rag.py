from pydantic import BaseModel
from typing import List, Optional

class RAGQuery(BaseModel):
    query: str
    persona: str = "Advocate"  # Law Student, Advocate, Senior Advocate, Judge, Police, Citizen, etc.
    act_filter: Optional[str] = None
    temperature: float = 0.2

class CitationItem(BaseModel):
    source_title: str
    citation: str
    section_or_article: str
    snippet: str

class RAGResponse(BaseModel):
    answer: str
    persona: str
    confidence_score: float  # e.g., 94.5%
    citations: List[CitationItem] = []
    reasoning_steps: List[str] = []
    hallucination_warning: bool = False
    disclaimer: str = "AI generated legal information. Consult a qualified advocate before formal submission."
