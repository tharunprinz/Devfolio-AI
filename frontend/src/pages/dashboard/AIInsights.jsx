import React, { useState, useEffect } from 'react';
import { 
  Sparkle, 
  Wand2, 
  HelpCircle, 
  Smile, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  AlertOctagon,
  BookOpen,
  Send,
  Copy,
  FileDown,
  Terminal,
  Loader2
} from 'lucide-react';
import { aiApi } from '../../services/api';

export default function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cover Letter states
  const [jobDesc, setJobDesc] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);

  // LinkedIn states
  const [tone, setTone] = useState('professional');
  const [linkedinText, setLinkedinText] = useState('');
  const [generatingLinkedin, setGeneratingLinkedin] = useState(false);

  // Roast states
  const [roast, setRoast] = useState('');
  const [roasting, setRoasting] = useState(false);
  const [roastModal, setRoastModal] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await aiApi.getInsights();
      setInsights(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await aiApi.regenerateInsights();
      setInsights(res.data);
      alert('Career insights recalculated using fresh sync data!');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDesc) return;
    setGeneratingLetter(true);
    try {
      const res = await aiApi.generateCoverLetter(jobDesc, company, role);
      setCoverLetter(res.data.coverLetter);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleGenerateLinkedIn = async () => {
    setGeneratingLinkedin(true);
    try {
      const res = await aiApi.generateLinkedInAbout(tone);
      setLinkedinText(res.data.linkedinAbout);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingLinkedin(false);
    }
  };

  const triggerRoast = async () => {
    setRoasting(true);
    setRoastModal(true);
    try {
      const res = await aiApi.getRoast();
      // Axios may already parse JSON — handle both string and object
      const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      setRoast(parsed.roast || "Your code is so clean, I couldn't find anything to roast. Boring!");
    } catch (e) {
      console.error('Roast error:', e);
      setRoast("Your repos are so mysterious, my sarcasm parser timed out. Sync more repos and try again!");
    } finally {
      setRoasting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadCoverLetterPdf = () => {
    if (!coverLetter) return;
    const printWindow = window.open('', '_blank');
    const safeLetter = coverLetter.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const htmlContent = `<!DOCTYPE html><html><head><title>Cover Letter</title>
      <style>
        body{font-family:'Georgia',serif;max-width:700px;margin:60px auto;color:#111;font-size:14px;line-height:1.9;}
        h1{font-size:18px;font-family:sans-serif;font-weight:bold;margin-bottom:28px;color:#333;border-bottom:2px solid #f97316;padding-bottom:10px;}
        p{white-space:pre-wrap;margin:0;}
        @media print{body{margin:40px;}}
      </style></head>
      <body><h1>Cover Letter</h1><p>${safeLetter}</p>
      <script>window.onload=function(){window.print();window.close();};</script>
      </body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Helper parsers
  const parseJsonList = (str) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch (e) {
      return [];
    }
  };

  const parseJsonMap = (str) => {
    if (!str) return {};
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };

  if (loading || !insights) {
    return <div className="py-20 text-center text-gray-400 text-xs select-none">Loading AI career insights...</div>;
  }

  const strengths = parseJsonList(insights.strengths);
  const weaknesses = parseJsonList(insights.weaknesses);
  const recommendations = parseJsonList(insights.recommendations);
  const skillGap = parseJsonMap(insights.skillGap);

  return (
    <div className="space-y-8 text-left relative min-h-screen">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Career Insights</h1>
          <p className="text-gray-400 text-sm mt-1">Optimize your profile matching ratios and address skill deficits.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={triggerRoast}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer border border-red-500/20 shadow-lg shadow-red-600/10"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>GitHub Roast Mode</span>
          </button>

          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/15 cursor-pointer border border-orange-500/20"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Regenerate Insights</span>
          </button>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-8 select-none">
        <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Developer Strengths</span>
          </h2>
          <ul className="space-y-3">
            {strengths.map((str, idx) => (
              <li key={idx} className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-gray-300 leading-relaxed">
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Deficits / Code Weaknesses</span>
          </h2>
          <ul className="space-y-3">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-gray-300 leading-relaxed">
                {weak}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Target Role Skill Gap Analyzer */}
      <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-6 select-none">
        <h2 className="font-bold text-sm text-white">Target Role Match & Skill Gap</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(skillGap).map(([roleName, data]) => (
            <div key={roleName} className="p-5 rounded-2xl border border-white/5 bg-black/20 flex flex-col justify-between">
              <div>
                <span className="block font-bold text-xs text-white tracking-tight">{roleName}</span>
                <div className="flex items-baseline gap-1.5 my-3">
                  <span className="text-3xl font-extrabold text-white">{data.matchPercentage}%</span>
                  <span className="text-gray-500 text-[10px] uppercase font-bold">Match Ratio</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${data.matchPercentage}%` }} />
                </div>
              </div>

              <div>
                <span className="block text-[9px] text-gray-500 font-bold uppercase mb-2">Missing Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {(data.missingSkills || []).map((ms) => (
                    <span key={ms} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-semibold">{ms}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cover Letter & LinkedIn Builders Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Cover Letter Builder */}
        <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-sm text-white flex items-center gap-2 select-none">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Cover Letter Generator</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-white text-xs outline-none"
              />
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role Title"
                className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-white text-xs outline-none"
              />
            </div>
            
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description keywords here..."
              rows={4}
              className="w-full p-3.5 rounded-xl bg-black/40 border border-white/5 text-white text-xs outline-none leading-relaxed resize-none"
            />
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleGenerateCoverLetter}
              disabled={generatingLetter || !jobDesc}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 transition-all cursor-pointer select-none"
            >
              {generatingLetter ? 'Analyzing requirements...' : 'Generate Target Cover Letter'}
            </button>

            {coverLetter && (
              <div className="p-4 rounded-xl border border-orange-500/10 bg-black/60 relative">
                <div className="absolute top-2 right-2 flex gap-1">
                  <button 
                    onClick={() => copyToClipboard(coverLetter)}
                    title="Copy to clipboard"
                    className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={downloadCoverLetterPdf}
                    title="Save as PDF"
                    className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-gray-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed text-left pr-12">
                  {coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn about generator */}
        <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-sm text-white flex items-center gap-2 select-none">
              <Award className="w-4 h-4 text-amber-400" />
              <span>LinkedIn Bio Generator</span>
            </h2>

            <div className="space-y-2 text-left">
              <label className="text-[10px] text-gray-500 font-bold uppercase select-none">Narrative Tone Selection</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/5 text-white text-xs outline-none"
              >
                <option value="professional">Professional & Technical</option>
                <option value="bold">Bold & Innovation-driven</option>
                <option value="humble">Humble Developer bio</option>
                <option value="creative">Creative storytelling</option>
              </select>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleGenerateLinkedIn}
              disabled={generatingLinkedin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-semibold hover:from-orange-400 hover:to-amber-300 disabled:opacity-50 transition-all cursor-pointer select-none btn-glow"
            >
              {generatingLinkedin ? 'Writing summary...' : 'Generate LinkedIn Summary'}
            </button>

            {linkedinText && (
              <div className="p-4 rounded-xl border border-white/5 bg-black/60 relative">
                <button 
                  onClick={() => copyToClipboard(linkedinText)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-gray-300 leading-relaxed text-left pr-4">
                  {linkedinText}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Roast Mode Modal */}
      {roastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 select-none">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRoastModal(false)} />
          
          <div className="relative w-full max-w-lg glass-panel bg-black/90 border border-red-500/30 p-6 space-y-6 text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-red-500">
                <Terminal className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">git-critic --roast</span>
              </div>
              <button 
                onClick={() => setRoastModal(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Terminal Body */}
            <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 font-mono text-xs text-green-400 space-y-4 min-h-48 flex flex-col justify-center">
              {roasting ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span className="text-gray-500 text-[10px]">Analyzing repository quality and commits...</span>
                </div>
              ) : (
                <p className="leading-relaxed text-red-400">
                  {roast}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRoastModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close critique
              </button>
              {!roasting && (
                <button
                  onClick={triggerRoast}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Roast again
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
