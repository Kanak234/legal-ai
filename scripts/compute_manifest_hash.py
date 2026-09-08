#!/usr/bin/env python3
"""
Computes the actual cryptographic SHA-256 hash of AUDIT_MANIFEST.json and updates its integrity block.
"""

import json
import hashlib
from pathlib import Path

MANIFEST_PATH = Path(__file__).parent.parent / "AUDIT_MANIFEST.json"

def update_manifest_integrity():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Set signature metadata properly
    data["integrity"]["signature_status"] = "NOT_SIGNED"
    data["integrity"]["signature_algorithm"] = "HMAC-SHA256"
    data["integrity"]["signature"] = None

    # Calculate actual SHA-256 hash of content excluding manifest_hash
    data["integrity"]["manifest_hash"] = "HASH_CALCULATION_PENDING"
    raw_bytes = json.dumps(data, indent=2, sort_keys=True).encode("utf-8")
    actual_hash = f"sha256:{hashlib.sha256(raw_bytes).hexdigest()}"

    data["integrity"]["manifest_hash"] = actual_hash

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"[✓] Computed Actual SHA-256 Manifest Hash: {actual_hash}")
    return actual_hash

if __name__ == "__main__":
    update_manifest_integrity()
