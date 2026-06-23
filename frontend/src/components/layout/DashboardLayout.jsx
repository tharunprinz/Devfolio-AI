import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('devportfolio_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] bg-grid-pattern relative overflow-x-hidden">
      {/* Background wander glow effects */}
      <div className="glow-orb w-[500px] h-[500px] -top-40 -left-40 bg-orange-500/15" />
      <div className="glow-orb w-[400px] h-[400px] bottom-10 right-10 bg-amber-500/10" style={{ animationDelay: '-5s' }} />

      {/* Navigation sidebar */}
      <Sidebar />

      {/* Workspace panel */}
      <div className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <main className="flex-1 p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-4 px-8 border-t border-white/5 text-center">
          <a
            href="https://github.com/tharunprinz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-orange-400 transition-colors duration-200 group"
          >
            <span>Built by</span>
            <span className="font-semibold text-gray-500 group-hover:text-orange-400 transition-colors">Tharun R</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}
