import type { User } from './types';
import { resetPortfolioDemoStorage } from '@/features/shop/model/portfolioShopStorage';

export const PORTFOLIO_USER: User = {
  id: 1,
  nickname: '폴리',
  tag: '0001',
  coin: 99,
  level: 7,
  currentExp: 0,
  outfit: {
    bird: 'bird_07',
    accessory: null,
    hat: null,
    top: null,
    bottom: null,
    shoes: null,
    effect: null,
  },
};

export const getPortfolioUser = (user?: User | null): User => {
  const baseOutfit = PORTFOLIO_USER.outfit!;

  return {
    ...PORTFOLIO_USER,
    ...user,
    nickname: PORTFOLIO_USER.nickname,
    tag: PORTFOLIO_USER.tag,
    coin: PORTFOLIO_USER.coin,
    outfit: {
      bird: baseOutfit.bird,
      accessory: user?.outfit?.accessory ?? baseOutfit.accessory,
      hat: user?.outfit?.hat ?? baseOutfit.hat,
      top: user?.outfit?.top ?? baseOutfit.top,
      bottom: user?.outfit?.bottom ?? baseOutfit.bottom,
      shoes: user?.outfit?.shoes ?? baseOutfit.shoes,
      effect: user?.outfit?.effect ?? baseOutfit.effect,
    },
  };
};

export const ensurePortfolioAuthStorage = () => {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return;

  const raw = localStorage.getItem('auth-storage');
  const parsed = raw ? JSON.parse(raw) : {};
  const state = parsed.state ?? {};

  localStorage.setItem(
    'auth-storage',
    JSON.stringify({
      ...parsed,
      state: {
        ...state,
        user: getPortfolioUser(state.user),
        accessToken: null,
      },
      version: parsed.version ?? 0,
    }),
  );
};

export const loginAsPortfolioGuest = () => {
  localStorage.setItem(
    'auth-storage',
    JSON.stringify({
      state: {
        user: PORTFOLIO_USER,
        accessToken: null,
      },
      version: 0,
    }),
  );
  resetPortfolioDemoStorage();
};
