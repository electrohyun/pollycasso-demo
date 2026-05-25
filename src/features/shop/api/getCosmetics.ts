import { instance } from '@/shared/api';
import { MOCK_COSMETICS } from './mockShopData';

export const getCosmetics = async () => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return { items: MOCK_COSMETICS };
  }

  const { data } = await instance.get('/shop/cosmetics');
  return data;
};
