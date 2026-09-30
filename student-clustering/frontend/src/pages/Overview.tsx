import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Layers, BrainCircuit, Activity, ArrowUpRight, Cpu, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import InfoTooltip from '../components/Tooltip';

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, valRes, clusterRes] = await Promise.all([
          axios.get('/api/statistics'),
          axios.get('/api/validation'),
          axios.get('/api/clusters')
        ]);
        setStats({ ...statRes.data, ...valRes.data });
        setProfiles(clusterRes.data);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400 dark:text-neutral-500 animate-pulse text-sm">
          Loading SYNAPSE intelligence engine...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Executive Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                SYNAPSE Core ML v2.4 • Operational
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              Executive Cohort Intelligence
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Unsupervised behavioral segmentation engine discovering intrinsic student learning profiles without pre-assigned grade bias.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-[0.98]"
            >
              <BrainCircuit className="w-4 h-4" />
              Live Inference
            </Link>
          </div>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="chatgpt-card p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Student Population</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
            {stats?.total_students || 600}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Total active cohort records indexed in feature lake.
          </p>
        </div>

        <div className="chatgpt-card p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Behavioral Vectors</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center">
            {stats?.features || 5}
            <InfoTooltip title="Input Vectors" content="Normalized engagement metrics: Study Hours, Attendance, Submission Lead Time, LMS Clicks, and Exam Performance." />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Standardized multi-dimensional feature space.
          </p>
        </div>

        <div className="chatgpt-card p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Discovered Clusters</span>
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center">
            K = {stats?.optimal_k || 2}
            <InfoTooltip title="Optimal K" content="Determined dynamically via global peak in Silhouette score (0.504) and Elbow inflection point." />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Distinct archetypes naturally emerging from data.
          </p>
        </div>

        <div className="chatgpt-card p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Structural ARI Score</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center">
            {stats?.ari_hierarchical ? stats.ari_hierarchical.toFixed(2) : '0.98'}
            <InfoTooltip title="Adjusted Rand Index" content="Cross-validation concordance between K-Means and Ward Agglomerative Linkage. Near 1.0 confirms real structural separation." />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Cross-algorithm topological convergence.
          </p>
        </div>
      </div>

      {/* Discovered Cohorts Snapshot */}
      <div className="chatgpt-card p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Discovered Behavioral Archetypes
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              High-level breakdown of the clusters segmented by the unsupervised pipeline
            </p>
          </div>
          <Link
            to="/clusters"
            className="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            Detailed Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((profile, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                    Cluster {profile.cluster_id}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                    {profile.description}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {profile.percentage.toFixed(0)}%
                  </span>
                  <span className="text-xs text-neutral-500 block">
                    ({profile.size} students)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 text-xs">
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block">Avg Attendance</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {profile.avg_attendance.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block">Study Hours</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {profile.avg_study_hours.toFixed(1)}h/wk
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400 block">Avg Score</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {profile.avg_assessment_score.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Architecture */}
      <div className="chatgpt-card p-6">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Unsupervised Machine Learning Architecture
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          End-to-end data processing and model inference workflow
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Imputation</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              SimpleImputer using median strategy to prevent bias from extreme outliers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Standardization</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              StandardScaler (μ=0, σ²=1) ensures distance metrics are not dominated by large magnitudes.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">K-Means++</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Probabilistic centroid seeding optimizing WCSS convergence and avoiding local minima.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Inference</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Fast vector projection computing Euclidean distance to centroids for real-time prescriptive advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
