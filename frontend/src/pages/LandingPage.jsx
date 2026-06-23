import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkle, 
  ArrowRight, 
  Cpu, 
  Briefcase, 
  Layers, 
  Maximize2, 
  MessageSquare, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { GithubIcon } from '../components/ui/BrandIcons';
import Navbar from '../components/layout/Navbar';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    { icon: GithubIcon, title: "GitHub OAuth Sync", desc: "Connect securely with one click. We import repos, languages, forks, and readme files instantly." },
    { icon: Cpu, title: "AI Portfolio Writer", desc: "No more writers block. Our AI writes clean, engaging descriptions of your projects and experiences automatically." },
    { icon: Layers, title: "Premium Templates", desc: "Stand out with layouts styled in Apple Vision, Glassmorphism Pro, Cyberpunk, or Minimal themes." },
    { icon: Briefcase, title: "ATS Resume Builder", desc: "Generate pixel-perfect PDF/DOCX resumes. Enhance wording with custom AI prompts." },
    { icon: MessageSquare, title: "Recruiter Portfolio Chatbot", desc: "Visitors can chat with an AI assistant that answer questions about your technical expertise based on your profile." },
    { icon: ShieldCheck, title: "SEO Optimization", desc: "Get found by hiring teams. Auto-generated meta titles, keyword cards, and OG tags." },
  ];


  const templates = [
    { name: "Apple Style", theme: "Sleek, minimalist, premium hardware aesthetic." },
    { name: "Glassmorphism Pro", theme: "Frosted cards, subtle overlays, deep radial blurs." },
    { name: "Cyberpunk", theme: "Neon glow lines, retro-future console vibes." },
    { name: "Minimal Developer", theme: "Pure text, rapid focus, print-layout clean." },
    { name: "Startup Founder", theme: "Feature grids, bold colors, tech executive bio." },
  ];

  const pricing = [
    {
      name: "Free Sandbox",
      price: "$0",
      period: "forever",
      desc: "For developer side-projects and simple summaries.",
      features: [
        "Sync up to 5 repositories",
        "1 Standard portfolio design template",
        "Basic skill extraction",
        "PDF Resume exports"
      ],
      cta: "Generate Free Portfolio",
      primary: false
    },
    {
      name: "Developer Pro",
      price: "$49",
      period: "month",
      desc: "The ultimate portfolio kit to stand out from candidates.",
      features: [
        "Sync unlimited repositories",
        "Unlock all 5 premium templates",
        "Interactive AI Recruiter Chatbot",
        "Deep AI Career Insights & Roast Mode",
        "Unlimited ATS Resume polishes & exports",
        "Custom SEO configuration tags"
      ],
      cta: "Start Pro Trial",
      primary: true
    }
  ];

  const faqs = [
    { q: "How does the AI write project summaries?", a: "When you sync repositories, DevPortfolio AI parses their README, primary programming languages, and commit structure. It then sends this metadata to the Gemini API to write clear, ATS-friendly summaries of your achievements." },
    { q: "Can I host the portfolio on my own domain?", a: "Yes. In the Settings tab, you can assign a unique path suffix or hook up a custom domain redirection to point to your published portfolio page." },
    { q: "What is 'Roast Mode'?", a: "It is a fun developer feature! DevPortfolio AI reviews your repository metrics, stars, and language distribution, and generates a humorous, lighthearted roast about your coding habits." },
    { q: "How does the recruiter chatbot work?", a: "You can embed a small chatbot widget directly on your portfolio. When a recruiter asks a question (e.g. 'Has this dev used React?'), the chatbot replies in real-time based on your saved profile and synced achievements." }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid-pattern text-white relative">
      {/* Background wanders */}
      <div className="glow-orb w-[600px] h-[600px] -top-80 -left-60 bg-purple-500/10" />
      <div className="glow-orb w-[500px] h-[500px] top-[40%] right-[-100px] bg-blue-500/10" style={{ animationDelay: '-10s' }} />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-300 text-xs font-semibold mb-6 shadow-md"
        >
          <Sparkle className="w-3.5 h-3.5" />
          <span>DevPortfolio AI v1.0 Launched</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl text-gradient mb-6"
        >
          Your GitHub Already Knows Your Story.<br />
          <span className="text-gradient-purple-blue">Let AI Build Your Portfolio.</span>
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
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-all duration-300 shadow-xl shadow-purple-600/20 text-sm group"
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
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gradient-purple-blue">Select Premium Theme Layouts</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">Toggle custom layouts in real-time, instantly rendering code languages and stars.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((temp, index) => (
            <div key={index} className="glass-panel p-6 bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all text-left">
              <div className="h-32 rounded-xl bg-black/40 border border-white/5 mb-4 flex items-center justify-center font-bold text-gray-500 text-sm italic">
                {temp.name} Preview
              </div>
              <h3 className="font-bold text-white text-base mb-1">{temp.name}</h3>
              <p className="text-gray-400 text-xs">{temp.theme}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Grid */}
      <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Choose Your Career Engine</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">Get hired faster with AI-augmented profiles and ATS resume builders.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricing.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-panel p-8 flex flex-col text-left relative ${
                plan.primary ? 'border-purple-500 bg-purple-500/5' : 'bg-white/5'
              }`}
            >
              {plan.primary && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-purple-600 text-[10px] font-bold tracking-wide rounded-full text-white uppercase">
                  Best Value
                </span>
              )}
              <h3 className="font-bold text-lg text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400 text-xs">/{plan.period}</span>
              </div>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">{plan.desc}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/login"
                className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-all duration-300 ${
                  plan.primary 
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/10' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Frequently Answered Questions</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">Everything you need to know about our developer builder tools.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="glass-panel overflow-hidden border border-white/5 cursor-pointer bg-white/5"
                onClick={() => setActiveFaq(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between p-5 select-none">
                  <span className="font-semibold text-sm text-white">{faq.q}</span>
                  <span className="text-purple-400 font-bold">{isOpen ? '−' : '+'}</span>
                </div>
                
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-gray-400 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkle className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-white">DevPortfolio AI</span>
        </div>
        <p className="mb-3">© 2026 DevPortfolio AI. All rights reserved. Premium software for engineers.</p>
        <a
          href="https://github.com/tharunprinz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-purple-400 transition-colors duration-200 group"
        >
          <span>Built by</span>
          <span className="font-semibold text-gray-400 group-hover:text-purple-400 transition-colors">Tharun R</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
