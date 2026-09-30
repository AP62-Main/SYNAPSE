# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY student-clustering/frontend/package*.json ./
RUN npm install
COPY student-clustering/frontend/ ./
RUN npm run build

# Stage 2: Python Backend Runtime
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY student-clustering/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, data, models, and ml code
COPY student-clustering/backend/ ./backend/
COPY student-clustering/data/ ./data/
COPY student-clustering/models/ ./models/
COPY student-clustering/ml/ ./ml/

# Copy built frontend assets into the container
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (default 8000, Render/Railway injects PORT)
ENV PORT=8000
EXPOSE 8000

# Start server
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
