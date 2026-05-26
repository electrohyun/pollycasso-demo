import { instance } from '@/shared/api';
import type { User } from '@/entities/user';

export const getUser = async (): Promise<User> => {
  const { data } = await instance.get('/users/me');

  const { coins, ...rest } = data;

  return {
    ...rest,
    coin: coins,
  };
};
