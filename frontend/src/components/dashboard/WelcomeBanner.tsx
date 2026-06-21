import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function WelcomeBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fifa-blue via-blue-800 to-navy border border-fifa-blue/30 p-6 md:p-8"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full bg-gold/10" />
        <div className="absolute left-1/2 top-0 w-px h-full bg-white/5" />
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg shrink-0">
            <Trophy size={28} className="text-gold" />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium">{greeting},</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {user?.name} 👋
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              FIFA World Cup 2026 · USA, Canada &amp; Mexico
            </p>
          </div>
        </div>

        <Button
          variant="gold"
          size="lg"
          onClick={() => navigate('/predictor')}
          className="shrink-0"
        >
          <Plus size={18} />
          New prediction
        </Button>
      </div>
    </motion.div>
  );
}