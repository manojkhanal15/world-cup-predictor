import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Trophy,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Prediction } from '../../types';
import { Button } from '../ui/Button';

interface PredictionCardProps {
  prediction: Prediction;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function PredictionCard({
  prediction,
  onDelete,
  onEdit,
}: PredictionCardProps) {
  const navigate = useNavigate();

  const groupsDone = prediction.group_results
    ? Object.values(prediction.group_results).filter(
        (g) => g.winner && g.runner_up
      ).length
    : 0;

  const formattedDate = new Date(prediction.created_at).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-fifa-blue/30 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-primary truncate text-base">
            {prediction.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar size={12} className="text-text-muted" />
            <span className="text-xs text-text-muted">{formattedDate}</span>
          </div>
        </div>
        <div className="ml-2 shrink-0">
          {prediction.is_complete ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
              <CheckCircle size={10} />
              Complete
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
              <Clock size={10} />
              In progress
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBox label="Groups" value={`${groupsDone}/12`} />
        <StatBox
          label="Champion"
          value={prediction.champion || '—'}
          highlight={!!prediction.champion}
        />
        <StatBox label="Runner-up" value={prediction.runner_up || '—'} />
      </div>

      {/* Champion showcase */}
      {prediction.champion && (
        <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-gold/10 border border-gold/20">
          <Trophy size={14} className="text-gold shrink-0" />
          <span className="text-sm font-bold text-gold flex-1 truncate">
            {prediction.champion}
          </span>
          <span className="text-xs text-text-muted">Your pick</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(prediction.id)}
          className="flex-1"
        >
          <Edit size={14} />
          Edit
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/predictor?id=${prediction.id}`)}
          className="flex-1"
        >
          Open
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(prediction.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/10 px-2.5"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center p-2 rounded-lg bg-background/50 border border-border/30">
      <div
        className={`text-sm font-bold truncate ${
          highlight ? 'text-gold' : 'text-text-primary'
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}