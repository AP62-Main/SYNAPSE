import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, BookOpen, Clock, Activity, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import InfoTooltip from '../components/Tooltip';

export default function ClusterAnalysis() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get('/api/clusters');
        setProfiles(res.data);
      } catch (err) {
        console.error('Failed to load cluster profiles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400 dark:text-neutral-500 animate-pulse text-sm">
          Loading student cohort profiles...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center">
              Cohort Profiling & Behavior Archetypes
              <InfoTooltip
                title="Cohort Archetypes"
                content="Aggregated multi-dimensional averages discovered by K-Means clustering across standardized behavioral features."
              />
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Deep-dive analytical signatures for each unsupervised student partition and recommended institutional actions.
            </p>
          </div>
        </div>
      </header>

      {/* Cohort Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((profile, i) => {
          const isAtRisk = profile.avg_attendance < 70 || profile.avg_assessment_score < 65;
          return (
            <div key={i} className="chatgpt-card overflow-hidden flex flex-col justify-between">
              <div>
                {/* Card Header */}
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono">
                      Cluster {profile.cluster_id}
                    </span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {profile.size} Students ({profile.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {profile.description}
                  </h2>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Weekly Study
                      </div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {profile.avg_study_hours.toFixed(1)} <span className="text-xs font-normal text-neutral-500">h/week</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Attendance
                      </div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {profile.avg_attendance.toFixed(1)}%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Submission Lead
                      </div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {profile.avg_submission_timing > 0 
                          ? `+${profile.avg_submission_timing.toFixed(1)} days early` 
                          : `${profile.avg_submission_timing.toFixed(1)} days late`}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> LMS Resource Clicks
                      </div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {profile.avg_resource_usage.toFixed(0)} <span className="text-xs font-normal text-neutral-500">interactions</span>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Score Bar */}
                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Mean Assessment Score
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        {profile.avg_assessment_score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, profile.avg_assessment_score)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/50">
                <div className="flex items-start gap-2.5">
                  {isAtRisk ? (
                    <ShieldAlert className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    <strong className="text-neutral-900 dark:text-neutral-200 block mb-0.5">
                      Recommended Pedagogical Strategy:
                    </strong>
                    {profile.cluster_id === 0
                      ? 'Deploy advanced enrichment modules, peer-mentoring leadership opportunities, and open-ended lab projects to prevent disengagement from lack of challenge.'
                      : 'Trigger automated academic follow-up: send targeted review modules, establish mandatory attendance checkpoints, and pair with academic coaching.'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
