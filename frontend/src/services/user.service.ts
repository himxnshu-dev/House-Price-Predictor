import api from '@/lib/axios';
import type { UserResponse, UpdateUserResponse } from '@/types';

export const userService = {
  async getCurrentUser(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>('/users/me');
    return data;
  },

  async updateName(name: string): Promise<UpdateUserResponse> {
    const { data } = await api.patch<UpdateUserResponse>('/users/me', { name });
    return data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>('/users/me/password', {
      oldPassword,
      newPassword,
    });
    return data;
  },
};
