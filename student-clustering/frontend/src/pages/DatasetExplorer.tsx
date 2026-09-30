import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Database, Search, Filter, Download } from 'lucide-react';
import InfoTooltip from '../components/Tooltip';

export default function DatasetExplorer() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [clusterFilter, setClusterFilter] = useState<'all' | '0' | '1'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/dataset?limit=500');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load student dataset:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((r) => {
    const matchesSearch = r.Student_ID?.toLowerCase().includes(search.toLowerCase());
    const matchesCluster =
      clusterFilter === 'all' ? true : String(r.Cluster) === clusterFilter;
    return matchesSearch && matchesCluster;
  });

  const exportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse_students_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400 dark:text-neutral-500 animate-pulse text-sm">
          Accessing student feature lake...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center">
                Student Feature Lake & Corpus
                <InfoTooltip
                  title="Data Corpus"
                  content="Raw records used for unsupervised training. Missing cells are handled dynamically during the pipeline transform stage."
                />
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Showing {filteredData.length} of {data.length} records.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search Student ID (e.g. STU0042)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Cluster Filter Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setClusterFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                clusterFilter === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              All Cohorts
            </button>
            <button
              type="button"
              onClick={() => setClusterFilter('0')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                clusterFilter === '0'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              Cluster 0
            </button>
            <button
              type="button"
              onClick={() => setClusterFilter('1')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                clusterFilter === '1'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              Cluster 1
            </button>
          </div>
        </div>
      </header>

      {/* Table Container */}
      <div className="chatgpt-card overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Student ID</th>
                <th className="p-3 text-right">Study Hours (h)</th>
                <th className="p-3 text-right">Attendance (%)</th>
                <th className="p-3 text-right">Submission Lead (Days)</th>
                <th className="p-3 text-right">Resource Clicks</th>
                <th className="p-3 text-right">Exam Score (%)</th>
                <th className="p-3 text-center">Assigned Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
              {filteredData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="p-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                    {row.Student_ID}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {row.Study_Hours === 'null' || row.Study_Hours === null ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        imputed
                      </span>
                    ) : (
                      Number(row.Study_Hours).toFixed(1)
                    )}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {row.Attendance === 'null' || row.Attendance === null ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        imputed
                      </span>
                    ) : (
                      Number(row.Attendance).toFixed(1)
                    )}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {row.Assignment_Submission_Timing === 'null' || row.Assignment_Submission_Timing === null ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        imputed
                      </span>
                    ) : Number(row.Assignment_Submission_Timing) > 0 ? (
                      `+${Number(row.Assignment_Submission_Timing).toFixed(1)}`
                    ) : (
                      Number(row.Assignment_Submission_Timing).toFixed(1)
                    )}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {row.Online_Resource_Usage === 'null' || row.Online_Resource_Usage === null ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        imputed
                      </span>
                    ) : (
                      Number(row.Online_Resource_Usage).toFixed(0)
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {row.Assessment_Score === 'null' || row.Assessment_Score === null ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        imputed
                      </span>
                    ) : (
                      Number(row.Assessment_Score).toFixed(1)
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      Cluster {row.Cluster}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="p-12 text-center text-neutral-400 text-xs">
              No matching student records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
