from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import joblib
import os
import numpy as np

app = FastAPI(title="Student Learning Pattern Segmentation API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load assets on startup
try:
    print("Loading models and results...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    
    # Try looking in cwd, then project_root
    def find_file(relative_path):
        if os.path.exists(relative_path):
            return relative_path
        alt = os.path.join(project_root, relative_path)
        if os.path.exists(alt):
            return alt
        raise FileNotFoundError(f"Could not locate {relative_path}")

    pipeline = joblib.load(find_file('models/pipeline.joblib'))
    kmeans_model = joblib.load(find_file('models/kmeans_model.joblib'))
    
    with open(find_file('models/analysis_results.json'), 'r') as f:
        analysis_results = json.load(f)
        
    df_raw = pd.read_csv(find_file('data/synthetic_students.csv'))
    print("Models and dataset loaded successfully!")
except Exception as e:
    print(f"Warning: Failed to load models or data. Ensure training script has run. Error: {e}")
    pipeline = None
    kmeans_model = None
    analysis_results = {}
    df_raw = pd.DataFrame()

class StudentData(BaseModel):
    study_hours: float
    attendance: float
    assignment_timing: float
    online_resource_usage: float
    assessment_score: float

@app.get("/api/health")
def health_check():
    return {"status": "ok", "models_loaded": pipeline is not None}

@app.get("/api/dataset")
def get_dataset(limit: int = 100):
    # Return a sample of the dataset
    return df_raw.head(limit).fillna("null").to_dict(orient="records")

@app.get("/api/statistics")
def get_statistics():
    return analysis_results.get('eda_stats', {})

@app.get("/api/clusters")
def get_clusters():
    return analysis_results.get('profiles', [])

@app.get("/api/elbow")
def get_elbow():
    return analysis_results.get('metrics', {})

@app.get("/api/pca")
def get_pca():
    return analysis_results.get('pca', {})

@app.get("/api/validation")
def get_validation():
    return {
        "optimal_k": analysis_results.get('optimal_k'),
        "ari_hierarchical": analysis_results.get('ari_hierarchical')
    }

@app.get("/api/behaviour-analysis")
def get_behaviour_analysis():
    return analysis_results.get('behavior_vs_performance', {})

@app.post("/api/predict")
def predict_cluster(data: StudentData):
    if pipeline is None or kmeans_model is None:
        raise HTTPException(status_code=500, detail="Models are not loaded.")
        
    # Prepare input data
    input_df = pd.DataFrame([{
        'Study_Hours': data.study_hours,
        'Attendance': data.attendance,
        'Assignment_Submission_Timing': data.assignment_timing,
        'Online_Resource_Usage': data.online_resource_usage,
        'Assessment_Score': data.assessment_score
    }])
    
    # Preprocess
    scaled_input = pipeline.transform(input_df)
    
    # Predict
    cluster = int(kmeans_model.predict(scaled_input)[0])
    
    # Calculate distance to centroid
    centroid = kmeans_model.cluster_centers_[cluster]
    distance = float(np.linalg.norm(scaled_input[0] - centroid))
    
    # Get profile
    profiles = analysis_results.get('profiles', [])
    profile = next((p for p in profiles if p['cluster_id'] == cluster), None)
    
    # Recommendation logic
    recommendation = "Keep up the good work."
    if profile:
        if profile['avg_attendance'] > 80 and profile['avg_assessment_score'] > 75:
            recommendation = "Offer advanced material, peer mentoring, or enrichment activities."
        elif profile['avg_attendance'] > 80 and profile['avg_assessment_score'] <= 75:
            recommendation = "Investigate conceptual difficulties and provide targeted academic support."
        elif profile['avg_attendance'] <= 80 and profile['avg_assessment_score'] > 75:
            recommendation = "Student performs well but has low engagement. Ensure they are sufficiently challenged."
        else:
            recommendation = "Recommend attendance monitoring, structured study schedules, and academic follow-up."
            
    return {
        "cluster": cluster,
        "profile": profile,
        "centroid_distance": distance,
        "recommendation": recommendation,
        "student_values": input_df.iloc[0].to_dict()
    }

# Production: Serve React Frontend if dist folder exists
dist_candidates = [
    os.path.join(project_root, 'frontend', 'dist'),
    os.path.join(current_dir, '..', 'frontend', 'dist'),
    'frontend/dist'
]
dist_dir = None
for candidate in dist_candidates:
    if os.path.exists(candidate) and os.path.isdir(candidate):
        dist_dir = os.path.abspath(candidate)
        break

if dist_dir:
    assets_dir = os.path.join(dist_dir, 'assets')
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
