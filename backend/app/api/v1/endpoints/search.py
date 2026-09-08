from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from typing import Optional
from app.db.session import get_db
from app.models.legal import Section, Judgment, CrossMapping
from app.schemas.legal import SearchResult, SectionResponse, JudgmentResponse, CrossMappingResponse

router = APIRouter()

@router.get("", response_model=SearchResult)
async def hybrid_search(
    q: str = Query(..., min_length=2, description="Search query string"),
    act_id: Optional[str] = None,
    court: Optional[str] = None,
    year: Optional[int] = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    query_term = f"%{q}%"
    
    # 1. Search Sections
    sec_stmt = select(Section).where(
        or_(
            Section.title.ilike(query_term),
            Section.content.ilike(query_term),
            Section.section_number.ilike(query_term),
            Section.explanation.ilike(query_term)
        )
    )
    if act_id:
        sec_stmt = sec_stmt.where(Section.act_id == act_id)
    sec_stmt = sec_stmt.limit(limit)
    sec_res = await db.execute(sec_stmt)
    sections = sec_res.scalars().all()

    # 2. Search Judgments
    j_stmt = select(Judgment).where(
        or_(
            Judgment.case_title.ilike(query_term),
            Judgment.summary.ilike(query_term),
            Judgment.citation.ilike(query_term),
            Judgment.ratio_decidendi.ilike(query_term)
        )
    )
    if court:
        j_stmt = j_stmt.where(Judgment.court.ilike(f"%{court}%"))
    if year:
        j_stmt = j_stmt.where(Judgment.year == year)
    j_stmt = j_stmt.limit(limit)
    j_res = await db.execute(j_stmt)
    judgments = j_res.scalars().all()

    # 3. Search Cross Mappings
    m_stmt = select(CrossMapping).where(
        or_(
            CrossMapping.old_section.ilike(query_term),
            CrossMapping.new_section.ilike(query_term),
            CrossMapping.subject.ilike(query_term)
        )
    ).limit(limit)
    m_res = await db.execute(m_stmt)
    mappings = m_res.scalars().all()

    sec_responses = [SectionResponse.model_validate(s) for s in sections]
    j_responses = [JudgmentResponse.model_validate(j) for j in judgments]
    m_responses = [CrossMappingResponse.model_validate(m) for m in mappings]

    total = len(sec_responses) + len(j_responses) + len(m_responses)

    return SearchResult(
        statutes=sec_responses,
        judgments=j_responses,
        mappings=m_responses,
        total=total
    )
