import { useState } from 'react';
import type { Product } from '@/entities/product';
import { useSound } from '@/entities/sound';
import { SoundManager } from '@/shared/api/sound/manager';
import { SOUND_ASSETS } from '@/shared/api/sound/assets';

export const useCart = () => {
  const { sfxVolume, isMuted } = useSound();

  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    const isExist = cart.some((item) => item.id === product.id);

    if (!isExist) {
      setCart((prev) => [...prev, product]);
      if (!isMuted) SoundManager.playSfx(SOUND_ASSETS.SFX.SHOP_CART, sfxVolume);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  return { cart, addToCart, removeFromCart };
};
