import { instance } from '@/shared/api/axios';
import type { LoginCredentials } from '@/features/auth/model/auth';

export const requestRefreshToken = async () => {
  const response = await instance.post('auth/token');
  return response.data;
};

export const requestLogin = async (credentials: LoginCredentials) => {
  const response = await instance.post('auth/login', credentials);
  return response.data;
};
