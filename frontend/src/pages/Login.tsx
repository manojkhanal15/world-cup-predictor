import React from 'react';
import { Navigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-navy via-fifa-blue to-blue-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold/5 -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Trophy size={22} className="text-gold" />
          </div>
          <span className="text-white font-extrabold text-xl">WC 2026 Predictor</span>
        </div>
        <div className="relative">
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Predict every<br />
            <span className="text-gold">match.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            48 teams. 12 groups. One champion. Make your picks for the biggest World Cup in history.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4">
          {['🇧🇷', '🇦🇷', '🇫🇷', '🇩🇪', '🇪🇸', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'].map((flag, i) => (
            <div key={i} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
              {flag}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}