import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Sparkle, 
  Mail, 
  Code,
  AlertCircle,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../components/ui/BrandIcons';
import { portfoliosApi } from '../services/api';
import ChatbotWidget from '../components/portfolio/ChatbotWidget';

export default function PublicPortfolio() {
  const { publishedUrl } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parsed subfields
  const [content, setContent] = useState(null);
  const [seo, setSeo] = useState(null);
  const [chatbot, setChatbot] = useState(null);

  useEffect(() => {
    fetchPortfolioData();
  }, [publishedUrl]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await portfoliosApi.getPublicPortfolio(publishedUrl);
      setPortfolio(res.data);
      
      const parsedContent = JSON.parse(res.data.generatedContent);
      const parsedSeo = JSON.parse(res.data.seoTags);
      const parsedChatbot = JSON.parse(res.data.chatbotSettings);

      setContent(parsedContent);
      setSeo(parsedSeo);
      setChatbot(parsedChatbot);

      // Apply dynamic SEO parameters
      if (parsedSeo?.title) {
        document.title = parsedSeo.title;
      }
    } catch (e) {
      console.error(e);
      setError('Published portfolio not found or connection failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-gray-500 text-xs">
        Loading developer site...
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 text-center p-6 select-none">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <h1 className="text-xl font-bold text-white">Portfolio Unavailable</h1>
        <p className="text-gray-400 text-xs max-w-xs">{error}</p>
      </div>
    );
  }

  const template = portfolio.templateName;

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative text-left">
      
      {/* Background radial glares */}
      <div className="glow-orb w-[500px] h-[500px] -top-40 -left-40 bg-orange-500/10" />
      <div className="glow-orb w-[400px] h-[400px] bottom-10 right-10 bg-amber-500/5" style={{ animationDelay: '-8s' }} />

      {/* RENDER THEMES */}
      
      {/* 1. GLASSMORPHISM THEME */}
      {template === 'glassmorphism' && (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{content.hero?.title}</h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">{content.hero?.subtitle}</p>
          </div>

          {/* About Panel */}
          <div className="glass-panel p-8 bg-white/5 border border-white/10 space-y-3">
            <h2 className="font-bold text-xs text-amber-400 uppercase tracking-widest">About Me</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{content.about?.bio}</p>
          </div>

          {/* Skills categories grid */}
          <div className="space-y-4">
            <h2 className="font-bold text-xs text-amber-400 uppercase tracking-widest">Core Capabilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(content.skills || {}).map(([cat, list]) => (
                <div key={cat} className="glass-panel p-4 bg-white/5 border border-white/5">
                  <span className="block font-bold text-xs text-white mb-2">{cat}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(list || []).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-[10px]">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h2 className="font-bold text-xs text-amber-400 uppercase tracking-widest font-sans">Projects Portfolio</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.projects?.map((proj, idx) => (
                <div key={idx} className="glass-panel p-6 bg-white/5 border border-white/10 hover:border-orange-500/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-bold text-white text-sm truncate tracking-tight">{proj.title}</span>
                      {proj.language && (
                        <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-amber-400 text-[9px] font-bold">{proj.language}</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-3 leading-relaxed">{proj.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experiences */}
          <div className="space-y-4">
            <h2 className="font-bold text-xs text-amber-400 uppercase tracking-widest">Experience</h2>
            <div className="space-y-4">
              {content.experiences?.map((exp, idx) => (
                <div key={idx} className="glass-panel p-6 bg-white/5 border border-white/5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="block font-bold text-white text-xs">{exp.role}</span>
                      <span className="block text-[11px] text-gray-400 mt-0.5">{exp.company}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-sans">{exp.duration}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-3 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="glass-panel p-8 bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <span className="block font-bold text-white text-sm">Let's build something epic</span>
              <span className="block text-xs text-gray-400 mt-1">Get in touch about contract work or engineering hires.</span>
            </div>
            <div className="flex gap-4">
              {content.contact?.email && (
                <a href={`mailto:${content.contact.email}`} className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {content.contact?.github && (
                <a href={content.contact.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {content.contact?.linkedin && (
                <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. APPLE STYLE THEME */}
      {template === 'apple' && (
        <div className="max-w-3xl mx-auto px-6 py-20 space-y-12 font-sans">
          <div className="text-center py-10 space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">{content.hero?.title}</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">{content.hero?.subtitle}</p>
          </div>

          <div className="border-t border-white/5 pt-10 space-y-4">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Biography</span>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{content.about?.bio}</p>
          </div>

          <div className="border-t border-white/5 pt-10 space-y-6">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Featured Creations</span>
            <div className="space-y-4">
              {content.projects?.map((p, idx) => (
                <div key={idx} className="flex justify-between items-start py-4 border-b border-white/5">
                  <div>
                    <span className="block font-bold text-white text-xs">{p.title}</span>
                    <p className="text-gray-400 text-xs mt-1 max-w-lg leading-relaxed">{p.summary}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">{p.language}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CYBERPUNK THEME */}
      {template === 'cyberpunk' && (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-12 font-mono text-amber-400">
          <div className="border border-amber-500/20 p-8 bg-amber-950/5 relative overflow-hidden space-y-4">
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 animate-ping" />
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">// INITIALIZING PORTFOLIO SESSION</span>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">{content.hero?.title}</h1>
            <p className="text-amber-300 text-xs sm:text-sm leading-relaxed">{content.hero?.subtitle}</p>
          </div>

          <div className="border border-amber-500/20 p-8 space-y-4 bg-amber-950/5">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">// DEVELOPER CORE NARRATIVE</span>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{content.about?.bio}</p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">// FEATURED REPOS MODULE</span>
            <div className="grid md:grid-cols-2 gap-6">
              {content.projects?.map((p, idx) => (
                <div key={idx} className="border border-amber-500/20 p-6 hover:border-amber-400 transition-colors bg-black/40">
                  <span className="block font-bold text-white text-xs uppercase">{p.title}</span>
                  <span className="block text-[10px] text-amber-400 mt-1">&gt; Language: {p.language}</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed mt-3">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MINIMAL DEVELOPER THEME */}
      {template === 'minimal' && (
        <div className="max-w-2xl mx-auto px-6 py-20 space-y-12 text-gray-300 font-serif">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">{content.name || 'Developer'}</h1>
            <p className="text-xs leading-relaxed max-w-md text-gray-400">{content.hero?.subtitle}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-justify">{content.about?.bio}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <span className="block text-[10px] font-sans font-bold text-gray-500 tracking-widest uppercase">Projects</span>
            <div className="space-y-4">
              {content.projects?.map((p, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-xs text-gray-400">
                  <span className="font-bold text-white">{p.title}</span>
                  <span className="text-[10px] font-mono text-gray-500">{p.language}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. STARTUP FOUNDER THEME */}
      {template === 'startup' && (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">
          <div className="space-y-6">
            <div className="inline-flex px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-amber-400 font-semibold text-[10px] uppercase rounded-full tracking-wider">
              Ready to ship
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">{content.hero?.title}</h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">{content.hero?.subtitle}</p>
          </div>

          <div className="p-6 rounded-2xl bg-orange-950/10 border border-orange-500/10 text-xs sm:text-sm text-amber-200 leading-relaxed text-justify">
            {content.about?.bio}
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-white text-base">Key Tech Inventions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.projects?.map((p, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-white text-xs">{p.title}</span>
                    <p className="text-gray-400 text-[11px] leading-relaxed mt-2">{p.summary}</p>
                  </div>
                  <span className="block text-[10px] text-amber-400 font-bold uppercase mt-4">{p.language}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Floating Chatbot widget */}
      <ChatbotWidget
        publishedUrl={publishedUrl}
        chatbotSettings={chatbot}
        developerName={content.name}
      />

    </div>
  );
}
