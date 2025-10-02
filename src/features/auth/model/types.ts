import type { User } from '@/entities/user';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
}
