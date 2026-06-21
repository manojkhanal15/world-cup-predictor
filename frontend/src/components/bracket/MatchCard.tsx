import React from 'react';
import { motion } from 'framer-motion';
import { BracketMatch } from '../../types';

interface MatchCardProps {
  match: BracketMatch;
  onSelectWinner: (matchId: string, winner: string) => void;
  compact?: boolean;
}

export function MatchCard({
  match,
  onSelectWinner,
  compact = false,
}: MatchCardProps) {
  const hasTeams = match.home.team || match.away.team;

  const handleClick = (team: string | null) => {
    if (!team) return;
    onSelectWinner(match.id, team);
  };

  function SlotButton({ team }: { team: string | null }) {
    const isWinner = !!match.winner && match.winner === team;
    const isLoser = !!match.winner && match.winner !== team;

    return (
      <motion.button
        whileTap={team ? { scale: 0.97 } : {}}
        onClick={() => handleClick(team)}
        disabled={!team}
        className={`
          w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-150
          ${compact ? 'text-xs py-1.5' : 'text-sm'}
          ${!team ? 'cursor-default' : 'cursor-pointer'}
          ${
            isWinner
              ? 'bg-gold/20 border border-gold/50 text-gold font-bold'
              : isLoser
              ? 'border border-transparent text-text-muted opacity-40'
              : !team
              ? 'bg-surface/30 border border-dashed border-border/40 text-text-muted'
              : 'bg-surface-hover border border-border hover:border-fifa-blue/50 hover:bg-fifa-blue/10 text-text-primary font-medium'
          }
        `}
      >
        {isWinner && (
          <span className="text-gold text-xs shrink-0">🏆</span>
        )}
        <span className="truncate flex-1">{team || 'TBD'}</span>
      </motion.button>
    );
  }

  return (
    <div
      className={`bg-surface border rounded-xl overflow-hidden shadow-sm transition-colors ${
        match.winner ? 'border-gold/20' : 'border-border'
      } ${!hasTeams ? 'opacity-60' : ''}`}
    >
      <div className={`space-y-1 ${compact ? 'p-1.5' : 'p-2'}`}>
        <SlotButton team={match.home.team} />
        <div className="flex items-center gap-1 px-2">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-[10px] text-text-muted font-bold">VS</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>
        <SlotButton team={match.away.team} />
      </div>
    </div>
  );
}