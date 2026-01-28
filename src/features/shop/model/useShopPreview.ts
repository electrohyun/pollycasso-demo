import { useState } from 'react';
import type { Product } from '@/entities/product';
import { CATEGORY_TO_OUTFIT_KEY } from '../constants/shop.constants';

export const useShopPreview = () => {
  const [previewItems, setPreviewItems] = useState<Product[]>([]);

  const wearItem = (product: Product) => {
    const targetKey = CATEGORY_TO_OUTFIT_KEY[product.subCategory || ''];

    if (!targetKey) return;

    setPreviewItems((prev) => {
      const isAlreadyWearing = prev.some((item) => item.id === product.id);

      // 기존 목록에서 '같은 부위'의 아이템 제거
      const filtered = prev.filter((item) => {
        const itemKey = CATEGORY_TO_OUTFIT_KEY[item.subCategory || ''];
        return itemKey !== targetKey;
      });

      // 이미 입고 있던 거라면 벗기고(filtered 반환), 아니면 새거 입히기
      if (isAlreadyWearing) {
        return filtered;
      } else {
        return [...filtered, product];
      }
    });
  };

  const resetPreview = () => {
    setPreviewItems([]);
  };

  return { previewItems, wearItem, resetPreview };
};
