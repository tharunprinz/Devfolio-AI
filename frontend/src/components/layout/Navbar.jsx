import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle } from 'lucide-react';
import { authApi } from '../../services/api';
import { GithubIcon } from '../ui/BrandIcons';

export default function Navbar() {
  const user = authApi.getCurrentUser();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 select-none">
      <div className="glass-panel flex items-center justify-between px-6 py-3.5 bg-black/40">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Sparkle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">Devfolio <span className="text-amber-400 text-xs">AI</span></span>
        </Link>

        {/* Nav — Features only */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-orange-300 transition-colors cursor-pointer"
          >
            Features
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/tharunprinz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-orange-500/8 border border-white/10 hover:border-orange-500/20 transition-all duration-200"
            title="tharunprinz on GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tharun R</span>
          </a>

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
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:from-orange-400 hover:to-amber-300 transition-all shadow-lg shadow-orange-500/25 btn-glow"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
