import type { Product } from '@/entities/product';
import { MOCK_TOTAL_PRODUCTS } from '@/mocks/shopData';
import { SHOP_CATEGORIES } from '../constants/shop.constants';

const getCategoryByImage = (image: string): Product['subCategory'] => {
  if (image.startsWith('acc_')) return SHOP_CATEGORIES.ACC;
  if (image.startsWith('hat_')) return SHOP_CATEGORIES.HAT;
  if (image.startsWith('top_')) return SHOP_CATEGORIES.TOP;
  if (image.startsWith('bottom_')) return SHOP_CATEGORIES.BOTTOM;
  if (image.startsWith('shoes_')) return SHOP_CATEGORIES.SHOES;
  if (image.startsWith('effect_')) return SHOP_CATEGORIES.EFFECT;
  if (image.startsWith('bird_')) return SHOP_CATEGORIES.BIRD;
  return SHOP_CATEGORIES.ITEM;
};

export const MOCK_SHOP_PRODUCTS: Product[] = MOCK_TOTAL_PRODUCTS.map(
  (product) => ({
    ...product,
    subCategory: getCategoryByImage(product.image),
  }),
);

export const MOCK_COSMETICS = MOCK_SHOP_PRODUCTS.filter(
  (product) => product.subCategory !== SHOP_CATEGORIES.ITEM,
);

export const MOCK_CONSUMABLES = MOCK_SHOP_PRODUCTS.filter(
  (product) => product.subCategory === SHOP_CATEGORIES.ITEM,
);
