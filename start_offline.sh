#!/bin/bash
# ============================================================
#  LegalAI Platform — Offline Startup Script
#  Run this to start both Backend + Frontend without Docker
# ============================================================

set -e

BACKEND_DIR="$(cd "$(dirname "$0")/backend" && pwd)"
FRONTEND_DIR="$(cd "$(dirname "$0")/frontend" && pwd)"
VENV_PACKAGES="$BACKEND_DIR/venv_packages"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║     LegalAI Platform — Offline Mode Startup          ║"
echo "║     Zero Cloud APIs | Zero Docker Required            ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Kill existing processes on ports 8000 and 3000
echo "🔧 Cleaning up existing processes..."
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
sleep 1

# Start Backend
echo "🚀 Starting Offline Backend (FastAPI + SQLite)..."
cd "$BACKEND_DIR"
PYTHONPATH="$VENV_PACKAGES" python3 run_local.py &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 3

# Verify backend
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Backend: http://localhost:8000 — HEALTHY"
else
    echo "   ⏳ Backend starting... (waiting 3 more seconds)"
    sleep 3
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "   ✅ Backend: http://localhost:8000 — HEALTHY"
    else
        echo "   ⚠️  Backend may still be loading. Check: http://localhost:8000/docs"
    fi
fi

# Start Frontend
echo ""
echo "🚀 Starting Frontend (Next.js)..."
cd "$FRONTEND_DIR"
BACKEND_URL="http://localhost:8000" npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 4

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  🌐 Frontend:  http://localhost:3000                 ║"
echo "║  🔌 Backend:   http://localhost:8000                 ║"
echo "║  📚 API Docs:  http://localhost:8000/docs            ║"
echo "║  🔒 Mode: FULLY OFFLINE — Zero Cloud APIs            ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Press Ctrl+C to stop all services."
echo ""

# Keep running
wait $BACKEND_PID
