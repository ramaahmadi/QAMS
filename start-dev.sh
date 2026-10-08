#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but not installed."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required but not installed."
  exit 1
fi

if curl -sf http://localhost:3001/api/dashboard >/dev/null 2>&1; then
  echo "Backend already running on http://localhost:3001"
else
  echo "Starting QAMS backend on http://localhost:3001"
  node backend/api/server.js > /tmp/qams-backend.log 2>&1 &
fi

if curl -sf http://localhost:8000 >/dev/null 2>&1; then
  echo "Frontend already running on http://localhost:8000"
else
  echo "Starting frontend on http://localhost:8000"
  python3 -m http.server 8000 > /tmp/qams-frontend.log 2>&1 &
fi

echo ""
echo "Demo accounts:"
echo "  Admin      => admin / admin123"
echo "  QA Officer => qao / qao123"
echo "  Faculty    => faculty / faculty123"
echo ""
echo "Open http://localhost:8000"
