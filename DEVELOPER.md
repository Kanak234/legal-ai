# Developer Guide - LegalAI Platform

## Directory Structure

```
.
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── prometheus/
│   └── prometheus.yml
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # REST endpoints (auth, search, statutes, rag, drafting, analytics, ocr, models)
│   │   ├── core/              # Config, Security, JWT
│   │   ├── db/                # Session, Models, Seed Engine
│   │   ├── models/            # SQLAlchemy DB models
│   │   └── schemas/           # Pydantic schemas
│   └── Dockerfile
├── ai_service/                # SentenceTransformers, Dense Vector & RAG Chain Engine
├── ocr_service/               # Tesseract OCR & PDF Evidence Parser
├── data_pipeline/
│   ├── ingest_legal_data.py
│   └── datasets/              # Statutes, Cross-Mappings, Judgments JSON files
├── worker/                    # Celery Background Worker
├── frontend/                  # Next.js 14, React 18, Tailwind CSS, Recharts
└── tests/                     # Pytest suite for Backend & AI Microservice
```

## Running Local Unit & Integration Tests

To run pytest tests locally:

```bash
# Install backend test requirements
cd backend
pip install -r requirements.txt pytest httpx

# Execute test suite
pytest ../tests/backend/test_api.py ../tests/ai_service/test_ai.py
```

## Adding New Statutory Datasets

1. Open `data_pipeline/datasets/indian_statutes.json`.
2. Append new Act or Section objects adhering to the JSON schema.
3. Restart backend container to trigger auto-seeding:

```bash
docker compose restart backend-api
```
