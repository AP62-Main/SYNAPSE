import React, { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, Loader2, ArrowRight, Sparkles, RotateCcw, Target, CheckCircle2 } from 'lucide-react';
import InfoTooltip from '../components/Tooltip';

export default function StudentSegmentation() {
  const [formData, setFormData] = useState({
    study_hours: 15,
    attendance: 80,
    assignment_timing: 0,
    online_resource_usage: 50,
    assessment_score: 75
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/predict', formData);
      setResult(res.data);
    } catch (err) {
      console.error('Prediction request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: {
    study_hours: number;
    attendance: number;
    assignment_timing: number;
    online_resource_usage: number;
    assessment_score: number;
  }) => {
    setFormData(preset);
    setResult(null);
  };

  const resetForm = () => {
    setFormData({
      study_hours: 15,
      attendance: 80,
      assignment_timing: 0,
      online_resource_usage: 50,
      assessment_score: 75
    });
    setResult(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center">
              Real-Time Inference Engine
              <InfoTooltip
                title="Live Inference"
                content="Feeds prospective student coordinates into the pipeline StandardScaler and computes minimum Euclidean distance to K-Means centroids."
              />
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Simulate individual student vectors to determine cohort assignment, centroid proximity, and recommended pedagogical interventions.
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid: Form Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-7 chatgpt-card p-6 flex flex-col justify-between">
          <div>
            {/* Presets and Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Simulation Presets
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset({ study_hours: 26, attendance: 95, assignment_timing: 3, online_resource_usage: 85, assessment_score: 88 })}
                  className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                >
                  Consistent High-Effort
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset({ study_hours: 5, attendance: 48, assignment_timing: -3, online_resource_usage: 18, assessment_score: 55 })}
                  className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                >
                  Disengaged At-Risk
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Range Controls */}
            <div className="space-y-5">
              {/* Study Hours */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-medium text-neutral-800 dark:text-neutral-200">
                    Weekly Independent Study Hours
                  </label>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {formData.study_hours} hrs/week
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="0.5"
                  value={formData.study_hours}
                  onChange={(e) => setFormData({ ...formData, study_hours: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Attendance */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-medium text-neutral-800 dark:text-neutral-200">
                    Lecture & Lab Attendance Rate
                  </label>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {formData.attendance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Assignment Timing */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-medium text-neutral-800 dark:text-neutral-200">
                    Assignment Submission Timing (Days from Deadline)
                  </label>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {formData.assignment_timing > 0 ? `+${formData.assignment_timing} days early` : formData.assignment_timing === 0 ? 'On Deadline (0d)' : `${formData.assignment_timing} days late`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-7"
                  max="7"
                  step="0.5"
                  value={formData.assignment_timing}
                  onChange={(e) => setFormData({ ...formData, assignment_timing: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* LMS Resource Usage */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-medium text-neutral-800 dark:text-neutral-200">
                    Digital LMS Resource Activity (Total Clicks)
                  </label>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {formData.online_resource_usage} interactions
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={formData.online_resource_usage}
                  onChange={(e) => setFormData({ ...formData, online_resource_usage: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Assessment Score */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-medium text-neutral-800 dark:text-neutral-200">
                    Observed Assessment Score
                  </label>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {formData.assessment_score}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.assessment_score}
                  onChange={(e) => setFormData({ ...formData, assessment_score: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Predict Action Button */}
          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="w-full mt-8 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Computing Vector Projection...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Execute Cluster Inference
              </>
            )}
          </button>
        </div>

        {/* Prediction Results Panel */}
        <div className="lg:col-span-5 chatgpt-card p-6 flex flex-col justify-center">
          {!result ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Inference Ready
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Adjust the behavioral parameters on the left or select a simulation preset, then click "Execute Cluster Inference" to assign the student to their optimal cohort.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Output Top Card */}
              <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Predicted Learning Cohort
                </span>
                <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1 mb-1 font-mono">
                  Cluster {result.cluster}
                </div>
                <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  "{result.profile?.description}"
                </div>
              </div>

              {/* Centroid Distance Card */}
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    Centroid Euclidean Distance
                    <InfoTooltip title="Euclidean Distance" content="Distance from input point to the cluster center in standardized z-score coordinates. Lower distance indicates prototypical cluster membership." />
                  </span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {result.centroid_distance.toFixed(3)}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  {result.centroid_distance < 1.5 
                    ? 'High archetype conformity (very close to centroid).' 
                    : 'Peripheral boundary case (exhibits cross-cohort traits).'}
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-800/40">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block mb-1">
                      Prescriptive Intervention Plan
                    </span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
