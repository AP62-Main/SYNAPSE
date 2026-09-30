import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  Scale, 
  Network, 
  GitMerge, 
  BarChart3, 
  Database, 
  Sun, 
  Moon, 
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

import { ThemeProvider, useTheme } from './context/ThemeContext';

// Clean, Useful & Professional Pages
import Overview from './pages/Overview';
import ClusterAnalysis from './pages/ClusterAnalysis';
import StudentSegmentation from './pages/StudentSegmentation';
import BehaviorVsPerformance from './pages/BehaviorVsPerformance';
import PCAVisualization from './pages/PCAVisualization';
import ModelValidation from './pages/ModelValidation';
import EDA from './pages/EDA';
import DatasetExplorer from './pages/DatasetExplorer';

function Sidebar() {
  const { theme, toggleTheme, isDark } = useTheme();

  const primaryNav = [
    { path: '/', icon: LayoutDashboard, label: 'Executive Overview' },
    { path: '/clusters', icon: Users, label: 'Cohort Profiles' },
    { path: '/predict', icon: BrainCircuit, label: 'Live Inference' },
    { path: '/behavior', icon: Scale, label: 'Behavior vs. Grades' }
  ];

  const secondaryNav = [
    { path: '/pca', icon: Network, label: 'PCA Latent Space' },
    { path: '/validation', icon: GitMerge, label: 'Model Validation' },
    { path: '/eda', icon: BarChart3, label: 'Exploratory Analytics' },
    { path: '/dataset', icon: Database, label: 'Student Data Lake' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-800 h-screen flex flex-col fixed left-0 top-0 z-30 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white font-mono">
                SYNAPSE
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                ML v2.4
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Cohort Intelligence Engine
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Section 1: Core Intelligence */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            Intelligence & Inference
          </div>
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all
                    ${isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'}
                  `}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: Validation & Data */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            Validation & Data Corpus
          </div>
          <ul className="space-y-1">
            {secondaryNav.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all
                    ${isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'}
                  `}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors text-xs font-medium text-neutral-700 dark:text-neutral-300"
          aria-label="Toggle Dark and Light Mode"
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="w-4 h-4 text-neutral-300" />
            ) : (
              <Sun className="w-4 h-4 text-neutral-700" />
            )}
            <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
          </div>
          <div className="w-8 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700 relative flex items-center px-0.5">
            <div
              className={`w-3 h-3 rounded-full bg-white dark:bg-neutral-200 shadow-sm transition-transform duration-200 ${
                isDark ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </button>

        {/* Engine Status Banner */}
        <div className="px-2 py-1.5 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pipeline Active</span>
          </div>
          <span className="font-mono text-[10px]">K=2 | ARI=0.98</span>
        </div>
      </div>
    </aside>
  );
}

function MainLayout() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="flex min-h-screen bg-chatgpt-light dark:bg-chatgpt-dark text-chatgpt-lightText dark:text-chatgpt-darkText transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 px-8 flex items-center justify-between bg-white/70 dark:bg-[#0d0d0d]/70 backdrop-blur-md sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-mono text-neutral-900 dark:text-neutral-100 font-semibold">SYNAPSE</span>
            <span>/</span>
            <span className="text-neutral-700 dark:text-neutral-300">Behavioral Intelligence</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>FastAPI 8000</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/clusters" element={<ClusterAnalysis />} />
            <Route path="/predict" element={<StudentSegmentation />} />
            <Route path="/behavior" element={<BehaviorVsPerformance />} />
            <Route path="/pca" element={<PCAVisualization />} />
            <Route path="/validation" element={<ModelValidation />} />
            <Route path="/eda" element={<EDA />} />
            <Route path="/dataset" element={<DatasetExplorer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout />
      </Router>
    </ThemeProvider>
  );
}
