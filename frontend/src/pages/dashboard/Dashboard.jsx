import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Code2, 
  FileCheck, 
  Sparkle, 
  ExternalLink,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { GithubIcon } from '../../components/ui/BrandIcons';
import { githubApi, authApi, portfoliosApi, resumesApi } from '../../services/api';


export default function Dashboard() {
  const user = authApi.getCurrentUser();
  const [repos, setRepos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const repoRes = await githubApi.getRepos();
      setRepos(repoRes.data);

      const portRes = await portfoliosApi.getPortfolios();
      setPortfolios(portRes.data);

      const resumeRes = await resumesApi.getResumes();
      setResumes(resumeRes.data);
    } catch (e) {
      console.error("Error loading dashboard metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await githubApi.syncRepos();
      setRepos(res.data);
    } catch (e) {
      console.error("Sync failed:", e);
    } finally {
      setSyncing(false);
    }
  };

  // Calculate stats
  const totalRepos = repos.length;
  const analyzedRepos = repos.filter(r => r.analysisResult).length;
  const avgHealthScore = repos.length > 0 
    ? Math.round(repos.reduce((acc, curr) => acc + (curr.healthScore || 0), 0) / repos.length) 
    : 0;

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Developer Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, <span className="text-white font-semibold">{user?.name}</span>. Manage your portfolios and analyze synced repositories.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-lg shadow-purple-600/10 cursor-pointer border border-purple-500/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing GitHub...' : 'Sync GitHub Repos'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 bg-white/5 border border-white/10 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-xs font-semibold">Synced Repos</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-300">
              <GithubIcon className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white block">{totalRepos}</span>
          <span className="text-[10px] text-gray-500 mt-1 block">{analyzedRepos} Analyzed by AI</span>
        </div>

        <div className="glass-panel p-6 bg-white/5 border border-white/10 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-xs font-semibold">Active Portfolios</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white block">{portfolios.length}</span>
          <span className="text-[10px] text-purple-400 mt-1 block">Live previews enabled</span>
        </div>

        <div className="glass-panel p-6 bg-white/5 border border-white/10 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-xs font-semibold">Saved Resumes</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white block">{resumes.length}</span>
          <span className="text-[10px] text-blue-400 mt-1 block">ATS Optimized CV templates</span>
        </div>

        <div className="glass-panel p-6 bg-white/5 border border-white/10 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-xs font-semibold">Profile Health</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white block">{avgHealthScore}%</span>
          <span className="text-[10px] text-cyan-400 mt-1 block">Based on repo descriptions</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Quick steps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 text-left space-y-4 bg-white/5">
            <h2 className="font-bold text-lg text-white">Getting Started Guide</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 shrink-0 text-sm border border-purple-500/20">1</div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Sync and Analyze Repos</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Go to GitHub Analysis, choose your best repositories, and trigger AI deep analysis to generate descriptions and features.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 shrink-0 text-sm border border-purple-500/20">2</div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Build Your Portfolio</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Select a premium UI template (like Cyberpunk or Glassmorphism Pro) and customize generated content blocks dynamically.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 shrink-0 text-sm border border-purple-500/20">3</div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Export ATS Resume</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Compile your experience, click AI Polish to format your content bullets professionally, and download the PDF.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active published paths */}
        <div className="space-y-6">
          <div className="glass-panel p-6 text-left space-y-4 bg-white/5">
            <h2 className="font-bold text-lg text-white">Published Portfolios</h2>

            {portfolios.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center">No portfolios generated yet.</p>
            ) : (
              <div className="space-y-3">
                {portfolios.map((port) => (
                  <a
                    key={port.id}
                    href={`/p/${port.publishedUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex justify-between items-center p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <span className="block text-xs font-semibold text-white capitalize">{port.templateName} Theme</span>
                      <span className="block text-[10px] text-gray-400 truncate">p/{port.publishedUrl}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
