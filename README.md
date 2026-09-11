# LegalAI - Enterprise AI Legal Intelligence Platform

[![CI](https://github.com/Kanak234/legal-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Kanak234/legal-ai/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Kanak234/legal-ai/actions/workflows/codeql.yml/badge.svg)](https://github.com/Kanak234/legal-ai/actions/workflows/codeql.yml)
![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.13-blue)
![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**LegalAI** is a fully containerized, self-improving, offline-capable AI Legal Research and Legal Analytics Platform engineered for the **Indian Legal System** (Constitution of India, Bharatiya Nyaya Sanhita 2023 [BNS], Bharatiya Nagarik Suraksha Sanhita 2023 [BNSS], Bharatiya Sakshya Adhiniyam 2023 [BSA], Indian Penal Code 1860 [IPC], Code of Criminal Procedure 1973 [CrPC], Indian Evidence Act 1872 [IEA], Information Technology Act 2000, etc.).

---

## Key Capabilities

1. **Dual Deployment Modes**: Run fully offline with standalone SQLite + local embeddings in seconds, or deploy the full multi-service microservices stack via Docker Compose.
2. **14 Tailored User Persona Workflows**: Dedicated prompts & insights for Law Students, Advocates, Senior Advocates, Judges, Police/Investigators, Researchers, Citizens, Corporates, Legal Startups, etc.
3. **IPC ↔ BNS & CrPC ↔ BNSS Cross-Mapping**: Interactive side-by-side statute conversion and precedent transition tracking.
4. **Dense Vector + Sparse BM25 Hybrid Search**: Instant retrieval across statutes, sections, and landmark Supreme/High Court judgments.
5. **Continuous RAG Assistant**: Multi-step legal reasoning chain, source citation integrity check, confidence scoring (0-100%), and anti-hallucination verification matrix.
6. **Automated Legal Document Draft Studio**: Generate Bail Petitions under BNSS Sec 480, Legal Notices for Contract Breach, and RTI Applications.
7. **OCR Evidence Layout Analyzer**: Upload scanned FIR PDFs or witness statements for character extraction & entity detection.
8. **Neo4j Precedent Knowledge Graph**: Real-time graph visualization connecting Acts, Sections, Judgments, and Judicial Benches.
9. **Telemetry & Model Manager**: Live CPU/GPU/RAM monitoring, latency telemetry, and model benchmarking.

---

## Quick Start

### Option A: Fully Offline Mode (Zero Docker, Instant Startup)

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt
pip install aiosqlite email-validator

# 2. Start offline backend (SQLite + FastAPI)
python backend/run_local.py

# 3. Access Swagger API Docs
# http://localhost:8000/docs
```

Or run the bundled startup script:
```bash
bash start_offline.sh
```

### Option B: Full Microservice Stack (Docker Compose)

```bash
docker compose up --build
```

### Service Endpoints

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Neo4j Knowledge Graph Console**: [http://localhost:7474](http://localhost:7474) (Credentials: `neo4j` / `legalai_secret_password`)
- **Prometheus Telemetry**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboards**: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `admin`)

---

## Running Verification & Tests

The project includes an enterprise test suite with **89% statement coverage** and zero synthetic mock dependencies:

```bash
# Run full pytest suite with coverage enforcement
pytest -v --cov=backend/app --cov=ai_service/app --cov-report=term-missing --cov-fail-under=80 tests/

# Run standalone backend suite
python tests/run_tests.py

# Run platform unit tests
python -m unittest tests/test_platform.py

# Run security SAST audit
python tests/security_audit.py

# Run direct dataset and model checks
python tests/test_direct_imports.py

# Run code style and linter checks
ruff check .
```

---

## System Architecture

```
                               ┌───────────────────────────────────────────────┐
                               │             Nginx Reverse Proxy               │
                               │                (Port 80/443)                  │
                               └──────┬─────────────────┬───────────────┬──────┘
                                      │                 │               │
                                      ▼                 ▼               ▼
                               ┌─────────────┐   ┌─────────────┐  ┌─────────────┐
                               │   Next.js   │   │ FastAPI API │  │ Monitoring  │
                               │  Frontend   │   │   Gateway   │  │  (Grafana/  │
                               │  (Port 3000)│   │  (Port 8000)│  │ Prometheus) │
                               └─────────────┘   └──────┬──────┘  └─────────────┘
                                                        │
                      ┌─────────────────────────────────┼─────────────────────────────────┐
                      │                                 │                                 │
                      ▼                                 ▼                                 ▼
             ┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
             │   AI Micro-     │               │   OCR & Document│               │  Celery Worker  │
             │     service     │               │    Processor    │               │  & Task Queue   │
             │(RAG, Embeddings,│               │ (PDF, Tesseract,│               │ (Async Tasks &  │
             │ Re-ranking, Graph│              │ Document Parsing)│              │ Continuous Eval)│
             └────────┬────────┘               └────────┬────────┘               └────────┬────────┘
                      │                                 │                                 │
         ┌────────────┴─────────────┬───────────────────┴─────────────┬───────────────────┴────────────┐
         │                          │                                 │                                │
         ▼                          ▼                                 ▼                                ▼
┌─────────────────┐        ┌─────────────────┐               ┌─────────────────┐              ┌─────────────────┐
│ PostgreSQL      │        │ Qdrant Vector   │               │ Neo4j Knowledge │              │ Redis Cache &   │
│ (Metadata & Rel)│        │ Database        │               │ Graph Database  │              │ Message Broker  │
└─────────────────┘        └─────────────────┘               └─────────────────┘              └─────────────────┘
```

---

## Security Policy & Legal Disclaimer

- **Legal Disclaimer**: LegalAI is an educational and analytical research platform. AI-generated responses, drafts, and citations are generated for decision-support and do NOT constitute formal legal advice, representation, or certified court submissions.
- **Security Policy**: For threat models, vulnerability reporting procedures, and disclosure policies, see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
