import { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWaitingSocket } from '@/shared/api/socket/WaitingSocketProvider';

import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useCart } from '@/features/cart';
import {
  useShopFilter,
  useShopPreview,
  useProductSorting,
  shopQueries,
  SHOP_CATEGORIES,
} from '@/features/shop';
import { purchaseQueries } from '@/features/shop-purchase';
import { ShopSidebar, ShopProductList, ShopProfilePanel } from '@/widgets/shop';
import { useNudgeListener } from '@/features/lobby/model/useNudgeListener';
import { BackButton } from '@/shared/ui/BackButton';

const ShopPage = () => {
  const queryClient = useQueryClient();
  const { waitingSocket } = useWaitingSocket();
  const { user, updateUser } = useAuthStore();

  useNudgeListener();

  const { data: myInventoryData } = useQuery(shopQueries.inventory());
  const { data: cosmeticsData } = useQuery(shopQueries.cosmetics());
  const { data: consumablesData } = useQuery(shopQueries.consumables());

  const myInventoryIds = myInventoryData?.inventoryIds || [];

  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const {
    isSortOpen,
    activeSort,
    activeSortLabel,
    activeCategory,
    toggleSortOpen,
    handleSortChange,
    handleCategoryChange,
  } = useShopFilter();

  const { previewItems, wearItem, resetPreview } = useShopPreview();

  const allProducts = useMemo(() => {
    const cosmetics = cosmeticsData?.items || [];
    const consumables = (consumablesData?.items || []).map((item) => ({
      ...item,
      subCategory: SHOP_CATEGORIES.ITEM,
    }));
    return [...cosmetics, ...consumables];
  }, [cosmeticsData, consumablesData]);

  const processedProducts = useProductSorting(
    activeCategory,
    activeSort,
    allProducts,
  );

  const { mutate: purchase, isPending: isPurchasing } = useMutation({
    ...purchaseQueries.submit(),
    onSuccess: (data) => {
      clearCart();
      if (data?.remainingCoins !== undefined) {
        updateUser({ coin: data.remainingCoins });
      }
      queryClient.invalidateQueries({ queryKey: shopQueries.all() });
    },
    onError: (error: any) => {
      alert('구매에 실패했습니다.');
    },
  });

  const handlePurchase = () => {
    if (cart.length === 0) return;

    const payload = {
      cosmeticItems: cart
        .filter((item) => item.subCategory !== SHOP_CATEGORIES.ITEM)
        .map((item) => item.id),
      gameItems: cart
        .filter((item) => item.subCategory === SHOP_CATEGORIES.ITEM)
        .map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
    };

    purchase(payload);
  };

  useEffect(() => {
    if (!waitingSocket) return;
    waitingSocket.emit('room:updateStatus', { status: 'SHOPPING' });
    return () => {
      waitingSocket.emit('room:updateStatus', { status: 'IDLE' });
    };
  }, [waitingSocket]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen gap-[24px] font-ssrm font-bold">
      <BackButton />

      <ShopSidebar
        isSortOpen={isSortOpen}
        activeSort={activeSort}
        activeSortLabel={activeSortLabel}
        activeCategory={activeCategory}
        onToggleSort={toggleSortOpen}
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
      />

      <ShopProductList
        products={processedProducts}
        cart={cart}
        inventoryIds={myInventoryIds}
        onAddToCart={addToCart}
        onWearItem={wearItem}
      />

      <ShopProfilePanel
        cart={cart}
        previewItems={previewItems}
        userBalance={user?.coin ?? 0}
        userLevel={user?.level ?? 1}
        onRemoveFromCart={removeFromCart}
        onResetPreview={resetPreview}
        onPurchase={handlePurchase}
        isPurchasing={isPurchasing}
      />
    </div>
  );
};

export default ShopPage;
