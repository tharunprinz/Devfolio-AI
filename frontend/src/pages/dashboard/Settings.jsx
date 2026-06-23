import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Key, Globe, Database, HelpCircle } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_override') || '');
  const [customDomain, setCustomDomain] = useState('');

  const handleSaveSettings = () => {
    if (apiKey) {
      localStorage.setItem('gemini_api_override', apiKey);
    } else {
      localStorage.removeItem('gemini_api_override');
    }
    alert('Local client configurations updated!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear your local session cache? This will log you out.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-6 text-left relative min-h-screen select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your integrations keys and custom profile routing links.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* API Credentials */}
        <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Developer Keys (Overrides)</span>
          </h2>
          <p className="text-gray-400 text-xs">If you prefer running API requests directly with your own Google Gemini Key, save it below. Otherwise, we default to the backend service mock engine.</p>
          
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase">Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-orange-500/40"
            />
          </div>
        </div>

        {/* Custom Domain routing */}
        <div className="glass-panel p-6 bg-white/5 border border-white/10 space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Domain Redirection Routing</span>
          </h2>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase">External Canonical Link URL</label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. www.janesmith.com"
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-orange-500/40"
            />
          </div>
        </div>

        {/* Danger zone actions */}
        <div className="glass-panel p-6 bg-red-500/5 border border-red-500/20 space-y-4">
          <h2 className="font-bold text-sm text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-gray-400 text-xs">Clear local app caches and developer authentication tokens. This will reset the workspace.</p>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Clear Application Caches
          </button>
        </div>

        {/* Action footer */}
        <div className="pt-4">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 hover:bg-orange-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Save Configuration Settings
          </button>
        </div>

      </div>

    </div>
  );
}
