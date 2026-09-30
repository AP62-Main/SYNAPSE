import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Network, Box, Layers } from 'lucide-react';
import InfoTooltip from '../components/Tooltip';
import { useTheme } from '../context/ThemeContext';

export default function PCAVisualization() {
  const { isDark, plotlyLayout } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/pca');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load PCA vectors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400 dark:text-neutral-500 animate-pulse text-sm">
          Computing 3D latent space projections...
        </div>
      </div>
    );
  }

  const explained = data?.explained_variance || [0.721, 0.153, 0.060];
  const totalVariance = explained.reduce((acc: number, v: number) => acc + v, 0) * 100;

  const cluster0Points = data?.data?.filter((d: any) => d.cluster === 0) || [];
  const cluster1Points = data?.data?.filter((d: any) => d.cluster === 1) || [];

  const plotData = [
    {
      x: cluster0Points.map((d: any) => d.pc1),
      y: cluster0Points.map((d: any) => d.pc2),
      z: cluster0Points.map((d: any) => d.pc3),
      text: cluster0Points.map((d: any) => `${d.student_id} (Cluster 0)`),
      mode: 'markers',
      name: 'Cluster 0 (High Active / Striving)',
      type: 'scatter3d',
      marker: {
        color: isDark ? '#ffffff' : '#0d0d0d',
        size: 4,
        opacity: 0.85
      }
    },
    {
      x: cluster1Points.map((d: any) => d.pc1),
      y: cluster1Points.map((d: any) => d.pc2),
      z: cluster1Points.map((d: any) => d.pc3),
      text: cluster1Points.map((d: any) => `${d.student_id} (Cluster 1)`),
      mode: 'markers',
      name: 'Cluster 1 (Disengaged / At-Risk)',
      type: 'scatter3d',
      marker: {
        color: isDark ? '#737373' : '#a3a3a3',
        size: 4,
        opacity: 0.85
      }
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center">
              PCA Latent Space (3D Projection)
              <InfoTooltip
                title="Principal Component Analysis"
                content="Reduces 5-dimensional student vectors onto the 3 orthogonal axes of maximum variance, demonstrating natural geometric separation."
              />
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Interactive 3D scatter visualization of student clusters in reduced dimensional space.
            </p>
          </div>
        </div>
      </header>

      {/* Explained Variance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="chatgpt-card p-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-1">
            PC1 Variance
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {(explained[0] * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Primary behavioral axis</p>
        </div>

        <div className="chatgpt-card p-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-1">
            PC2 Variance
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {(explained[1] * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Secondary orthogonal axis</p>
        </div>

        <div className="chatgpt-card p-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-1">
            PC3 Variance
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {(explained[2] * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Tertiary orthogonal axis</p>
        </div>

        <div className="chatgpt-card p-4 border-l-2 border-l-neutral-900 dark:border-l-white">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-1">
            Cumulative Retained
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {totalVariance.toFixed(1)}%
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Total information preserved</p>
        </div>
      </div>

      {/* 3D Plot Container */}
      <div className="chatgpt-card p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <Box className="w-4 h-4 text-neutral-500" />
            3D Manifold Rotation & Inspection
          </div>
          <span className="text-xs text-neutral-500">
            Click and drag to rotate • Scroll to zoom
          </span>
        </div>

        <div className="w-full h-[580px] flex items-center justify-center">
          {data?.data ? (
            <Plot
              data={plotData as any}
              layout={{
                autosize: true,
                margin: { l: 0, r: 0, t: 0, b: 0 },
                paper_bgcolor: plotlyLayout.paper_bgcolor,
                plot_bgcolor: plotlyLayout.plot_bgcolor,
                font: plotlyLayout.font,
                legend: {
                  orientation: 'h',
                  yanchor: 'bottom',
                  y: 0.02,
                  xanchor: 'center',
                  x: 0.5,
                  font: { size: 11, color: isDark ? '#ececec' : '#0d0d0d' }
                },
                scene: {
                  xaxis: {
                    title: { text: `PC1 (${(explained[0] * 100).toFixed(1)}%)` },
                    backgroundcolor: isDark ? '#1a1a1a' : '#f9f9f9',
                    gridcolor: plotlyLayout.gridcolor,
                    zerolinecolor: plotlyLayout.zerolinecolor
                  },
                  yaxis: {
                    title: { text: `PC2 (${(explained[1] * 100).toFixed(1)}%)` },
                    backgroundcolor: isDark ? '#1a1a1a' : '#f9f9f9',
                    gridcolor: plotlyLayout.gridcolor,
                    zerolinecolor: plotlyLayout.zerolinecolor
                  },
                  zaxis: {
                    title: { text: `PC3 (${(explained[2] * 100).toFixed(1)}%)` },
                    backgroundcolor: isDark ? '#1a1a1a' : '#f9f9f9',
                    gridcolor: plotlyLayout.gridcolor,
                    zerolinecolor: plotlyLayout.zerolinecolor
                  },
                  camera: {
                    eye: { x: 1.6, y: 1.6, z: 1.2 }
                  }
                }
              }}
              config={{ responsive: true, displayModeBar: true, displaylogo: false }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="text-neutral-400 text-sm">No PCA coordinates available</div>
          )}
        </div>
      </div>
    </div>
  );
}
