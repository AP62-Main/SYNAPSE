import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score, adjusted_rand_score
from sklearn.decomposition import PCA
from scipy.cluster.hierarchy import linkage, dendrogram

def main():
    print("Loading data...")
    df_raw = pd.read_csv('data/synthetic_students.csv')
    
    # Store basic EDA stats
    eda_stats = {
        'total_students': len(df_raw),
        'features': len(df_raw.columns) - 1, # excluding Student_ID
        'missing_values': int(df_raw.isnull().sum().sum()),
        'summary': df_raw.describe().to_dict()
    }
    
    print("Preprocessing...")
    # Separate features
    features = ['Study_Hours', 'Attendance', 'Assignment_Submission_Timing', 'Online_Resource_Usage', 'Assessment_Score']
    X = df_raw[features]
    
    # Preprocessing Pipeline (Impute + Scale)
    pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    X_scaled = pipeline.fit_transform(X)
    
    print("Calculating Optimal K...")
    # 1. Elbow Method & Silhouette
    max_k = 10
    wcss = []
    sil_scores = []
    
    for k in range(2, max_k + 1):
        kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        wcss.append(float(kmeans.inertia_))
        sil_scores.append(float(silhouette_score(X_scaled, kmeans.labels_)))
        
    # Pick optimal K based on max silhouette
    optimal_k = int(np.argmax(sil_scores) + 2)
    print(f"Optimal K determined as {optimal_k}")
    
    print("Training final KMeans...")
    # Final KMeans model
    kmeans_final = KMeans(n_clusters=optimal_k, init='k-means++', random_state=42, n_init=10)
    cluster_labels = kmeans_final.fit_predict(X_scaled)
    df_raw['Cluster'] = cluster_labels
    
    print("Training Hierarchical Clustering...")
    # Hierarchical Clustering
    hc = AgglomerativeClustering(n_clusters=optimal_k, metric='euclidean', linkage='ward')
    hc_labels = hc.fit_predict(X_scaled)
    
    # Compare the two (Adjusted Rand Index)
    ari_score = float(adjusted_rand_score(cluster_labels, hc_labels))
    
    print("Running PCA...")
    # PCA
    pca = PCA(n_components=3)
    X_pca = pca.fit_transform(X_scaled)
    explained_variance = [float(v) for v in pca.explained_variance_ratio_]
    
    pca_data = []
    for i in range(len(X_pca)):
        pca_data.append({
            'pc1': float(X_pca[i, 0]),
            'pc2': float(X_pca[i, 1]),
            'pc3': float(X_pca[i, 2]),
            'cluster': int(cluster_labels[i]),
            'student_id': df_raw.iloc[i]['Student_ID']
        })
        
    print("Behavior vs Performance Analysis...")
    # Behavior vs Performance Analysis
    # We remove 'Assessment_Score' and cluster again
    features_behavior = ['Study_Hours', 'Attendance', 'Assignment_Submission_Timing', 'Online_Resource_Usage']
    X_behavior = df_raw[features_behavior]
    pipeline_behavior = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    X_behavior_scaled = pipeline_behavior.fit_transform(X_behavior)
    
    kmeans_behavior = KMeans(n_clusters=optimal_k, init='k-means++', random_state=42, n_init=10)
    behavior_labels = kmeans_behavior.fit_predict(X_behavior_scaled)
    
    ari_behavior = float(adjusted_rand_score(cluster_labels, behavior_labels))
    
    print("Generating Cluster Profiles...")
    # Cluster Profiling
    cluster_profiles = []
    for c in range(optimal_k):
        c_data = df_raw[df_raw['Cluster'] == c]
        profile = {
            'cluster_id': c,
            'size': int(len(c_data)),
            'percentage': float(len(c_data) / len(df_raw) * 100),
            'avg_study_hours': float(c_data['Study_Hours'].mean()),
            'avg_attendance': float(c_data['Attendance'].mean()),
            'avg_submission_timing': float(c_data['Assignment_Submission_Timing'].mean()),
            'avg_resource_usage': float(c_data['Online_Resource_Usage'].mean()),
            'avg_assessment_score': float(c_data['Assessment_Score'].mean())
        }
        
        # Determine dynamic description
        desc = ""
        if profile['avg_attendance'] > 80 and profile['avg_assessment_score'] > 75:
            desc = "Consistent Engaged Learners"
        elif profile['avg_attendance'] > 80 and profile['avg_assessment_score'] <= 75:
            desc = "Highly Active but Academically Struggling"
        elif profile['avg_attendance'] <= 80 and profile['avg_assessment_score'] > 75:
            desc = "High Performance but Low Engagement"
        else:
            desc = "Low Engagement / At-Risk Learners"
            
        profile['description'] = desc
        cluster_profiles.append(profile)
        
    # Calculate linkage for dendrogram
    linked = linkage(X_scaled, 'ward')
    # Save a subset of linkage to not overwhelm frontend (first 100 points or something, actually we can just pass the linkage matrix if frontend needs it, but plotly can be slow with 500+ points. We'll pass the JSON structure for plotly figure_factory)
    
    # Save models
    print("Saving models and data...")
    os.makedirs('models', exist_ok=True)
    joblib.dump(pipeline, 'models/pipeline.joblib')
    joblib.dump(kmeans_final, 'models/kmeans_model.joblib')
    
    # Save analysis results for API
    analysis_results = {
        'eda_stats': eda_stats,
        'optimal_k': optimal_k,
        'metrics': {
            'wcss': wcss,
            'silhouette': sil_scores,
            'k_values': list(range(2, max_k + 1))
        },
        'profiles': cluster_profiles,
        'ari_hierarchical': ari_score,
        'pca': {
            'explained_variance': explained_variance,
            'data': pca_data
        },
        'behavior_vs_performance': {
            'ari_score': ari_behavior,
            'conclusion': "Clusters remain distinct" if ari_behavior > 0.6 else "Removing assessment score causes clusters to change significantly.",
            'details': f"The Adjusted Rand Index between full-feature and behavior-only clustering is {ari_behavior:.2f}."
        }
    }
    
    with open('models/analysis_results.json', 'w') as f:
        json.dump(analysis_results, f)
        
    print("Training complete! Assets saved in 'models/' directory.")

if __name__ == "__main__":
    main()
