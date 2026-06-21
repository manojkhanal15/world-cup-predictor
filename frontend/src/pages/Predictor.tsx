import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Save } from 'lucide-react';
import { GroupCard } from '../components/groups/GroupCard';
import { BracketView } from '../components/bracket/BracketView';
import { useToast } from '../components/ui/Toast';
import {
  useGroups,
  usePrediction,
  useCreatePrediction,
  useUpdatePrediction,
} from '../hooks/usePrediction';
import { GroupResults, BracketData, GroupResult } from '../types';
import {
  countQualified,
  countThirds,
  buildQualifiedTeams,
  buildInitialBracket,
  advanceWinner,
} from '../utils/bracketUtils';
import { exportPredictionToPDF } from '../utils/pdfExport';
import { useAuth } from '../context/AuthContext';

type Step = 'groups' | 'bracket';

const EMPTY_RESULT: GroupResult = { winner: null, runner_up: null, third: null };

export default function PredictorPage() {
  const [searchParams] = useSearchParams();
  const predictionId = searchParams.get('id');
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const { data: groupsData, isLoading: groupsLoading } = useGroups();
  const { data: existingPrediction } = usePrediction(predictionId || '');
  const createMutation = useCreatePrediction();
  const updateMutation = useUpdatePrediction(predictionId || '');

  const [step, setStep] = useState<Step>('groups');
  const [groupResults, setGroupResults] = useState<GroupResults>({});
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [predName, setPredName] = useState('My Prediction');
  const [isSaving, setIsSaving] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(predictionId);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (existingPrediction) {
      setPredName(existingPrediction.name);
      if (existingPrediction.group_results) setGroupResults(existingPrediction.group_results);
      if (existingPrediction.bracket) {
        setBracket(existingPrediction.bracket);
        setStep('bracket');
      }
    }
  }, [existingPrediction]);

  const groups = groupsData?.groups || {};
  const qualified = countQualified(groupResults);
  const thirds = countThirds(groupResults);
  const canGoToKnockouts = qualified >= 32;

  const handleGroupChange = useCallback((letter: string, result: GroupResult) => {
    setGroupResults((prev) => ({ ...prev, [letter]: result }));
  }, []);

  const handleGoToKnockouts = () => {
    if (!canGoToKnockouts || !groupsData) return;
    const qualifiedTeams = buildQualifiedTeams(groupResults, groupsData.groups);
    setBracket(buildInitialBracket(qualifiedTeams));
    setStep('bracket');
    window.scrollTo(0, 0);
  };

  const handleSelectWinner = (
    matchId: string,
    winner: string,
    flag: string | null,
    code: string | null
  ) => {
    if (!bracket) return;
    setBracket(advanceWinner(bracket, matchId, winner, flag, code));
  };

  const getChampion = () => bracket?.final[0]?.winner || null;
  const getRunnerUp = () => {
    const f = bracket?.final[0];
    if (!f?.winner) return null;
    return f.home.team === f.winner ? f.away.team : f.home.team;
  };
  const getThirdPlace = () => bracket?.third_place[0]?.winner || null;

  const handleSave = async (complete = false) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: predName,
        group_results: groupResults,
        bracket: bracket ?? undefined,
        champion: getChampion(),
        runner_up: getRunnerUp(),
        third_place: getThirdPlace(),
        is_complete: complete,
      };

      if (currentId) {
        await updateMutation.mutateAsync(payload);
      } else {
        const created = await createMutation.mutateAsync(payload);
        setCurrentId(created.id);
      }
      toast(complete ? '🏆 Prediction complete!' : 'Progress saved!', 'success');
    } catch (err: any) {
      // Surface the real reason instead of a generic message
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      let message = 'Save failed. Please try again.';

      if (!err?.response) {
        message = 'Cannot reach the server. Is the backend running on the expected port?';
      } else if (status === 401) {
        message = 'Your session expired. Please sign in again.';
      } else if (status === 422 && detail) {
        message = Array.isArray(detail)
          ? `Save failed: ${detail[0]?.msg || 'invalid data'}`
          : `Save failed: ${detail}`;
      } else if (status === 404) {
        message = 'Prediction not found — it may have been deleted.';
      } else if (status >= 500) {
        message = 'Server error while saving. Check backend logs.';
      } else if (detail) {
        message = `Save failed: ${detail}`;
      }

      setSaveError(message);
      toast(message, 'error');
      // eslint-disable-next-line no-console
      console.error('Save prediction failed:', err?.response || err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Link copied!', 'success');
  };

  const handleExportPDF = async () => {
    if (!currentId) {
      toast('Save first', 'error');
      return;
    }
    try {
      await exportPredictionToPDF(
        {
          id: currentId,
          user_id: user?.id || '',
          name: predName,
          group_results: groupResults,
          bracket,
          champion: getChampion(),
          runner_up: getRunnerUp(),
          third_place: getThirdPlace(),
          is_complete: false,
          created_at: new Date().toISOString(),
          updated_at: null,
        },
        user?.name || 'User'
      );
      toast('PDF downloaded!', 'success');
    } catch {
      toast('PDF export failed', 'error');
    }
  };

  if (groupsLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0b1d6e 0%, #091550 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">
            Loading groups...
          </p>
        </div>
      </div>
    );
  }

  const champion = getChampion();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0b1d6e 0%, #091550 100%)',
        fontFamily: "'Inter', sans-serif",
        color: '#fff',
        width: '100%',
      }}
    >
      {/* ── HERO HEADER — full width, content capped + centered ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1d6e 0%, #1e3fa0 40%, #b45309 100%)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '16px 20px 0',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#f5c518',
              letterSpacing: '0.18em',
              marginBottom: 2,
            }}
          >
            ✦ ALL FOOTBALL 2026 ✦
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.12em',
              marginBottom: 2,
            }}
          >
            — WORLD CUP —
          </div>
          <div
            style={{
              fontSize: 'clamp(24px, 4vw, 34px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#f5c518',
              letterSpacing: '0.08em',
              textShadow: '0 2px 20px rgba(245,197,24,0.45)',
              marginBottom: 12,
            }}
          >
            ROAD TO GLORY
          </div>

          {/* Rule pill */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12 }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                borderRadius: 20,
                padding: '6px 18px',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              Pick 32: top 2 per group + 8 thirds
            </div>
          </div>

          {/* Action row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 12,
              gap: 12,
            }}
          >
            <button
              onClick={() =>
                step === 'bracket' ? setStep('groups') : navigate('/dashboard')
              }
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: 20,
                padding: '7px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {step === 'bracket' ? '← Groups' : '← Back'}
            </button>

            <input
              value={predName}
              onChange={(e) => setPredName(e.target.value)}
              style={{
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'center',
                background: 'transparent',
                color: '#fff',
                border: 'none',
                outline: 'none',
                flex: 1,
                minWidth: 0,
              }}
              placeholder="Prediction name"
            />

            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <IconBtn onClick={handleShare} title="Share">
                <Share2 size={16} color="rgba(255,255,255,0.75)" />
              </IconBtn>
              <IconBtn onClick={handleExportPDF} title="Download PDF">
                <Download size={16} color="rgba(255,255,255,0.75)" />
              </IconBtn>
              <IconBtn onClick={() => handleSave(false)} title="Save" disabled={isSaving}>
                <Save size={16} color="rgba(255,255,255,0.75)" />
              </IconBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT — full width, content capped + centered ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          {/* ── GROUPS STEP ── */}
          {step === 'groups' && (
            <motion.div
              key="groups"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ padding: '16px 14px 130px' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 14,
                }}
              >
                {Object.entries(groups).map(([letter, group]) => (
                  <GroupCard
                    key={letter}
                    letter={letter}
                    group={group}
                    result={groupResults[letter] || EMPTY_RESULT}
                    thirdCount={thirds}
                    onChange={handleGroupChange}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── BRACKET STEP ── */}
          {step === 'bracket' && bracket && (
            <motion.div
              key="bracket"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ paddingBottom: 40 }}
            >
              <BracketView
                bracket={bracket}
                onSelectWinner={handleSelectWinner}
                champion={champion}
              />

              {saveError && (
                <div style={{ padding: '0 16px', marginBottom: 8 }}>
                  <div
                    style={{
                      background: 'rgba(220,38,38,0.15)',
                      border: '1px solid rgba(248,113,113,0.4)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      fontSize: 12,
                      color: '#fca5a5',
                    }}
                  >
                    {saveError}
                  </div>
                </div>
              )}

              {champion && bracket.third_place[0]?.winner && (
                <div style={{ padding: '0 16px 24px', maxWidth: 480, margin: '0 auto' }}>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    style={{
                      width: '100%',
                      padding: '14px 0',
                      borderRadius: 16,
                      background: isSaving
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isSaving ? 'wait' : 'pointer',
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save to my predictions'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── STICKY BOTTOM BAR (groups only) ── */}
      {step === 'groups' && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 16px 20px',
            background: 'linear-gradient(0deg, #091550 55%, transparent)',
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 600,
              margin: '0 auto',
              display: 'flex',
              gap: 10,
            }}
          >
            <button
              onClick={() => toast('Pick Favorites coming soon!', 'info')}
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 22,
                background: '#1e40af',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Pick Favorites
            </button>

            <motion.button
              onClick={handleGoToKnockouts}
              animate={{
                background: canGoToKnockouts
                  ? 'linear-gradient(135deg, #d97706, #f5c518)'
                  : 'rgba(160,120,20,0.35)',
              }}
              disabled={!canGoToKnockouts}
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 22,
                border: 'none',
                outline: 'none',
                fontSize: 14,
                fontWeight: 800,
                color: canGoToKnockouts ? '#0a1550' : 'rgba(255,255,255,0.35)',
                cursor: canGoToKnockouts ? 'pointer' : 'not-allowed',
              }}
            >
              To Knockouts ({qualified})
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small icon button helper ────────────────────────────────────────────────

function IconBtn({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: 'none',
        borderRadius: 8,
        cursor: disabled ? 'wait' : 'pointer',
        padding: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}