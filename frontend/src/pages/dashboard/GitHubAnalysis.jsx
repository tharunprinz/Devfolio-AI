import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Code2, 
  RefreshCw, 
  HelpCircle, 
  Activity, 
  Settings, 
  Search, 
  BookOpen, 
  Sparkle,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X
} from 'lucide-react';
import { githubApi, projectsApi } from '../../services/api';

export default function GitHubAnalysis() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [search, setSearch] = useState('');
  
  // Drawer state
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editableAnalysis, setEditableAnalysis] = useState(null);
  const [savingOverride, setSavingOverride] = useState(false);

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await githubApi.getRepos();
      setRepos(res.data);
    } catch (e) {
      console.error(e);
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
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleAnalyze = async (repoId) => {
    setAnalyzingId(repoId);
    try {
      const res = await projectsApi.analyzeRepo(repoId);
      // Update repo in list
      setRepos(prev => prev.map(r => r.id === repoId ? res.data : r));
      
      // If currently viewing this repo in drawer, update edit state
      if (selectedRepo && selectedRepo.id === repoId) {
        setSelectedRepo(res.data);
        const parsed = JSON.parse(res.data.analysisResult);
        setEditableAnalysis(parsed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingId(null);
    }
  };

  const openDrawer = (repo) => {
    setSelectedRepo(repo);
    if (repo.analysisResult) {
      try {
        const parsed = JSON.parse(repo.analysisResult);
        setEditableAnalysis(parsed);
      } catch (e) {
        setEditableAnalysis({
          projectDescription: repo.description || '',
          keyFeatures: [],
          technologies: repo.language ? [repo.language] : [],
          challenges: [],
          improvements: []
        });
      }
    } else {
      setEditableAnalysis(null);
    }
    setDrawerOpen(true);
  };

  const saveOverrides = async () => {
    if (!selectedRepo || !editableAnalysis) return;
    setSavingOverride(true);
    try {
      const updatedJson = JSON.stringify({
        ...editableAnalysis,
        healthScore: selectedRepo.healthScore || 80
      });
      const res = await projectsApi.overrideAnalysis(selectedRepo.id, updatedJson);
      setRepos(prev => prev.map(r => r.id === selectedRepo.id ? res.data : r));
      setSelectedRepo(res.data);
      alert('AI analysis overrides saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save changes.');
    } finally {
      setSavingOverride(false);
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.repoName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left relative min-h-screen">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">GitHub Repository Sync</h1>
          <p className="text-gray-400 text-sm mt-1">Deep analyze repositories using AI to automatically compile descriptions and technical summaries.</p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-lg shadow-purple-600/10 cursor-pointer border border-purple-500/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync Repository List'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="glass-panel p-4 flex items-center gap-3 bg-white/5 border border-white/10 max-w-md">
        <Search className="w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter synced repositories..."
          className="bg-transparent border-0 outline-none text-white text-xs w-full placeholder-gray-500"
        />
      </div>

      {/* Repos Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs select-none">Loading repository list...</div>
      ) : filteredRepos.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-xs border border-white/5 rounded-2xl select-none">
          No repositories synced. Click "Sync Repository List" above to get started.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => {
            const hasAnalysis = !!repo.analysisResult;
            const isAnalyzing = analyzingId === repo.id;

            return (
              <div 
                key={repo.id}
                className="glass-panel p-6 bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="font-bold text-white text-sm truncate tracking-tight">{repo.repoName}</span>
                    {hasAnalysis ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold select-none">
                        Health: {repo.healthScore}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold select-none flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>Ready</span>
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-6 select-none">
                    {repo.language && (
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400 font-semibold">{repo.language}</span>
                    )}
                    <span>★ {repo.stars || 0}</span>
                    <span>⑂ {repo.forks || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 select-none">
                  <button
                    onClick={() => handleAnalyze(repo.id)}
                    disabled={isAnalyzing}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      hasAnalysis 
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                        : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/20'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkle className="w-3 h-3 text-purple-400" />
                        <span>{hasAnalysis ? 'Re-Analyze' : 'Deep Analyze'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openDrawer(repo)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && selectedRepo && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          
          {/* Drawer content body */}
          <div className="relative w-full max-w-xl h-full bg-[#0E0E0E] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Repository Details</span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">{selectedRepo.repoName}</h2>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Analysis contents */}
              {!selectedRepo.analysisResult ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <BookOpen className="w-8 h-8 text-gray-600" />
                  <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                    This project has not been analyzed by DevPortfolio AI yet. Click analyze below to trigger prompt generation.
                  </p>
                  <button
                    onClick={() => handleAnalyze(selectedRepo.id)}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkle className="w-3.5 h-3.5" />
                    <span>Trigger AI Analysis</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6 pb-20">
                  {/* Summary Block */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">AI Generated Summary</label>
                    <textarea
                      value={editableAnalysis?.projectDescription || ''}
                      onChange={(e) => setEditableAnalysis(prev => ({ ...prev, projectDescription: e.target.value }))}
                      rows={3}
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Tech stack items */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Technologies used (Comma separated)</label>
                    <input
                      type="text"
                      value={editableAnalysis?.technologies?.join(', ') || ''}
                      onChange={(e) => setEditableAnalysis(prev => ({ ...prev, technologies: e.target.value.split(',').map(s => s.trim()) }))}
                      className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {/* Key Features list */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Key Achievements / Features</label>
                    <textarea
                      value={editableAnalysis?.keyFeatures?.join('\n') || ''}
                      onChange={(e) => setEditableAnalysis(prev => ({ ...prev, keyFeatures: e.target.value.split('\n') }))}
                      rows={4}
                      placeholder="One feature per line..."
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Challenges list */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Engineering Challenges Solved</label>
                    <textarea
                      value={editableAnalysis?.challenges?.join('\n') || ''}
                      onChange={(e) => setEditableAnalysis(prev => ({ ...prev, challenges: e.target.value.split('\n') }))}
                      rows={3}
                      placeholder="One challenge per line..."
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50 leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions footer */}
            {selectedRepo.analysisResult && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-[#0E0E0E] flex gap-4">
                <button
                  onClick={saveOverrides}
                  disabled={savingOverride}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-lg shadow-purple-600/10 cursor-pointer"
                >
                  {savingOverride ? 'Saving...' : 'Save Manual Overrides'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
