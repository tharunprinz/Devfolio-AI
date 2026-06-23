import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import GitHubAnalysis from './pages/dashboard/GitHubAnalysis';
import PortfolioBuilder from './pages/dashboard/PortfolioBuilder';
import ResumeBuilder from './pages/dashboard/ResumeBuilder';
import AIInsights from './pages/dashboard/AIInsights';
import Settings from './pages/dashboard/Settings';
import PublicPortfolio from './pages/PublicPortfolio';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Public Portfolio Site Viewers */}
        <Route path="/p/:publishedUrl" element={<PublicPortfolio />} />

        {/* Protected Dashboard Panels */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<GitHubAnalysis />} />
          <Route path="portfolio" element={<PortfolioBuilder />} />
          <Route path="resume" element={<ResumeBuilder />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
