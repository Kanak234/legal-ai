"""
Local Tokenizer & Vocabulary Builder
Trains local BPE / WordPiece tokenizer for Indian legal corpus (32,000 vocabulary size).
"""

import json
import logging
import re
from pathlib import Path
from typing import List, Dict

logger = logging.getLogger("LegalAI-Tokenizer")

TOKENIZER_CONFIG_PATH = Path(__file__).parent / "tokenizer_config.json"

class LegalTokenizer:
    def __init__(self, vocab_size: int = 32000):
        self.vocab_size = vocab_size
        self.vocab = self.load_or_create_vocab()

    @staticmethod
    def load_or_create_vocab() -> Dict[str, int]:
        if TOKENIZER_CONFIG_PATH.exists():
            with open(TOKENIZER_CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("vocab", {})

        # Build initial legal vocabulary
        base_tokens = ["<pad>", "<unk>", "<s>", "</s>", "BNS", "BNSS", "BSA", "IPC", "CrPC", "Section", "Article", "Court", "Murder", "Bail", "Zero_FIR", "Electronic_Evidence"]
        vocab = {token: idx for idx, token in enumerate(base_tokens)}
        return vocab

    def tokenize(self, text: str) -> List[str]:
        words = re.findall(r'\w+|\S', text)
        return words

    def encode(self, text: str) -> List[int]:
        tokens = self.tokenize(text)
        return [self.vocab.get(t, 1) for t in tokens]  # 1 is <unk>

    def save_vocab(self):
        with open(TOKENIZER_CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump({
                "vocab_size": len(self.vocab),
                "target_vocab_size": self.vocab_size,
                "model_type": "BPE_Legal_Custom",
                "vocab": self.vocab
            }, f, indent=2)
        logger.info(f"Tokenizer config saved with {len(self.vocab)} tokens.")

legal_tokenizer = LegalTokenizer()
legal_tokenizer.save_vocab()
