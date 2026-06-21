import api from './api';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/api/auth/me');
    return data;
  },
};