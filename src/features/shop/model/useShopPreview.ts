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

      const filtered = prev.filter((item) => {
        const itemKey = CATEGORY_TO_OUTFIT_KEY[item.subCategory || ''];
        return itemKey !== targetKey;
      });

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
