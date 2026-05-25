import { useMemo, useSyncExternalStore } from 'react';
import type { Product } from '@/entities/product';
import type { Outfit } from '@/shared/model';
import { MOCK_SHOP_PRODUCTS } from '../api/mockShopData';
import { CATEGORY_TO_OUTFIT_KEY, SHOP_CATEGORIES } from '../constants/shop.constants';

export const PORTFOLIO_SHOP_STORAGE_KEY = 'portfolio-shop-storage';
export const PORTFOLIO_OUTFIT_STORAGE_KEY = 'portfolio-outfit-storage';
export const PORTFOLIO_OUTFIT_STORAGE_EVENT = 'portfolio-outfit-storage-change';

export interface PortfolioShopStorage {
  purchasedIds: number[];
}

export type PortfolioOutfitStorage = Record<string, number>;

const DEFAULT_PURCHASED_IDS = [607];

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const notifyPortfolioOutfitStorageChange = () => {
  window.dispatchEvent(new Event(PORTFOLIO_OUTFIT_STORAGE_EVENT));
};

export const getPortfolioShopStorage = (): PortfolioShopStorage => {
  const storage = readJson<PortfolioShopStorage>(PORTFOLIO_SHOP_STORAGE_KEY, {
    purchasedIds: DEFAULT_PURCHASED_IDS,
  });

  return {
    purchasedIds: Array.from(
      new Set([...DEFAULT_PURCHASED_IDS, ...storage.purchasedIds]),
    ),
  };
};

export const setPortfolioShopStorage = (storage: PortfolioShopStorage) => {
  writeJson(PORTFOLIO_SHOP_STORAGE_KEY, storage);
};

export const addPortfolioPurchases = (ids: number[]) => {
  const storage = getPortfolioShopStorage();
  setPortfolioShopStorage({
    purchasedIds: Array.from(new Set([...storage.purchasedIds, ...ids])),
  });
};

export const getPortfolioOutfitStorage = (): PortfolioOutfitStorage =>
  readJson<PortfolioOutfitStorage>(PORTFOLIO_OUTFIT_STORAGE_KEY, {
    bird: 607,
  });

export const setPortfolioOutfitStorage = (storage: PortfolioOutfitStorage) => {
  writeJson(PORTFOLIO_OUTFIT_STORAGE_KEY, storage);
  notifyPortfolioOutfitStorageChange();
};

export const subscribePortfolioOutfitStorage = (listener: () => void) => {
  window.addEventListener(PORTFOLIO_OUTFIT_STORAGE_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(PORTFOLIO_OUTFIT_STORAGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

export const getPortfolioOutfitStorageSnapshot = () =>
  localStorage.getItem(PORTFOLIO_OUTFIT_STORAGE_KEY) ?? '';

export const getPurchasedPortfolioProducts = (): Product[] => {
  const { purchasedIds } = getPortfolioShopStorage();
  return MOCK_SHOP_PRODUCTS.filter((product) => purchasedIds.includes(product.id));
};

export const getEquippedPortfolioProducts = (): Product[] => {
  const outfit = getPortfolioOutfitStorage();
  const equippedIds = Object.values(outfit);
  return MOCK_SHOP_PRODUCTS.filter((product) => equippedIds.includes(product.id));
};

export const setPortfolioOutfitProducts = (products: Product[]) => {
  const nextOutfit = products.reduce<PortfolioOutfitStorage>((acc, product) => {
    const outfitKey = CATEGORY_TO_OUTFIT_KEY[product.subCategory || ''];
    if (!outfitKey) return acc;

    acc[outfitKey] = product.id;
    return acc;
  }, {});

  setPortfolioOutfitStorage(nextOutfit);
};

export const getPortfolioOutfitForPlayer = (
  fallbackBird = 'bird_07',
): Outfit => {
  const storedOutfit = getPortfolioOutfitStorage();
  const getImageById = (id?: number) =>
    id ? MOCK_SHOP_PRODUCTS.find((product) => product.id === id)?.image : null;

  return {
    bird: getImageById(storedOutfit.bird) ?? fallbackBird,
    accessory: getImageById(storedOutfit.accessory),
    hat: getImageById(storedOutfit.hat),
    top: getImageById(storedOutfit.top),
    bottom: getImageById(storedOutfit.bottom),
    shoes: getImageById(storedOutfit.shoes),
    effect: getImageById(storedOutfit.effect),
  };
};

export const usePortfolioOutfitForPlayer = (fallbackBird = 'bird_07') => {
  const outfitSnapshot = useSyncExternalStore(
    subscribePortfolioOutfitStorage,
    getPortfolioOutfitStorageSnapshot,
    () => '',
  );

  return useMemo(
    () => getPortfolioOutfitForPlayer(fallbackBird),
    [fallbackBird, outfitSnapshot],
  );
};

export const togglePortfolioOutfitItem = (product: Product) => {
  const targetKey = CATEGORY_TO_OUTFIT_KEY[product.subCategory || ''];
  if (!targetKey) return;

  const outfit = getPortfolioOutfitStorage();

  if (outfit[targetKey] === product.id) {
    delete outfit[targetKey];
  } else {
    outfit[targetKey] = product.id;

    if (product.subCategory === SHOP_CATEGORIES.BIRD) {
      outfit.bird = product.id;
    }
  }

  setPortfolioOutfitStorage(outfit);
};

export const resetPortfolioDemoStorage = () => {
  setPortfolioShopStorage({ purchasedIds: DEFAULT_PURCHASED_IDS });
  setPortfolioOutfitStorage({ bird: 607 });
};
