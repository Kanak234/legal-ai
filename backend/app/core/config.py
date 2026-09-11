import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LegalAI Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-legalai-jwt-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Databases
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./legalai.db")
    SYNC_DATABASE_URL: str = os.getenv("DATABASE_URL_SYNC", "sqlite:///./legalai.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "qdrant")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "legalai_secret_password")

    AI_SERVICE_URL: str = os.getenv("AI_SERVICE_URL", "http://ai-service:8001")
    OCR_SERVICE_URL: str = os.getenv("OCR_SERVICE_URL", "http://ocr-service:8002")

    # Privacy & AI Independence Controls
    OFFLINE_MODE: bool = True
    ALLOW_EXTERNAL_APIS: bool = False
    DISABLE_TELEMETRY: bool = True
    LOCAL_LLM_PROVIDER: str = os.getenv("LOCAL_LLM_PROVIDER", "ollama_llama.cpp")

    model_config = {"case_sensitive": True}

settings = Settings()
