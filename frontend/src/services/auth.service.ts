import api, { setTokens } from '@/lib/axios';
import type { LoginResponse, RegisterResponse, RefreshResponse } from '@/types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/auth/register', {
      name,
      email,
      password,
    });
    return data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    // Store both tokens immediately
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async refresh(): Promise<RefreshResponse> {
    // This is handled by the axios interceptor automatically,
    // but exposed here for manual use if needed
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post<RefreshResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },
};
