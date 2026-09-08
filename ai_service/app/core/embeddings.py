import logging
import numpy as np

logger = logging.getLogger("LegalAI-Embeddings")

class EmbeddingEngine:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.model_loaded = False
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            self.model_loaded = True
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer ({e}). Using normalized feature encoder fallback.")
            self.model = None

    def encode(self, text: str) -> list[float]:
        if self.model_loaded and self.model:
            vec = self.model.encode(text)
            return vec.tolist()
        
        # Fallback deterministic 384-dim normalized hashing vector
        rng = np.random.RandomState(abs(hash(text)) % (2**32))
        vec = rng.randn(self.dimension)
        norm = np.linalg.norm(vec)
        vec = vec / (norm + 1e-9)
        return vec.tolist()

embedding_engine = EmbeddingEngine()
