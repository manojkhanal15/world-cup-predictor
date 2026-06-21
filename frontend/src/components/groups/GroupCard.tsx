import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Group, GroupResult } from '../../types';

interface GroupCardProps {
  letter: string;
  group: Group;
  result: GroupResult;
  thirdCount: number;
  onChange: (letter: string, result: GroupResult) => void;
}

export function GroupCard({
  letter,
  group,
  result,
  thirdCount,
  onChange,
}: GroupCardProps) {
  const getPosition = (name: string): string | null => {
    if (result.winner === name) return `${letter}1`;
    if (result.runner_up === name) return `${letter}2`;
    if (result.third === name) return `${letter}3`;
    return null;
  };

  const handleTap = (teamName: string) => {
    const pos = getPosition(teamName);
    const next = { ...result };

    if (pos) {
      if (pos.endsWith('1')) next.winner = null;
      else if (pos.endsWith('2')) next.runner_up = null;
      else next.third = null;
    } else {
      if (!next.winner) next.winner = teamName;
      else if (!next.runner_up) next.runner_up = teamName;
      else if (!next.third && thirdCount < 8) next.third = teamName;
    }

    onChange(letter, next);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #1e3fa0 0%, #1a37a0 100%)',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Watermark letter */}
      <div
        style={{
          position: 'absolute',
          top: -4,
          left: 10,
          fontSize: 58,
          fontWeight: 900,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.13)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {letter}
      </div>

      {/* Team rows */}
      <div style={{ paddingTop: 36, paddingBottom: 8, paddingLeft: 8, paddingRight: 8 }}>
        {group.teams.map((team) => {
          const pos = getPosition(team.name);
          const selected = !!pos;
          const isThird = pos?.endsWith('3');

          return (
            <motion.div
              key={team.code}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTap(team.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 12,
                marginBottom: 6,
                background: selected
                  ? 'rgba(100,130,255,0.45)'
                  : 'rgba(100,130,255,0.18)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                  width: 26,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {team.flag}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: selected ? '#fff' : 'rgba(255,255,255,0.72)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {team.name}
              </span>

              <AnimatePresence mode="wait">
                {selected && pos ? (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: isThird ? '#fb923c' : '#f5c518',
                        minWidth: 24,
                        textAlign: 'right',
                      }}
                    >
                      {pos}
                    </span>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isThird ? '#fb923c' : '#f5c518',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path
                          d="M1.5 5.5L4 8L9.5 2.5"
                          stroke="#0d1f6e"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="circle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.32)',
                      flexShrink: 0,
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}