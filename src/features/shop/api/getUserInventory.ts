import { instance } from '@/shared/api';
import { getPortfolioShopStorage } from '../model/portfolioShopStorage';

export const getUserInventory = async () => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return { inventoryIds: getPortfolioShopStorage().purchasedIds };
  }

  const { data } = await instance.get('/shop/inventory/cosmetics');
  return data;
};
