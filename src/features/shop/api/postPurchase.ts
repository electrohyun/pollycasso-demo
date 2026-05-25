import { instance } from '@/shared/api';
import { useAuthStore } from '@/entities/user';
import { addPortfolioPurchases } from '../model/portfolioShopStorage';
import { MOCK_SHOP_PRODUCTS } from './mockShopData';

export interface PurchaseRequest {
  cosmeticItems: number[];
  gameItems: { itemId: number; quantity: number }[];
}

export interface PurchaseResponse {
  purchasedCosmeticItemIds: number[];
  purchasedGameItemIds: number[];
  remainingCoins: number;
}

export const postPurchase = async (
  payload: PurchaseRequest,
): Promise<PurchaseResponse> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const purchasedCosmeticItemIds = payload.cosmeticItems;
    const purchasedGameItemIds = payload.gameItems.map((item) => item.itemId);
    const purchasedIds = [...purchasedCosmeticItemIds, ...purchasedGameItemIds];
    const currentCoin = useAuthStore.getState().user?.coin ?? 0;
    const totalPrice = purchasedIds.reduce((sum, id) => {
      const product = MOCK_SHOP_PRODUCTS.find((item) => item.id === id);
      return sum + (product?.price ?? 0);
    }, 0);

    addPortfolioPurchases(purchasedIds);

    return {
      purchasedCosmeticItemIds,
      purchasedGameItemIds,
      remainingCoins: Math.max(0, currentCoin - totalPrice),
    };
  }

  const { data } = await instance.post<PurchaseResponse>(
    '/shop/purchase',
    payload,
  );
  return data;
};
