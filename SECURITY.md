# Security Policy — LegalAI Platform

## Supported Versions

| Version | Supported          | Security Maintenance |
| ------- | ------------------ | -------------------- |
| 1.0.x   | :white_check_mark: | Active               |
| < 1.0   | :x:                | End of Life          |

---

## Threat Model & Architecture Security Controls

LegalAI is designed for mission-critical legal research, statutory cross-mapping, and document drafting under Indian criminal and civil law (Bharatiya Nyaya Sanhita 2023, Bharatiya Nagarik Suraksha Sanhita 2023, Bharatiya Sakshya Adhiniyam 2023, and the Constitution of India).

### 1. Legal Disclaimer & Liability Boundary
- **Non-Advisory Principle**: All analysis, draft documents, and citation retrieval provided by LegalAI are generated for research and decision-support purposes only. They do not constitute formal legal advice, representation, or certified court submissions.
- **Mandatory Human-in-the-Loop**: Generated drafts (e.g., bail petitions, legal notices) require review and signature by an enrolled advocate or legal practitioner.

### 2. Prompt Injection & Anti-Hallucination Controls
- **Persona Scoping**: Strict system prompts constrain LLM responses to verified statutory provisions.
- **Grounding & Citation Verification**: Statutory citations are cross-referenced against authoritative gazette notifications before surfacing to users.
- **Input Sanitization**: Query inputs are stripped of malicious prompt-override sequences.

### 3. SQL Injection Prevention
- **100% Parameterized Queries**: All database interactions use SQLAlchemy ORM or parameterized prepared statements (`AsyncSession`).
- **No Raw Dynamic String Interpolation**: Direct SQL concatenation is strictly forbidden across all API endpoints.

### 4. Air-Gapped & Zero-Telemetry Privacy Policy
- **Offline-First Architecture**: LegalAI runs fully self-contained on local infrastructure without external cloud API dependencies.
- **Zero Third-Party Telemetry**: No user queries, draft contents, or uploaded documents are transmitted to external servers.

### 5. Authentication & Access Control
- **Cryptographic Hashing**: User credentials are protected using salted `bcrypt` algorithms.
- **Stateless Authentication**: JWT tokens (HS256) enforce role-based access control (RBAC) across distinct personas (Law Student, Advocate, Senior Advocate, Judge, Citizen, Admin).

---

## Reporting a Vulnerability

If you discover a security vulnerability in LegalAI, please report it privately:

1. **Email**: Send detailed vulnerability reports to `security@kanak.dev` or via GitHub Private Vulnerability Reporting.
2. **Details to Include**:
   - Component affected (Backend, AI Service, OCR Service, Frontend)
   - Step-by-step reproduction instructions or proof-of-concept (PoC)
   - Potential impact and threat classification
3. **Response SLA**:
   - Initial acknowledgement: within **24 hours**
   - Triage and mitigation assessment: within **48 hours**
   - Patch release: within **7 business days** for high/critical severity issues

Please do NOT create public GitHub issues for undisclosed security vulnerabilities.
