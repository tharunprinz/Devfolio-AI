import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle } from 'lucide-react';
import { authApi } from '../../services/api';
import { GithubIcon } from '../ui/BrandIcons';

export default function Navbar() {
  const user = authApi.getCurrentUser();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 select-none">
      <div className="glass-panel flex items-center justify-between px-6 py-3.5 bg-black/40">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center">
            <Sparkle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">DevPortfolio <span className="text-purple-400 text-xs">AI</span></span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">Features</button>
          <button onClick={() => scrollToSection('templates')} className="hover:text-white transition-colors cursor-pointer">Templates</button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">FAQ</button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* GitHub Profile Button */}
          <a
            href="https://github.com/tharunprinz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
            title="tharunprinz on GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">tharunprinz</span>
          </a>

          {/* Login / Dashboard */}
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 transition-colors shadow-lg shadow-white/5"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 border border-purple-500/30"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
