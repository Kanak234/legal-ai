from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Act(Base):
    __tablename__ = "acts"

    id = Column(Integer, primary_key=True, index=True)
    act_id = Column(String, unique=True, index=True, nullable=False)
    act_name = Column(String, nullable=False)
    short_name = Column(String, index=True)
    category = Column(String, index=True)
    enactment_year = Column(Integer)
    description = Column(Text, nullable=True)

class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    act_id = Column(String, ForeignKey("acts.act_id"), nullable=False)
    section_number = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    ipc_corresponding = Column(String, nullable=True)
    cognizable = Column(Boolean, default=True)
    bailable = Column(Boolean, default=False)
    compoundable = Column(Boolean, default=False)
    keywords = Column(JSON, default=list)

class CrossMapping(Base):
    __tablename__ = "cross_mappings"

    id = Column(Integer, primary_key=True, index=True)
    old_act = Column(String, nullable=False)
    new_act = Column(String, nullable=False)
    old_section = Column(String, index=True, nullable=False)
    new_section = Column(String, index=True, nullable=False)
    subject = Column(String, nullable=False)
    key_change = Column(Text, nullable=True)

class Judgment(Base):
    __tablename__ = "judgments"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    case_title = Column(String, nullable=False)
    citation = Column(String, index=True, nullable=False)
    court = Column(String, index=True, nullable=False)
    bench = Column(String, nullable=True)
    year = Column(Integer, index=True, nullable=False)
    judges = Column(JSON, default=list)
    act_references = Column(JSON, default=list)
    summary = Column(Text, nullable=False)
    ratio_decidendi = Column(Text, nullable=True)
    outcome = Column(String, nullable=True)
    disposition = Column(Text, nullable=True)
    keywords = Column(JSON, default=list)

class LegalDraft(Base):
    __tablename__ = "legal_drafts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    draft_type = Column(String, index=True, nullable=False) # e.g. Notice, Petition, Bail, RTI, Contract
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    input_params = Column(JSON, default=dict)
    generated_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
