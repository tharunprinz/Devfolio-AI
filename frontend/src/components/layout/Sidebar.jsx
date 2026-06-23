import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Code, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Settings, 
  LogOut,
  Sparkle
} from 'lucide-react';
import { authApi } from '../../services/api';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/analysis', label: 'GitHub Analysis', icon: Code },
  { path: '/dashboard/portfolio', label: 'Portfolio Builder', icon: Briefcase },
  { path: '/dashboard/resume', label: 'Resume Builder', icon: FileText },
  { path: '/dashboard/insights', label: 'AI Insights', icon: Sparkles },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    navigate('/');
  };

  return (
    <aside className="w-68 h-[calc(100vh-2rem)] sticky top-4 left-4 flex flex-col glass-panel p-6 m-4 select-none">
      {/* Brand logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Sparkle className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-lg text-white leading-tight block">DevPortfolio</span>
          <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">AI Platform</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 group ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 bg-orange-500/10 border border-orange-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 z-10 transition-transform group-hover:scale-110 ${
                isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'
              }`} />
              <span className="z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info & Logout */}
      <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-9 h-9 rounded-full border border-white/20"
            />
            <div className="overflow-hidden">
              <span className="block text-sm font-semibold text-white truncate">{user.name}</span>
              <span className="block text-[11px] text-gray-400 truncate">@{user.username}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
