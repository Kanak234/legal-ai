from fastapi import APIRouter
from app.api.v1.endpoints import auth, search, statutes, rag, drafting, analytics, ocr, model_manager, training, graphql_api

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(search.router, prefix="/search", tags=["Hybrid Search"])
api_router.include_router(statutes.router, prefix="/statutes", tags=["Statutes & Sections"])
api_router.include_router(rag.router, prefix="/rag", tags=["RAG AI Assistant"])
api_router.include_router(drafting.router, prefix="/drafting", tags=["Document Drafting"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & Heatmaps"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR Document Processing"])
api_router.include_router(model_manager.router, prefix="/models", tags=["Model Manager"])
api_router.include_router(training.router, prefix="/training", tags=["Autonomous Training Pipeline"])
api_router.include_router(graphql_api.router, prefix="/graphql", tags=["GraphQL Endpoint"])
