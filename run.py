import os
import sys
import uvicorn

# Ensure student-clustering directory is in Python path
base_dir = os.path.dirname(os.path.abspath(__file__))
student_clustering_dir = os.path.join(base_dir, "student-clustering")
if student_clustering_dir not in sys.path:
    sys.path.insert(0, student_clustering_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on 0.0.0.0:{port}...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)
