import React from 'react';
import { motion } from 'framer-motion';
import { BracketData, BracketMatch as BracketMatchType, MatchSlot } from '../../types';

interface BracketViewProps {
  bracket: BracketData;
  onSelectWinner: (
    matchId: string,
    winner: string,
    flag: string | null,
    code: string | null
  ) => void;
  champion: string | null;
}

export function BracketView({ bracket, onSelectWinner, champion }: BracketViewProps) {
  const allDone = !!champion && !!bracket.third_place[0]?.winner;

  const topSeeds = bracket.r32.slice(0, 16).map((m) => m.home);
  const bottomSeeds = [...bracket.r32].reverse().map((m) => m.away);

  return (
    <div style={{ padding: '0 16px 16px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Top seed row */}
      <SeedRow slots={topSeeds} position="top" />

      {/* TOP HALF */}
      <RoundRow matches={bracket.r32.slice(0, 8)} onSelectWinner={onSelectWinner} cols={8} />
      <RoundRow matches={bracket.r16.slice(0, 4)} onSelectWinner={onSelectWinner} cols={4} />
      <RoundRow matches={bracket.qf.slice(0, 2)} onSelectWinner={onSelectWinner} cols={2} size="md" />
      <RoundRow matches={bracket.sf.slice(0, 1)} onSelectWinner={onSelectWinner} cols={1} size="md" />

      {/* CHAMPIONS CENTER */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 18px' }}>
        <span style={{ fontSize: 52, lineHeight: 1, filter: 'drop-shadow(0 4px 16px rgba(245,197,24,0.5))' }}>
          🏆
        </span>
        <div
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '0.25em',
            color: '#f5c518',
            textTransform: 'uppercase',
          }}
        >
          CHAMPIONS
        </div>

        {champion ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              marginTop: 8,
              padding: '9px 22px',
              borderRadius: 12,
              background: '#f5c518',
              fontWeight: 800,
              fontSize: 15,
              color: '#0a1550',
            }}
          >
            {champion}
          </motion.div>
        ) : (
          <div
            style={{
              marginTop: 8,
              padding: '9px 22px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            Pick your champion
          </div>
        )}

        {/* Final */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Slot
            slot={bracket.final[0].home}
            winner={bracket.final[0].winner}
            onClick={() =>
              bracket.final[0].home.team &&
              onSelectWinner(
                bracket.final[0].id,
                bracket.final[0].home.team,
                bracket.final[0].home.flag,
                bracket.final[0].home.code
              )
            }
            size="lg"
          />
          <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
            FINAL
          </span>
          <Slot
            slot={bracket.final[0].away}
            winner={bracket.final[0].winner}
            onClick={() =>
              bracket.final[0].away.team &&
              onSelectWinner(
                bracket.final[0].id,
                bracket.final[0].away.team,
                bracket.final[0].away.flag,
                bracket.final[0].away.code
              )
            }
            size="lg"
          />
        </div>
      </div>

      {/* BOTTOM HALF */}
      <RoundRow matches={bracket.sf.slice(1, 2)} onSelectWinner={onSelectWinner} cols={1} size="md" />
      <RoundRow matches={bracket.qf.slice(2, 4)} onSelectWinner={onSelectWinner} cols={2} size="md" />
      <RoundRow matches={bracket.r16.slice(4, 8)} onSelectWinner={onSelectWinner} cols={4} />
      <RoundRow matches={bracket.r32.slice(8, 16)} onSelectWinner={onSelectWinner} cols={8} />

      {/* Bottom seed row */}
      <SeedRow slots={bottomSeeds} position="bottom" />

      {/* Third place */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 10,
            letterSpacing: '0.08em',
          }}
        >
          🥉 THIRD PLACE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Slot
            slot={bracket.third_place[0].home}
            winner={bracket.third_place[0].winner}
            onClick={() =>
              bracket.third_place[0].home.team &&
              onSelectWinner(
                bracket.third_place[0].id,
                bracket.third_place[0].home.team,
                bracket.third_place[0].home.flag,
                bracket.third_place[0].home.code
              )
            }
            size="lg"
          />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>VS</span>
          <Slot
            slot={bracket.third_place[0].away}
            winner={bracket.third_place[0].winner}
            onClick={() =>
              bracket.third_place[0].away.team &&
              onSelectWinner(
                bracket.third_place[0].id,
                bracket.third_place[0].away.team,
                bracket.third_place[0].away.flag,
                bracket.third_place[0].away.code
              )
            }
            size="lg"
          />
        </div>
      </div>

      {/* Finish status — actual saving happens via the button in Predictor.tsx */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '20px auto 0',
          padding: '14px 0',
          borderRadius: 16,
          textAlign: 'center',
          background: allDone ? 'rgba(245,197,24,0.12)' : 'rgba(180,140,30,0.12)',
          border: allDone ? '1px solid rgba(245,197,24,0.3)' : '1px solid rgba(180,140,30,0.2)',
          fontSize: 13,
          fontWeight: 700,
          color: allDone ? '#f5c518' : 'rgba(255,255,255,0.4)',
        }}
      >
        {allDone ? '🏆 All picks complete!' : 'Finish all picks to complete your bracket'}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SeedRow({ slots, position }: { slots: MatchSlot[]; position: 'top' | 'bottom' }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(16, minmax(36px, 1fr))',
        gap: 4,
        marginBottom: 8,
        overflowX: 'auto',
      }}
    >
      {slots.map((s, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {position === 'top' ? (
            <>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#f5c518', lineHeight: 1 }}>
                {s.code || '?'}
              </span>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{s.flag || '🏳️'}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{s.flag || '🏳️'}</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#f5c518', lineHeight: 1 }}>
                {s.code || '?'}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function RoundRow({
  matches,
  onSelectWinner,
  cols,
  size = 'sm',
}: {
  matches: BracketMatchType[];
  onSelectWinner: BracketViewProps['onSelectWinner'];
  cols: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(${size === 'sm' ? 56 : 90}px, 1fr))`,
        gap: 6,
        marginBottom: 7,
      }}
    >
      {matches.map((m) => (
        <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Slot
            slot={m.home}
            winner={m.winner}
            onClick={() => m.home.team && onSelectWinner(m.id, m.home.team, m.home.flag, m.home.code)}
            size={size}
          />
          <Slot
            slot={m.away}
            winner={m.winner}
            onClick={() => m.away.team && onSelectWinner(m.id, m.away.team, m.away.flag, m.away.code)}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}

function Slot({
  slot,
  winner,
  onClick,
  size = 'sm',
}: {
  slot: MatchSlot;
  winner: string | null;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const isWinner = !!winner && winner === slot.team;
  const isLoser = !!winner && winner !== slot.team;
  const h = size === 'lg' ? 48 : size === 'md' ? 40 : 30;
  const fs = size === 'lg' ? 14 : size === 'md' ? 12 : 10;
  const flagSize = size === 'lg' ? 22 : size === 'md' ? 17 : 13;

  return (
    <motion.div
      whileTap={slot.team && !isWinner ? { scale: 0.93 } : {}}
      onClick={slot.team && !isWinner ? onClick : undefined}
      style={{
        height: h,
        width: '100%',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        padding: '0 8px',
        background: isWinner
          ? 'rgba(245,197,24,0.28)'
          : slot.team
          ? 'rgba(99,130,255,0.28)'
          : 'rgba(255,255,255,0.07)',
        border: isWinner ? '1.5px solid rgba(245,197,24,0.6)' : '1.5px solid transparent',
        opacity: isLoser ? 0.3 : 1,
        cursor: slot.team && !isWinner ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      {slot.team ? (
        <>
          <span style={{ fontSize: flagSize, lineHeight: 1, flexShrink: 0 }}>{slot.flag || '🏳️'}</span>
          <span
            style={{
              fontSize: fs,
              fontWeight: 700,
              color: isWinner ? '#f5c518' : 'rgba(255,255,255,0.85)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {slot.team}
          </span>
        </>
      ) : (
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>TBD</span>
      )}
    </motion.div>
  );
}