import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Key } from 'lucide-react';
import { GithubIcon } from '../components/ui/BrandIcons';
import { authApi } from '../services/api';


export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const exchangedRef = useRef(false); // Guard: only exchange code once

  // Mapped to GitHub client configurations
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'placeholder-client';
  const REDIRECT_URI = window.location.origin + '/login';

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !exchangedRef.current) {
      exchangedRef.current = true; // Mark as consumed immediately
      handleOAuthCallback(code);
    }
  }, [searchParams]);

  const handleOAuthCallback = async (code) => {
    setLoading(true);
    setError(null);
    // Clear any stale tokens before the fresh OAuth exchange
    localStorage.removeItem('devfolio_token');
    localStorage.removeItem('devportfolio_user');
    try {
      const response = await authApi.loginWithGitHub(code, REDIRECT_URI);
      const { token, username, name, avatarUrl } = response.data;

      localStorage.setItem('devfolio_token', token);
      localStorage.setItem('devportfolio_user', JSON.stringify({ username, name, avatarUrl }));

      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      const data = err.response?.data;
      const msg = typeof data === 'string'
        ? data
        : (data?.message || data?.error || 'GitHub authentication exchange failed. Check backend credentials.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const triggerGitHubLogin = () => {
    // redirect_uri MUST match in both authorization AND token exchange steps
    const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user,repo`;
    window.location.href = oauthUrl;
  };

  const handleMockLogin = () => {
    // Generate static mock session details for instant local preview
    localStorage.setItem('devfolio_token', 'mock-jwt-token-value-here');
    localStorage.setItem('devportfolio_user', JSON.stringify({
      username: 'octocat',
      name: 'The Octocat',
      avatarUrl: 'https://avatars.githubusercontent.com/u/5832347?v=4'
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-grid-pattern flex items-center justify-center p-6 relative">
      <div className="glow-orb w-[400px] h-[400px] bg-orange-500/10 -top-20" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel p-8 text-center bg-black/40 relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-orange-500/20 blur-2xl" />

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Devfolio</h1>
        <p className="text-gray-400 text-sm mb-8">Sign in with your GitHub account to sync repositories and start generating your AI portfolio.</p>

        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-xs text-left mb-6 leading-relaxed">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={triggerGitHubLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 cursor-pointer border border-orange-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GithubIcon className="w-4 h-4" />
            )}
            <span>Connect GitHub Developer Account</span>
          </button>

          <button
            onClick={handleMockLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-all flex items-center justify-center gap-2 border border-white/5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Developer Sandbox Bypass (Mock Mode)</span>
          </button>
        </div>

        <div className="mt-8 text-[11px] text-gray-500 leading-relaxed">
          Secure OAuth connection. We only request permissions to view profile details and read repository trees.
        </div>
      </motion.div>
    </div>
  );
}
