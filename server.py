"""
SatQuery AI — Root Production Server
Serves the Vite-built React SPA from dist/ and handles Remote Sensing AI API requests.
SIH 2026 Problem Statement 26167
"""

import os
import sys

# Ensure backend package paths are available
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "SatQueryAI", "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Switch working directory to backend so relative paths in models/scripts resolve cleanly
os.chdir(BACKEND_DIR)

port = int(os.environ.get("PORT", 8000))
import server

if __name__ == "__main__":
    server.run_server(port=port)
