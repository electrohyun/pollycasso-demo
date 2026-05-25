import { instance } from '@/shared/api';
import { MOCK_CONSUMABLES } from './mockShopData';

export const getConsumables = async () => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return { items: MOCK_CONSUMABLES };
  }

  const { data } = await instance.get('/shop/consumables');
  return data;
};
