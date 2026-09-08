from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class SectionResponse(BaseModel):
    id: int
    act_id: str
    section_number: str
    title: str
    content: str
    explanation: Optional[str] = None
    ipc_corresponding: Optional[str] = None
    cognizable: bool
    bailable: bool
    compoundable: bool
    keywords: List[str] = []

    class Config:
        from_attributes = True

class ActResponse(BaseModel):
    id: int
    act_id: str
    act_name: str
    short_name: str
    category: str
    enactment_year: int

    class Config:
        from_attributes = True

class CrossMappingResponse(BaseModel):
    id: int
    old_act: str
    new_act: str
    old_section: str
    new_section: str
    subject: str
    key_change: Optional[str] = None

    class Config:
        from_attributes = True

class JudgmentResponse(BaseModel):
    id: int
    case_id: str
    case_title: str
    citation: str
    court: str
    bench: Optional[str] = None
    year: int
    judges: List[str] = []
    act_references: List[str] = []
    summary: str
    ratio_decidendi: Optional[str] = None
    outcome: Optional[str] = None
    disposition: Optional[str] = None
    keywords: List[str] = []

    class Config:
        from_attributes = True

class SearchQuery(BaseModel):
    query: str
    act_id: Optional[str] = None
    court: Optional[str] = None
    year: Optional[int] = None
    limit: int = 10

class SearchResult(BaseModel):
    statutes: List[SectionResponse] = []
    judgments: List[JudgmentResponse] = []
    mappings: List[CrossMappingResponse] = []
    total: int = 0

class DraftRequest(BaseModel):
    draft_type: str  # e.g., "Bail Petition", "Legal Notice", "RTI Application", "Contract", "FIR Breakdown"
    petitioner_name: str
    respondent_name: str
    facts: str
    sections_invoked: List[str] = []
    court_name: Optional[str] = "High Court of Judicature"
    extra_details: Optional[Dict[str, Any]] = {}

class DraftResponse(BaseModel):
    title: str
    draft_type: str
    generated_content: str
    sections_cited: List[str]
    disclaimer: str
