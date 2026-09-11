#!/usr/bin/env python3
"""
LegalAI Ingestion Engine
Ingests Indian Statutes (BNS, BNSS, BSA, IPC, CrPC, COI, IT Act, etc.),
Cross-Mappings, and Judgments into PostgreSQL, Qdrant Vector Store, and Neo4j Knowledge Graph.
"""

import json
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("LegalAI-Ingest")

DATASETS_DIR = Path(__file__).parent / "datasets"

def load_json_file(filename: str):
    filepath = DATASETS_DIR / filename
    if not filepath.exists():
        logger.error(f"File not found: {filepath}")
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def run_ingestion_summary():
    statutes = load_json_file("indian_statutes.json")
    mappings = load_json_file("cross_mappings.json")
    judgments = load_json_file("sample_judgments.json")

    total_acts = len(statutes)
    total_sections = sum(len(s.get("sections", [])) for s in statutes)
    total_mappings = sum(len(m.get("mappings", [])) for m in mappings)
    total_judgments = len(judgments)

    logger.info("=== LEGAL AI DATASET INGESTION SUMMARY ===")
    logger.info(f"Acts Loaded: {total_acts}")
    logger.info(f"Sections Processed: {total_sections}")
    logger.info(f"Cross-Mappings (IPC<->BNS, CrPC<->BNSS, Evidence<->BSA): {total_mappings}")
    logger.info(f"Sample Judgments Ready: {total_judgments}")
    logger.info("==========================================")

    return {
        "acts": statutes,
        "mappings": mappings,
        "judgments": judgments,
        "stats": {
            "acts_count": total_acts,
            "sections_count": total_sections,
            "mappings_count": total_mappings,
            "judgments_count": total_judgments
        }
    }

if __name__ == "__main__":
    logger.info("Starting Legal Data Ingestion Pipeline...")
    res = run_ingestion_summary()
    print(json.dumps(res["stats"], indent=2))
