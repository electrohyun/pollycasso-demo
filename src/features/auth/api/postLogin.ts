import { instance } from '@/shared/api/axios';
import type { LoginRequest, LoginResponse } from '@/features/auth/model';

export const postLogin = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const { data } = await instance.post('auth/login', credentials);
  return data;
};
