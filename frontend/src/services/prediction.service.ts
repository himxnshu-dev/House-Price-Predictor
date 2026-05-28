import api from '@/lib/axios';
import type {
  PredictionInput,
  PredictionResult,
  HistoryResponse,
  FavoritesResponse,
  LocationsResponse,
} from '@/types';

export const predictionService = {
  async predict(input: PredictionInput): Promise<PredictionResult> {
    const { data } = await api.post<PredictionResult>('/predict', input);
    return data;
  },

  async getHistory(page = 1, limit = 12): Promise<HistoryResponse> {
    const { data } = await api.get<HistoryResponse>('/history', {
      params: { page, limit },
    });
    return data;
  },

  async toggleFavorite(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.patch<{ success: boolean; message: string }>(
      `/${id}/favorite`
    );
    return data;
  },

  async getFavorites(): Promise<FavoritesResponse> {
    const { data } = await api.get<FavoritesResponse>('/favorites');
    return data;
  },

  async getLocations(): Promise<LocationsResponse> {
    const { data } = await api.get<LocationsResponse>('/predict/locations');
    return data;
  },
};
