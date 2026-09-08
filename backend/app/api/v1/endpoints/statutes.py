from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.db.session import get_db
from app.models.legal import Act, Section, CrossMapping
from app.schemas.legal import ActResponse, SectionResponse, CrossMappingResponse

router = APIRouter()

@router.get("/acts", response_model=List[ActResponse])
async def list_acts(db: AsyncSession = Depends(get_db)):
    stmt = select(Act)
    res = await db.execute(stmt)
    return [ActResponse.model_validate(a) for a in res.scalars().all()]

@router.get("/acts/{act_id}/sections", response_model=List[SectionResponse])
async def get_act_sections(act_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Section).where(Section.act_id == act_id)
    res = await db.execute(stmt)
    sections = res.scalars().all()
    return [SectionResponse.model_validate(s) for s in sections]

@router.get("/sections/{section_id}", response_model=SectionResponse)
async def get_section_by_id(section_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Section).where(Section.id == section_id)
    res = await db.execute(stmt)
    sec = res.scalars().first()
    if not sec:
        raise HTTPException(status_code=404, detail="Section not found")
    return SectionResponse.model_validate(sec)

@router.get("/mappings", response_model=List[CrossMappingResponse])
async def list_cross_mappings(
    old_act: Optional[str] = None,
    new_act: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(CrossMapping)
    if old_act:
        stmt = stmt.where(CrossMapping.old_act.ilike(f"%{old_act}%"))
    if new_act:
        stmt = stmt.where(CrossMapping.new_act.ilike(f"%{new_act}%"))
    res = await db.execute(stmt)
    return [CrossMappingResponse.model_validate(m) for m in res.scalars().all()]
