import json
import logging
from pathlib import Path
from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.models.legal import Act, Section, CrossMapping, Judgment
from app.core.security import get_password_hash

logger = logging.getLogger("LegalAI-Seed")
DATASETS_DIR = Path(__file__).parent / "datasets"

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        try:
            # 1. Create Default Admin User
            stmt = select(User).where(User.email == "admin@legalai.org")
            result = await session.execute(stmt)
            admin = result.scalars().first()
            if not admin:
                admin_user = User(
                    email="admin@legalai.org",
                    full_name="LegalAI Admin",
                    hashed_password=get_password_hash("admin123"),
                    role="Admin",
                    organization="LegalAI Foundation",
                    is_superuser=True
                )
                session.add(admin_user)
                logger.info("Admin user created: admin@legalai.org")

            # 2. Seed Statutes
            statutes_file = DATASETS_DIR / "indian_statutes.json"
            if statutes_file.exists():
                with open(statutes_file, "r", encoding="utf-8") as f:
                    statutes = json.load(f)
                    for s in statutes:
                        stmt = select(Act).where(Act.act_id == s["act_id"])
                        res = await session.execute(stmt)
                        if not res.scalars().first():
                            act = Act(
                                act_id=s["act_id"],
                                act_name=s["act_name"],
                                short_name=s["short_name"],
                                category=s["category"],
                                enactment_year=s["enactment_year"]
                            )
                            session.add(act)
                            for sec in s.get("sections", []):
                                section_obj = Section(
                                    act_id=s["act_id"],
                                    section_number=sec["section_number"],
                                    title=sec["title"],
                                    content=sec["content"],
                                    explanation=sec.get("explanation"),
                                    ipc_corresponding=sec.get("ipc_corresponding"),
                                    cognizable=sec.get("cognizable", True),
                                    bailable=sec.get("bailable", False),
                                    compoundable=sec.get("compoundable", False),
                                    keywords=sec.get("keywords", [])
                                )
                                session.add(section_obj)

            # 3. Seed Cross Mappings
            mappings_file = DATASETS_DIR / "cross_mappings.json"
            if mappings_file.exists():
                with open(mappings_file, "r", encoding="utf-8") as f:
                    mapping_groups = json.load(f)
                    for group in mapping_groups:
                        for m in group.get("mappings", []):
                            old_sec = m.get("ipc") or m.get("crpc") or m.get("iea")
                            new_sec = m.get("bns") or m.get("bnss") or m.get("bsa")
                            stmt = select(CrossMapping).where(
                                CrossMapping.old_section == old_sec,
                                CrossMapping.new_section == new_sec
                            )
                            res = await session.execute(stmt)
                            if not res.scalars().first():
                                cm = CrossMapping(
                                    old_act=group["old_act"],
                                    new_act=group["new_act"],
                                    old_section=old_sec,
                                    new_section=new_sec,
                                    subject=m["subject"],
                                    key_change=m.get("key_change")
                                )
                                session.add(cm)

            # 4. Seed Judgments
            judgments_file = DATASETS_DIR / "sample_judgments.json"
            if judgments_file.exists():
                with open(judgments_file, "r", encoding="utf-8") as f:
                    judgments = json.load(f)
                    for j in judgments:
                        stmt = select(Judgment).where(Judgment.case_id == j["case_id"])
                        res = await session.execute(stmt)
                        if not res.scalars().first():
                            judgment_obj = Judgment(
                                case_id=j["case_id"],
                                case_title=j["case_title"],
                                citation=j["citation"],
                                court=j["court"],
                                bench=j.get("bench"),
                                year=j["year"],
                                judges=j.get("judges", []),
                                act_references=j.get("act_references", []),
                                summary=j["summary"],
                                ratio_decidendi=j.get("ratio_decidendi"),
                                outcome=j.get("outcome"),
                                disposition=j.get("disposition"),
                                keywords=j.get("keywords", [])
                            )
                            session.add(judgment_obj)

            await session.commit()
            logger.info("Database seeding completed successfully!")
        except Exception as e:
            logger.error(f"Seeding warning/error: {e}")
