import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionService } from '../services/predictionService';
import { PredictionCreate, PredictionUpdate } from '../types';

export function usePredictions() {
  return useQuery({
    queryKey: ['predictions'],
    queryFn: predictionService.getAll,
  });
}

export function usePrediction(id: string) {
  return useQuery({
    queryKey: ['predictions', id],
    queryFn: () => predictionService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePrediction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PredictionCreate) => predictionService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['predictions'] }),
  });
}

export function useUpdatePrediction(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PredictionUpdate) => predictionService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['predictions'] });
      qc.invalidateQueries({ queryKey: ['predictions', id] });
    },
  });
}

export function useDeletePrediction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => predictionService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['predictions'] }),
  });
}

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: predictionService.getGroups,
    staleTime: Infinity,
  });
}