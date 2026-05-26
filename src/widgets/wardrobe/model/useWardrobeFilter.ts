import { useState } from 'react';
import { SHOP_CATEGORIES } from '@/features/shop';
import type { CategoryType } from '@/features/shop';

export const useWardrobeFilter = () => {
  const [activeTab, setActiveTab] = useState<'ITEM'>('ITEM');

  const [itemCategory, setItemCategory] = useState<CategoryType>('TOP');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTabChange = (tab: 'ITEM') => {
    setActiveTab(tab);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCategorySelect = (category: CategoryType) => {
    setItemCategory(category);
    setActiveTab('ITEM');
    setIsDropdownOpen(false);
  };

  const currentFilterLabel = SHOP_CATEGORIES[itemCategory];

  const itemButtonLabel = SHOP_CATEGORIES[itemCategory];

  return {
    activeTab,
    itemCategory,
    isDropdownOpen,
    currentFilterLabel,
    itemButtonLabel,
    handleTabChange,
    toggleDropdown,
    handleCategorySelect,
    setIsDropdownOpen,
  };
};
