import pandas as pd
import numpy as np
import os

def generate_synthetic_data(n_samples=600):
    np.random.seed(42)
    
    # We will create 4 clear clusters based on learning behaviors
    # Cluster 0: High Engagement, High Performance
    # Cluster 1: High Engagement, Low Performance (Struggling but trying)
    # Cluster 2: Low Engagement, High Performance (Naturally gifted or prior knowledge)
    # Cluster 3: Low Engagement, Low Performance (At risk)
    
    n_per_cluster = n_samples // 4
    
    data = []
    
    for _ in range(n_per_cluster):
        # Cluster 0
        data.append({
            'Study_Hours': np.random.normal(25, 3), # hours per week
            'Attendance': np.random.normal(95, 3), # percentage
            'Assignment_Submission_Timing': np.random.normal(3, 1), # days before deadline (positive = early)
            'Online_Resource_Usage': np.random.normal(85, 10), # clicks/views
            'Assessment_Score': np.random.normal(88, 5) # percentage
        })
        
        # Cluster 1
        data.append({
            'Study_Hours': np.random.normal(22, 4),
            'Attendance': np.random.normal(90, 5),
            'Assignment_Submission_Timing': np.random.normal(1, 1.5),
            'Online_Resource_Usage': np.random.normal(70, 15),
            'Assessment_Score': np.random.normal(55, 8)
        })
        
        # Cluster 2
        data.append({
            'Study_Hours': np.random.normal(8, 3),
            'Attendance': np.random.normal(60, 10),
            'Assignment_Submission_Timing': np.random.normal(-1, 2), # negative = late
            'Online_Resource_Usage': np.random.normal(30, 10),
            'Assessment_Score': np.random.normal(82, 6)
        })
        
        # Cluster 3
        data.append({
            'Study_Hours': np.random.normal(5, 2),
            'Attendance': np.random.normal(45, 12),
            'Assignment_Submission_Timing': np.random.normal(-3, 1.5),
            'Online_Resource_Usage': np.random.normal(15, 8),
            'Assessment_Score': np.random.normal(40, 10)
        })
        
    df = pd.DataFrame(data)
    
    # Clip values to realistic ranges
    df['Study_Hours'] = df['Study_Hours'].clip(0, 40)
    df['Attendance'] = df['Attendance'].clip(0, 100)
    df['Assignment_Submission_Timing'] = df['Assignment_Submission_Timing'].clip(-7, 7)
    df['Online_Resource_Usage'] = df['Online_Resource_Usage'].clip(0, 200)
    df['Assessment_Score'] = df['Assessment_Score'].clip(0, 100)
    
    # Introduce some missing values randomly (5% of data) to demonstrate imputation
    for col in df.columns:
        mask = np.random.rand(len(df)) < 0.05
        df.loc[mask, col] = np.nan
        
    # Shuffle the dataset
    df = df.sample(frac=1).reset_index(drop=True)
    
    # Add a Student_ID
    df.insert(0, 'Student_ID', [f"STU{i:04d}" for i in range(1, len(df) + 1)])
    
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/synthetic_students.csv', index=False)
    print(f"Generated {len(df)} synthetic student records in data/synthetic_students.csv")

if __name__ == "__main__":
    generate_synthetic_data()
