import api from './api';
import { Prediction, PredictionCreate, PredictionUpdate, GroupsData } from '../types';

export const predictionService = {
  async getGroups(): Promise<{ groups: GroupsData }> {
    const { data } = await api.get('/api/groups');
    return data;
  },

  async create(payload: PredictionCreate): Promise<Prediction> {
    const { data } = await api.post<Prediction>('/api/predictions', payload);
    return data;
  },

  async getAll(): Promise<Prediction[]> {
    const { data } = await api.get<Prediction[]>('/api/predictions');
    return data;
  },

  async getById(id: string): Promise<Prediction> {
    const { data } = await api.get<Prediction>(`/api/predictions/${id}`);
    return data;
  },

  async update(id: string, payload: PredictionUpdate): Promise<Prediction> {
    const { data } = await api.put<Prediction>(`/api/predictions/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/predictions/${id}`);
  },
};