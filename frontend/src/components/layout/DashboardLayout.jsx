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
      <div className="glow-orb w-[500px] h-[500px] -top-40 -left-40 bg-purple-500/20" />
      <div className="glow-orb w-[400px] h-[400px] bottom-10 right-10 bg-blue-500/10" style={{ animationDelay: '-5s' }} />

      {/* Navigation sidebar */}
      <Sidebar />

      {/* Workspace panel */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
