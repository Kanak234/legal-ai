# Changelog

All notable changes to the LegalAI Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-12

### Added
- **Production Hardening (C1–C9)**: Enterprise-grade readiness across build, test, lint, security, CI/CD, reliability, containerization, release automation, and documentation.
- **Test Suite & Coverage Enforcement**:
  - Expanded test suite covering backend authentication, statutes, search, RAG, drafting, analytics, OCR, model management, GraphQL, and training pipelines.
  - Reached **89% statement coverage** across `backend/app` and `ai_service/app` with a strict `>=80%` CI gate.
  - Zero synthetic mocks: all tests validate real SQLAlchemy models and offline AI engines.
- **Containerization & Deployment**:
  - Unprivileged multi-stage container builds in `Dockerfile` and `backend/Dockerfile` with non-root execution (`appuser:appgroup`).
  - Added native container health checks (`HEALTHCHECK`) verifying `/health` endpoint.
  - Added `.dockerignore` to streamline container context builds.
- **Security & Threat Model**:
  - Created `SECURITY.md` detailing Indian legal AI threat model, legal disclaimers, prompt injection mitigations, and parameterized SQL query enforcement.
  - Upgraded password hashing and verification to direct `bcrypt` implementation.
  - Default database configuration updated to local SQLite for zero-configuration, secure local execution.
- **CI/CD Automation**:
  - GitHub Actions CI matrix testing across Python 3.10, 3.11, 3.12, and 3.13.
  - CodeQL workflow (`.github/workflows/codeql.yml`) for automated vulnerability scanning.
  - Dependabot configuration (`.github/dependabot.yml`) for Pip, Docker, and GitHub Actions.
  - Automated release workflow with wheel packaging and SHA256 checksum generation.
  - Repository Guard workflow verifying project integrity.
- **Packaging & Standards**:
  - Created standard `pyproject.toml` with PEP 621 metadata, Ruff linter configurations, and coverage reporting rules.
