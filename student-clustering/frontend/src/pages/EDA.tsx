import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { BarChart3, Database, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import InfoTooltip from '../components/Tooltip';
import { useTheme } from '../context/ThemeContext';

export default function EDA() {
  const { isDark, plotlyLayout } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [selectedFeature, setSelectedFeature] = useState<string>('Study_Hours');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/statistics');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load EDA statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400 dark:text-neutral-500 animate-pulse text-sm">
          Calculating statistical distributions...
        </div>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const featureNames = Object.keys(summary);
  const currentFeatureData = summary[selectedFeature] || {};

  const featureLabels: Record<string, string> = {
    Study_Hours: 'Weekly Study Hours (h/wk)',
    Attendance: 'Class Attendance (%)',
    Assignment_Submission_Timing: 'Submission Timing (Days ±)',
    Online_Resource_Usage: 'LMS Resource Hits (Clicks)',
    Assessment_Score: 'Exam Assessment Score (%)'
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Exploratory Data Analytics (EDA)
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Descriptive statistics, distribution quantiles, and data health across all student behavioral features.
            </p>
          </div>
        </div>
      </header>

      {/* Dataset Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="chatgpt-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Total Observations
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.total_students || 600}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 block">
            Sample size evaluated
          </span>
        </div>

        <div className="chatgpt-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Feature Dimension
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.features || 5}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 block">
            Behavioral input vectors
          </span>
        </div>

        <div className="chatgpt-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Imputed Cells
          </div>
          <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.missing_values || 131}
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 block">
            Treated with SimpleImputer (median)
          </span>
        </div>

        <div className="chatgpt-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
            Transformation Status
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            StandardScaler Active
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 block">
            Zero mean, unit variance scaling
          </span>
        </div>
      </div>

      {/* Feature Selector & Interactive Distribution */}
      <div className="chatgpt-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Parametric Distribution Visualizer
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Select a feature to inspect its statistical quantiles and dispersion
            </p>
          </div>

          {/* Feature Pill Selector */}
          <div className="flex flex-wrap gap-2">
            {featureNames.map((feat) => (
              <button
                key={feat}
                onClick={() => setSelectedFeature(feat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedFeature === feat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {feat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Quantile Cards for Selected Feature */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">Mean (μ)</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData.mean || 0).toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">Std Dev (σ)</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData.std || 0).toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">Min</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData.min || 0).toFixed(1)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">25th %ile</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData['25%'] || 0).toFixed(1)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center border-l-2 border-l-neutral-900 dark:border-l-white">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">Median (50%)</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData['50%'] || 0).toFixed(1)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">75th %ile</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData['75%'] || 0).toFixed(1)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] font-medium uppercase text-neutral-500 dark:text-neutral-400">Max</div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {Number(currentFeatureData.max || 0).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Box Plot Simulation / Range Visualization */}
        <div className="w-full h-[280px]">
          <Plot
            data={[
              {
                type: 'box',
                name: featureLabels[selectedFeature] || selectedFeature,
                boxpoints: false,
                q1: [currentFeatureData['25%'] || 0],
                median: [currentFeatureData['50%'] || 0],
                q3: [currentFeatureData['75%'] || 0],
                lowerfence: [currentFeatureData.min || 0],
                upperfence: [currentFeatureData.max || 0],
                mean: [currentFeatureData.mean || 0],
                marker: { color: isDark ? '#ffffff' : '#0d0d0d' },
                line: { color: isDark ? '#ececec' : '#171717', width: 2 },
                fillcolor: isDark ? '#262626' : '#f0f0f0'
              } as any
            ]}
            layout={{
              autosize: true,
              margin: { l: 60, r: 30, t: 20, b: 40 },
              paper_bgcolor: plotlyLayout.paper_bgcolor,
              plot_bgcolor: plotlyLayout.plot_bgcolor,
              font: plotlyLayout.font,
              yaxis: {
                title: { text: featureLabels[selectedFeature] || selectedFeature },
                gridcolor: plotlyLayout.gridcolor,
                zerolinecolor: plotlyLayout.zerolinecolor
              },
              showlegend: false
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Complete Descriptive Statistics Matrix */}
      <div className="chatgpt-card overflow-hidden">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-neutral-500" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Parametric Summary Table
            </h2>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            N = {stats?.total_students || 600}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="p-3.5">Feature Metric</th>
                <th className="p-3.5 text-right">Mean</th>
                <th className="p-3.5 text-right">Std Dev</th>
                <th className="p-3.5 text-right">Min</th>
                <th className="p-3.5 text-right">25%</th>
                <th className="p-3.5 text-right">Median</th>
                <th className="p-3.5 text-right">75%</th>
                <th className="p-3.5 text-right">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {featureNames.map((fName) => {
                const f = summary[fName] || {};
                return (
                  <tr 
                    key={fName} 
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                      selectedFeature === fName ? 'bg-neutral-100/50 dark:bg-neutral-800/30' : ''
                    }`}
                  >
                    <td className="p-3.5 font-medium text-neutral-900 dark:text-neutral-100">
                      {fName.replace(/_/g, ' ')}
                    </td>
                    <td className="p-3.5 text-right font-mono">{Number(f.mean || 0).toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono">{Number(f.std || 0).toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono">{Number(f.min || 0).toFixed(1)}</td>
                    <td className="p-3.5 text-right font-mono">{Number(f['25%'] || 0).toFixed(1)}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      {Number(f['50%'] || 0).toFixed(1)}
                    </td>
                    <td className="p-3.5 text-right font-mono">{Number(f['75%'] || 0).toFixed(1)}</td>
                    <td className="p-3.5 text-right font-mono">{Number(f.max || 0).toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
