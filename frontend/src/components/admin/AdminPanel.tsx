import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart3,
  Trash2,
  FileText,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';
import { AdminUser, AdminStats, Prediction } from '../../types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { Modal } from '../ui/Modal';

type Tab = 'stats' | 'users' | 'predictions';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const toast = useToast();
  const qc = useQueryClient();

  // ── Queries ──────────────────────────────────────────────────────────────

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => (await api.get('/api/admin/stats')).data,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => (await api.get('/api/admin/users')).data,
    enabled: activeTab === 'users',
  });

  const {
    data: predictions = [],
    isLoading: predsLoading,
  } = useQuery<Prediction[]>({
    queryKey: ['admin', 'predictions'],
    queryFn: async () => (await api.get('/api/admin/predictions')).data,
    enabled: activeTab === 'predictions',
  });

  // ── Mutations ─────────────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/predictions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      toast('Prediction deleted', 'success');
      setDeleteTarget(null);
    },
    onError: () => toast('Delete failed', 'error'),
  });

  // ── Tabs config ───────────────────────────────────────────────────────────

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'stats', label: 'Statistics', icon: <BarChart3 size={15} /> },
    { key: 'users', label: 'Users', icon: <Users size={15} /> },
    { key: 'predictions', label: 'Predictions', icon: <FileText size={15} /> },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
            <ShieldCheck size={20} className="text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary">
              Admin Panel
            </h1>
            <p className="text-text-secondary text-sm">
              Manage users and predictions
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetchStats()}
          className="text-text-secondary"
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-fifa-blue text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── STATS TAB ── */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-surface rounded-2xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Users',
                  value: stats?.total_users ?? 0,
                  icon: '👥',
                  color: 'text-blue-400',
                },
                {
                  label: 'Total Predictions',
                  value: stats?.total_predictions ?? 0,
                  icon: '📋',
                  color: 'text-purple-400',
                },
                {
                  label: 'Complete Predictions',
                  value: stats?.complete_predictions ?? 0,
                  icon: '✅',
                  color: 'text-green-400',
                },
                {
                  label: 'Top Predicted Champion',
                  value: stats?.most_predicted_champion ?? '—',
                  icon: '🏆',
                  color: 'text-gold',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-surface border border-border rounded-2xl p-5 hover:border-fifa-blue/30 transition-colors"
                >
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div
                    className={`text-2xl font-extrabold ${s.color} truncate`}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Completion rate bar */}
          {stats && stats.total_predictions > 0 && (
            <div className="mt-6 bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">
                  Completion rate
                </span>
                <span className="text-sm font-bold text-green-400">
                  {Math.round(
                    (stats.complete_predictions / stats.total_predictions) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stats.complete_predictions / stats.total_predictions) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-fifa-blue to-green-400 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {usersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-surface rounded-xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    {['Name', 'Email', 'Predictions', 'Role', 'Joined'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-text-secondary font-semibold"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-text-muted text-sm"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u, i) => (
                      <tr
                        key={u.id}
                        className={`border-b border-border/50 hover:bg-surface-hover transition-colors ${
                          i % 2 === 0 ? '' : 'bg-surface/30'
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-text-primary">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {u.email}
                        </td>
                        <td className="px-4 py-3 text-text-primary">
                          {u.prediction_count}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.is_admin
                                ? 'bg-gold/20 text-gold'
                                : 'bg-surface text-text-secondary border border-border'
                            }`}
                          >
                            {u.is_admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-muted text-xs">
                          {new Date(u.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* ── PREDICTIONS TAB ── */}
      {activeTab === 'predictions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {predsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-surface rounded-xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    {[
                      'Name',
                      'Champion',
                      'Runner-up',
                      'Status',
                      'Created',
                      '',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-text-secondary font-semibold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {predictions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-text-muted text-sm"
                      >
                        No predictions found
                      </td>
                    </tr>
                  ) : (
                    predictions.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b border-border/50 hover:bg-surface-hover transition-colors ${
                          i % 2 === 0 ? '' : 'bg-surface/30'
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-text-primary max-w-[160px] truncate">
                          {p.name}
                        </td>
                        <td className="px-4 py-3 text-gold font-bold">
                          {p.champion || '—'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {p.runner_up || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              p.is_complete
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {p.is_complete ? 'Complete' : 'In progress'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(p.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete prediction?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            This prediction will be permanently deleted. This action cannot be
            undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
              isLoading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}