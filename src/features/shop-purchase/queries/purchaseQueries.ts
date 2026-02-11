import { postPurchase } from '@/features/shop-purchase/api/postPurchase';
import { mutationOptions } from '@tanstack/react-query';

export const purchaseQueries = {
  all: () => ['purchase'] as const,

  submit: () =>
    mutationOptions({
      mutationKey: [...purchaseQueries.all(), 'submit'] as const,
      mutationFn: postPurchase,
    }),
};
