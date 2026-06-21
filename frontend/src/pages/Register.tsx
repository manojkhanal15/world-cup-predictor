import React from 'react';
import { Navigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
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
            Your bracket.<br />
            <span className="text-gold">Your glory.</span>
          </h2>
          <ul className="space-y-3 text-blue-200">
            {[
              'Pick winners for all 12 groups',
              'Build your complete knockout bracket',
              'Save and share your predictions',
              'Compare with other fans',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-blue-300 text-sm">
          Free forever · No credit card required
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  );
}