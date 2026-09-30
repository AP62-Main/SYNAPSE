# SYNAPSE — Behavioral Cohort Intelligence Engine

An enterprise-grade Unsupervised Machine Learning platform designed to automatically segment student learning patterns and engagement behaviors without reliance on pre-existing academic labels.

## Problem Statement

Can we identify distinct student learning behaviors without relying on pre-existing labels (grades)? Do these identified clusters genuinely represent *different learning patterns*, or are they just grouping students by their academic performance?

This project uses K-Means and Hierarchical Agglomerative Clustering to dynamically discover student segments, and analyzes them against academic performance to answer the core case-study questions.

## Features & Architecture

- **Machine Learning Pipeline:** Imputes missing values, scales features, calculates optimal K using the Silhouette Score, trains K-Means, and compares against Hierarchical Clustering using the Adjusted Rand Index.
- **PCA Visualization:** Reduces the 5D feature space to 3D for interactive visualization.
- **Behavior vs Performance Analysis:** Specifically runs dual clustering (with and without Assessment Score) to prove the validity of behavioral patterns.
- **Modern UI:** Built with React, Vite, TailwindCSS (Dark Mode), and Plotly, mimicking a professional SaaS analytics dashboard.
- **Backend API:** FastAPI server to serve EDA data, dynamically generated cluster descriptions, and predictions.
- **Interactive Predictor:** A web form that takes a new student's behavioral metrics, runs them through the saved Pipeline + Model, and outputs their predicted cluster, centroid distance, and a tailored support recommendation.

## Directory Structure

- `/ml`: Model training and dataset generation scripts.
- `/data`: Contains the synthesized `synthetic_students.csv`.
- `/models`: Saved `.joblib` pipelines, models, and generated JSON metrics for the API.
- `/backend`: FastAPI Python server (`main.py`).
- `/frontend`: React + Vite application.

## Installation & Setup

1. **Prerequisites:** Python 3.10+ and Node.js (npm).
2. **Setup Python Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   ```

## How to Run

1. **Train the ML Models (if not already trained):**
   ```bash
   source venv/bin/activate
   python ml/generate_data.py   # Generates dataset
   python ml/train_model.py     # Trains models & saves artifacts
   ```

2. **Start the Backend API:**
   Open a terminal and run:
   ```bash
   source venv/bin/activate
   uvicorn backend.main:app --reload
   ```

3. **Start the Frontend UI:**
   Open a second terminal and run:
   ```bash
   cd frontend
   npm run dev
   ```

4. **View the Dashboard:** Open `http://localhost:5173` in your browser.

## Limitations & Ethics
- K-Means algorithm relies on spherical clustering assumptions, which may not always capture complex behavioral topologies.
- Clustering models are supportive diagnostic tools, not deterministic profiles. They should not be used as the sole basis for academic grading or punitive actions.

## Future Improvements
- Implement DBSCAN to handle noisy, non-spherical clusters.
- Add temporal series analysis (e.g., how engagement changes week-over-week).
