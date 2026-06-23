import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkle, 
  ArrowRight, 
  Cpu, 
  Briefcase, 
  Layers, 
  MessageSquare, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { GithubIcon } from '../components/ui/BrandIcons';
import Navbar from '../components/layout/Navbar';

export default function LandingPage() {
  const features = [
    { icon: GithubIcon, title: "GitHub OAuth Sync", desc: "Connect securely with one click. We import repos, languages, forks, and readme files instantly." },
    { icon: Cpu, title: "AI Portfolio Writer", desc: "No more writers block. Our AI writes clean, engaging descriptions of your projects and experiences automatically." },
    { icon: Layers, title: "Premium Templates", desc: "Stand out with layouts styled in Apple Vision, Glassmorphism Pro, Cyberpunk, or Minimal themes." },
    { icon: Briefcase, title: "ATS Resume Builder", desc: "Generate pixel-perfect PDF/DOCX resumes. Enhance wording with custom AI prompts." },
    { icon: MessageSquare, title: "Recruiter Portfolio Chatbot", desc: "Visitors can chat with an AI assistant that answers questions about your technical expertise based on your profile." },
    { icon: ShieldCheck, title: "SEO Optimization", desc: "Get found by hiring teams. Auto-generated meta titles, keyword cards, and OG tags." },
  ];

  const stats = [
    { value: "100+", label: "GitHub Repos Synced" },
    { value: "AI", label: "Powered Analysis" },
    { value: "5+", label: "Portfolio Templates" },
    { value: "< 2 min", label: "Setup Time" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid-pattern text-white relative">
      {/* Background orbs — new orange/teal */}
      <div className="glow-orb w-[600px] h-[600px] -top-80 -left-60 bg-orange-500/10" />
      <div className="glow-orb w-[500px] h-[500px] top-[40%] right-[-100px] bg-teal-500/10" style={{ animationDelay: '-10s' }} />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-300 text-xs font-semibold mb-6 shadow-md"
        >
          <Sparkle className="w-3.5 h-3.5" />
          <span>DevPortfolio AI v1.0 — Build Your Story in Minutes</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl text-gradient mb-6"
        >
          Your GitHub Already Knows Your Story.<br />
          <span className="text-gradient-orange-teal">Let AI Build Your Portfolio.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
        >
          Connect GitHub to automatically compile your repositories, extract programming skills, build ATS-friendly resumes, and deploy stunning developer sites in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-400 hover:to-amber-400 transition-all duration-300 shadow-xl shadow-orange-500/25 text-sm group"
          >
            <span>Generate Portfolio Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm cursor-pointer"
          >
            Explore Features
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 w-full max-w-3xl"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Engineered for Technical Portfolios</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">Stop writing bio descriptions from scratch. Let AI parse your codebase parameters directly.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div key={index} className="glass-panel p-6 glass-panel-hover flex flex-col items-start text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 text-orange-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-panel p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-teal-500/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-300 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Free to Get Started</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Your Portfolio is One <br />
              <span className="text-gradient-orange-teal">Click Away.</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Connect your GitHub and let AI do the heavy lifting. No design skills required. Go from code to portfolio in under 2 minutes.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:from-orange-400 hover:to-amber-400 transition-all duration-300 shadow-xl shadow-orange-500/25 text-sm group"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Connect GitHub & Build Portfolio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkle className="w-4 h-4 text-orange-400" />
          <span className="font-bold text-white">DevPortfolio AI</span>
        </div>
        <p className="mb-3">© 2026 DevPortfolio AI. All rights reserved. Premium software for engineers.</p>
        <a
          href="https://github.com/tharunprinz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-orange-400 transition-colors duration-200 group"
        >
          <span>Built by</span>
          <span className="font-semibold text-gray-400 group-hover:text-orange-400 transition-colors">Tharun R</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
