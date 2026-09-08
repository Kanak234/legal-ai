# LegalAI - Enterprise AI Legal Intelligence Platform

[![Docker Compose Ready](https://img.shields.io/badge/Docker%20Compose-v3.8-blue.svg)](file:///home/kanak07/Desktop/law/docker-compose.yml)
[![FastAPI Backend](https://img.shields.io/badge/FastAPI-v0.110.0-emerald.svg)](file:///home/kanak07/Desktop/law/backend)
[![Next.js Frontend](https://img.shields.io/badge/Next.js-v14.1.4-black.svg)](file:///home/kanak07/Desktop/law/frontend)
[![Indian Law Coverage](https://img.shields.io/badge/Indian%20Law-BNS%20%7C%20BNSS%20%7C%20BSA%20%7C%20IPC-gold.svg)](file:///home/kanak07/Desktop/law/data_pipeline/datasets)

**LegalAI** is a fully containerized, self-improving, offline-capable AI Legal Research and Legal Analytics Platform engineered for the **Indian Legal System** (Constitution of India, BNS 2023, BNSS 2023, BSA 2023, IPC 1860, CrPC 1973, Evidence Act 1872, IT Act 2000, Companies Act 2013, Consumer Protection Act, etc.).

---

## Key Capabilities

1. **One-Command Deployment**: Instant initialization via `docker compose up --build`. No manual installation of Python, Node, PostgreSQL, Redis, Qdrant, Neo4j, or CUDA required.
2. **14 Tailored User Persona Workflows**: Dedicated prompts & insights for Law Students, Advocates, Senior Advocates, Judges, Police/Investigators, Researchers, Citizens, Corporates, Legal Startups, etc.
3. **IPC ↔ BNS & CrPC ↔ BNSS Cross-Mapping**: Interactive side-by-side statute conversion and precedent transition tracking.
4. **Dense Vector + Sparse BM25 RRF Hybrid Search**: Instant retrieval across statutes, sections, and landmark Supreme/High Court judgments.
5. **Continuous RAG Assistant**: Multi-step legal reasoning chain, source citation integrity check, confidence scoring (0-100%), and zero-hallucination filters.
6. **Automated Legal Document Draft Studio**: Generate Bail Petitions under BNSS Sec 480, Legal Notices for Contract Breach, and RTI Applications.
7. **OCR Evidence Layout Analyzer**: Upload scanned FIR PDFs or witness statements for character extraction & entity detection.
8. **Neo4j Precedent Knowledge Graph**: Real-time graph visualization connecting Acts, Sections, Judgments, and Judicial Benches.
9. **Telemetry & Model Manager**: Live CPU/GPU/RAM monitoring, latency telemetry, and model benchmarking.

---

## One-Command Quick Start

```bash
# 1. Clone repository
git clone <repository_url>
cd law

# 2. Launch complete containerized stack
docker compose up --build
```

---

## Browser Service Endpoints

Once Docker initialization completes:

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Neo4j Knowledge Graph Console**: [http://localhost:7474](http://localhost:7474) (Credentials: `neo4j` / `legalai_secret_password`)
- **Prometheus Telemetry**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboards**: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `admin`)

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

## License & Disclaimer

Educational and legal intelligence platform. AI-generated responses provide analytical assistance and do not constitute formal legal advice.
