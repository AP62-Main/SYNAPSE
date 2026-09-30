#!/usr/bin/env bash
# Render Build Script for Synapse ML Student Clustering
set -e

echo "==========================================="
echo "  Starting Synapse ML Build on Render"
echo "==========================================="

# Determine directory structure
if [ -d "student-clustering" ]; then
    PROJECT_ROOT="."
    APP_DIR="student-clustering"
elif [ -d "backend" ] && [ -d "frontend" ]; then
    PROJECT_ROOT=".."
    APP_DIR="."
else
    PROJECT_ROOT="."
    APP_DIR="student-clustering"
fi

echo "Project root: $(pwd)"
echo "App directory: $APP_DIR"

# 1. Install Python dependencies
echo "--- Installing Python dependencies ---"
if [ -f "requirements.txt" ]; then
    pip install --no-cache-dir -r requirements.txt
elif [ -f "$APP_DIR/requirements.txt" ]; then
    pip install --no-cache-dir -r "$APP_DIR/requirements.txt"
fi

# 2. Check and ensure Node.js & npm are available
echo "--- Checking Node.js and NPM ---"
if ! command -v npm &> /dev/null || ! command -v node &> /dev/null; then
    echo "Node.js/npm not found in runtime. Installing via nodeenv..."
    pip install nodeenv
    nodeenv -p --node=20.18.0
fi

echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"

# 3. Build React Frontend
echo "--- Building React Frontend ---"
cd "$APP_DIR/frontend"
npm install
npm run build
cd - > /dev/null

# 4. Verify distribution folder
if [ -d "$APP_DIR/frontend/dist" ]; then
    echo "Frontend build successfully created at $APP_DIR/frontend/dist"
else
    echo "Error: Frontend dist directory was not created!"
    exit 1
fi

echo "==========================================="
echo "  Build Completed Successfully!"
echo "==========================================="
