import React, { useState, useEffect } from 'react';
import { 
  Sparkle, 
  Settings, 
  ExternalLink, 
  Eye, 
  Check, 
  Layers, 
  HelpCircle,
  Save,
  MessageSquare,
  Globe
} from 'lucide-react';
import { portfoliosApi, githubApi } from '../../services/api';

export default function PortfolioBuilder() {
  const [portfolios, setPortfolios] = useState([]);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [repos, setRepos] = useState([]);
  
  // Custom states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Editor state
  const [selectedTemplate, setSelectedTemplate] = useState('glassmorphism');
  const [content, setContent] = useState(null);
  const [seo, setSeo] = useState(null);
  const [chatbot, setChatbot] = useState(null);
  const [publishedUrl, setPublishedUrl] = useState('');

  useEffect(() => {
    fetchInitialDetails();
  }, []);

  const fetchInitialDetails = async () => {
    setLoading(true);
    try {
      const repoRes = await githubApi.getRepos();
      setRepos(repoRes.data);

      const res = await portfoliosApi.getPortfolios();
      setPortfolios(res.data);

      if (res.data.length > 0) {
        loadPortfolioToEditor(res.data[0]);
      } else {
        // Create initial portfolio automatically
        const initRes = await portfoliosApi.createPortfolio('glassmorphism');
        setPortfolios([initRes.data]);
        loadPortfolioToEditor(initRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolioToEditor = (port) => {
    setActivePortfolio(port);
    setSelectedTemplate(port.templateName);
    setPublishedUrl(port.publishedUrl || '');
    try {
      setContent(JSON.parse(port.generatedContent));
      setSeo(JSON.parse(port.seoTags));
      setChatbot(JSON.parse(port.chatbotSettings));
    } catch (e) {
      console.error("Parse error on portfolio fields", e);
    }
  };

  const handleTemplateChange = (tempName) => {
    setSelectedTemplate(tempName);
  };

  const handleSave = async () => {
    if (!activePortfolio) return;
    setSaving(true);
    try {
      const payload = {
        templateName: selectedTemplate,
        generatedContent: content,
        seoTags: seo,
        chatbotSettings: chatbot,
        publishedUrl
      };
      const res = await portfoliosApi.updatePortfolio(activePortfolio.id, payload);
      // Update in lists
      setPortfolios(prev => prev.map(p => p.id === activePortfolio.id ? res.data : p));
      setActivePortfolio(res.data);
      alert('Portfolio configurations saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Save failed: ' + (e.response?.data || e.message));
    } finally {
      setSaving(false);
    }
  };

  const handleProjectToggle = (repoId, repoName, description, language) => {
    if (!content) return;
    const currentProjects = [...(content.projects || [])];
    const existsIdx = currentProjects.findIndex(p => p.id === repoId);

    if (existsIdx > -1) {
      // Remove
      currentProjects.splice(existsIdx, 1);
    } else {
      // Add
      currentProjects.push({
        id: repoId,
        title: repoName,
        summary: description || "No summary available.",
        language: language,
        stars: 0
      });
    }

    setContent(prev => ({
      ...prev,
      projects: currentProjects
    }));
  };

  if (loading || !content) {
    return <div className="py-20 text-center text-gray-400 text-xs select-none">Loading portfolio canvas workspace...</div>;
  }

  return (
    <div className="space-y-6 text-left relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Portfolio Canvas</h1>
          <p className="text-gray-400 text-sm mt-1">Design your public profile website using premium aesthetic presets.</p>
        </div>

        <div className="flex gap-3">
          <a
            href={`/p/${activePortfolio.publishedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 font-semibold text-xs hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Site</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500 disabled:opacity-50 transition-colors shadow-lg shadow-purple-600/10 cursor-pointer border border-purple-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Builder Workspace Split */}
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left Side: Configurations */}
        <div className="lg:col-span-2 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          
          {/* Template Selectors */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
            <h2 className="font-bold text-sm text-white flex items-center gap-2 select-none">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Select UI Preset</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 select-none">
              {['apple', 'glassmorphism', 'cyberpunk', 'minimal', 'startup'].map((temp) => (
                <button
                  key={temp}
                  onClick={() => handleTemplateChange(temp)}
                  className={`p-3 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer capitalize ${
                    selectedTemplate === temp
                      ? 'bg-purple-600/10 border-purple-500 text-white shadow-lg'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {temp === 'startup' ? 'Startup Founder' : temp === 'minimal' ? 'Minimal Developer' : temp === 'apple' ? 'Apple Style' : temp === 'glassmorphism' ? 'Glassmorphism Pro' : 'Cyberpunk'}
                </button>
              ))}
            </div>
          </div>

          {/* Copywriter sections */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-5">
            <h2 className="font-bold text-sm text-white select-none">Profile Details</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Hero Greeting / Title</label>
                <input 
                  type="text" 
                  value={content?.hero?.title || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value }
                  }))}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Hero Subtitle / Bio</label>
                <textarea 
                  value={content?.hero?.subtitle || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value }
                  }))}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Detailed About Narrative</label>
                <textarea 
                  value={content?.about?.bio || ''}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    about: { ...prev.about, bio: e.target.value }
                  }))}
                  rows={4}
                  className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          {/* Repo selector list */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
            <h2 className="font-bold text-sm text-white select-none">Featured Repositories</h2>

            {repos.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center select-none">No synced repos found.</p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 select-none">
                {repos.map((repo) => {
                  const isChecked = content.projects?.some(p => p.id === repo.id);
                  return (
                    <div 
                      key={repo.id}
                      onClick={() => handleProjectToggle(repo.id, repo.repoName, repo.description, repo.language)}
                      className={`flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked 
                          ? 'border-purple-500 bg-purple-500/5' 
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <span className="block text-xs font-bold text-white truncate">{repo.repoName}</span>
                        <span className="block text-[9px] text-gray-500 truncate">{repo.language || 'Unknown language'}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                        isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-600'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SEO & Chatbot configuration */}
          <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-5">
            <h2 className="font-bold text-sm text-white select-none">Addons Config</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>Public URL path</span>
                </label>
                <input 
                  type="text" 
                  value={publishedUrl}
                  onChange={(e) => setPublishedUrl(e.target.value)}
                  placeholder="e.g. janesmith"
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase select-none flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-purple-400" />
                  <span>Recruiter Chatbot greeting</span>
                </label>
                <input 
                  type="text" 
                  value={chatbot?.welcomeMessage || ''}
                  onChange={(e) => setChatbot(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Visual preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2 select-none">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Canvas Visual Editor Preview</span>
            </span>
          </div>

          <div className="w-full aspect-[4/3] rounded-3xl border border-white/10 bg-[#070707] shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Mock browser header frame */}
            <div className="h-10 bg-white/5 border-b border-white/5 px-4 flex items-center gap-2 shrink-0 select-none">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="mx-auto w-64 bg-white/5 border border-white/5 rounded-lg py-1 text-[10px] text-center text-gray-500 font-mono truncate">
                portfolio.dev/p/{publishedUrl || 'preview'}
              </div>
            </div>

            {/* Template Preview Body */}
            <div className="flex-1 overflow-y-auto p-8 relative scrollbar-none text-left">
              
              {/* Glassmorphism Template Theme preview */}
              {selectedTemplate === 'glassmorphism' && (
                <div className="space-y-8">
                  {/* Subtle orb background in preview container */}
                  <div className="absolute top-10 right-10 w-44 h-44 rounded-full bg-purple-600/10 blur-xl pointer-events-none" />
                  
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{content?.hero?.title}</h1>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-md">{content?.hero?.subtitle}</p>
                    <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-[10px] font-bold mt-2 shadow-md">
                      {content?.hero?.ctaText || 'View Projects'}
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                    <span className="text-[10px] text-purple-400 font-bold uppercase">About Me</span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">{content?.about?.bio}</p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] text-purple-400 font-bold uppercase">Featured Projects</span>
                    <div className="grid grid-cols-2 gap-4">
                      {content.projects?.map((p, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5">
                          <span className="block font-bold text-xs text-white truncate">{p.title}</span>
                          <span className="block text-[9px] text-purple-400 mt-1">{p.language}</span>
                          <p className="text-gray-400 text-[10px] line-clamp-2 mt-2 leading-relaxed">{p.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Apple Theme preview */}
              {selectedTemplate === 'apple' && (
                <div className="space-y-6 font-sans">
                  <div className="text-center py-6 space-y-2">
                    <h1 className="text-3xl font-extrabold text-white tracking-tighter">{content?.hero?.title}</h1>
                    <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">{content?.hero?.subtitle}</p>
                  </div>
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Developer Profile</span>
                    <p className="text-gray-300 text-xs leading-relaxed">{content?.about?.bio}</p>
                  </div>
                </div>
              )}

              {/* Cyberpunk Theme preview */}
              {selectedTemplate === 'cyberpunk' && (
                <div className="space-y-6 font-mono border border-cyan-500/20 p-6 bg-cyan-950/5 relative">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 animate-pulse" />
                  <div className="space-y-2">
                    <span className="text-[9px] text-cyan-400 font-bold">[ SYSTEM_ACTIVE ]</span>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">{content?.hero?.title}</h1>
                    <p className="text-cyan-300 text-[11px] font-semibold leading-relaxed">{content?.hero?.subtitle}</p>
                  </div>
                  <div className="border-t border-cyan-500/10 pt-4 text-xs text-gray-400">
                    <p className="leading-relaxed">&gt; {content?.about?.bio}</p>
                  </div>
                </div>
              )}

              {/* Minimal Developer Theme */}
              {selectedTemplate === 'minimal' && (
                <div className="space-y-6 max-w-md">
                  <h1 className="text-xl font-bold text-white">{content?.name || 'Developer'}</h1>
                  <p className="text-gray-400 text-xs leading-relaxed">{content?.about?.bio}</p>
                  <div className="space-y-2 pt-4">
                    <span className="text-[10px] font-semibold text-gray-500 tracking-wider">PROJECTS</span>
                    {content.projects?.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-baseline text-xs text-gray-300">
                        <span className="font-semibold text-white">{p.title}</span>
                        <span className="text-[10px] text-gray-500">{p.language}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Startup Founder Theme */}
              {selectedTemplate === 'startup' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white text-xs">SF</div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{content?.hero?.title}</h1>
                    <p className="text-gray-400 text-xs">{content?.hero?.subtitle}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/10 text-xs text-purple-300 leading-relaxed">
                    {content?.about?.bio}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
