from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.legal import LegalDraft
from app.schemas.legal import DraftRequest, DraftResponse

router = APIRouter()

TEMPLATES = {
    "Bail Petition": """IN THE COURT OF THE HON'BLE DISTRICT & SESSIONS JUDGE AT {court_name}

BAIL APPLICATION NO. ______ OF 2026

IN THE MATTER OF:
{petitioner_name}                                    ...APPLICANT / ACCUSED
                                 VERSUS
STATE OF INDIA                                     ...RESPONDENT

APPLICATION FOR REGULAR BAIL UNDER SECTION 480 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 (CORRESPONDING TO SECTION 437/439 OF CrPC)

MOST RESPECTFULLY SHOWETH:

1. That the Applicant has been falsely implicated in connection with FIR No. ____/2026 registered for alleged offences under Sections: {sections_list}.

2. BRIEF FACTS:
   {facts}

3. GROUNDS FOR BAIL:
   a. That the Applicant is a law-abiding citizen with deep roots in society and no risk of flight.
   b. That the Applicant has cooperated fully with the investigation under Section 35 of BNSS 2023.
   c. That under Section 480 of BNSS 2023, the Applicant qualifies as a first-time undertrial eligible for bail.
   d. That no further custodial interrogation is required.

PRAYER:
It is respectfully prayed that this Hon'ble Court may be pleased to:
a. Release the Applicant on regular bail in FIR No. ____/2026;
b. Pass such other orders as deemed fit and proper in the interest of justice.

PLACE: ____________
DATE: ____________
ADVOCATE FOR THE APPLICANT
""",

    "Legal Notice": """LEGAL NOTICE FOR RECOVERY & CONTRACT BREACH

BY REGISTERED POST A.D. / E-MAIL

DATE: August 07, 2026

TO:
{respondent_name}

FROM:
{petitioner_name}
Through Counsel

SUBJECT: NOTICE FOR BREACH OF CONTRACT AND INTENTION TO INITIATE PROCEEDINGS UNDER SECTION 316 OF BHARATIYA NYAYA SANHITA (BNS), 2023

Sir / Madam,

Under instructions from my client {petitioner_name}, I hereby serve you with this Legal Notice:

1. STATEMENT OF FACTS:
   {facts}

2. STATUTORY BREACH:
   Your actions constitute criminal breach of trust under Section 316 of BNS 2023 and civil breach under the Indian Contract Act.

3. REQUISITION:
   You are hereby called upon to comply with the obligations / pay the outstanding sum within 15 days of receipt of this notice, failing which my client shall initiate formal civil and criminal litigation at your risk and cost.

COUNSEL FOR NOTICE ISSUER
""",

    "RTI Application": """APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

TO:
The Central Public Information Officer (CPIO)
{court_name}

1. FULL NAME OF APPLICANT: {petitioner_name}
2. ADDRESS FOR CORRESPONDENCE: [Applicant Address]

3. PARTICULAR OF INFORMATION REQUIRED:
   Subject Matter: {facts}
   Specific Documents: Certified copies of notifications, cause lists, orders in respect of {sections_list}.

4. PERIOD TO WHICH INFORMATION PERTAINS: 2024 - 2026

5. APPLICATION FEE: Rs. 10 paid herewith via Postal Order / Online Portal.

PLACE: ____________
DATE: ____________
APPLICANT SIGNATURE
"""
}

@router.post("/generate", response_model=DraftResponse)
async def generate_legal_draft(draft_in: DraftRequest, db: AsyncSession = Depends(get_db)):
    template = TEMPLATES.get(draft_in.draft_type, TEMPLATES["Bail Petition"])
    
    sections_str = ", ".join(draft_in.sections_invoked) if draft_in.sections_invoked else "Section 103, 316 BNS 2023"
    
    rendered_content = template.format(
        petitioner_name=draft_in.petitioner_name,
        respondent_name=draft_in.respondent_name,
        facts=draft_in.facts,
        court_name=draft_in.court_name or "High Court of Judicature",
        sections_list=sections_str
    )
    
    # Save draft to database
    draft_record = LegalDraft(
        title=f"{draft_in.draft_type} - {draft_in.petitioner_name}",
        draft_type=draft_in.draft_type,
        input_params=draft_in.model_dump(),
        generated_content=rendered_content
    )
    db.add(draft_record)
    await db.commit()
    
    return DraftResponse(
        title=f"{draft_in.draft_type} Draft",
        draft_type=draft_in.draft_type,
        generated_content=rendered_content,
        sections_cited=draft_in.sections_invoked or ["BNSS Section 480", "BNS Section 316"],
        disclaimer="Draft generated automatically by LegalAI. Mandatory verification by advocate required."
    )
