import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { PredictionCard } from '../components/dashboard/PredictionCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { usePredictions, useDeletePrediction, useCreatePrediction } from '../hooks/usePrediction';

export default function DashboardPage() {
  const { data: predictions = [], isLoading, refetch } = usePredictions();
  const deleteMutation = useDeletePrediction();
  const createMutation = useCreatePrediction();
  const toast = useToast();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast('Prediction deleted', 'success');
      setDeleteTarget(null);
    } catch {
      toast('Failed to delete prediction', 'error');
    }
  };

  const handleCreate = async () => {
    const name = newName.trim() || `My Prediction ${predictions.length + 1}`;
    try {
      const pred = await createMutation.mutateAsync({ name });
      toast(`"${name}" created!`, 'success');
      setShowNewModal(false);
      setNewName('');
      navigate(`/predictor?id=${pred.id}`);
    } catch {
      toast('Failed to create prediction', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeBanner />

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Your Predictions</h2>
          <p className="text-text-secondary text-sm mt-0.5">
            {predictions.length} saved prediction{predictions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw size={14} />
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowNewModal(true)}>
            <Plus size={14} />
            New
          </Button>
        </div>
      </div>

      {/* Predictions grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : predictions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-surface border border-dashed border-border rounded-2xl"
        >
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No predictions yet</h3>
          <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
            Create your first prediction and pick the 2026 World Cup champion
          </p>
          <Button variant="primary" onClick={() => setShowNewModal(true)}>
            <Plus size={16} />
            Create first prediction
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((pred) => (
              <PredictionCard
                key={pred.id}
                prediction={pred}
                onDelete={setDeleteTarget}
                onEdit={(id) => navigate(`/predictor?id=${id}`)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* New prediction modal */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="New Prediction">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Prediction name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder={`My Prediction ${predictions.length + 1}`}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-fifa-blue transition"
              autoFocus
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              isLoading={createMutation.isPending}
              className="flex-1"
            >
              Create & open
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete prediction?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            This prediction will be permanently deleted. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
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