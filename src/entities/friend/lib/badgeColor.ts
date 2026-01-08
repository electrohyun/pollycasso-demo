export const getLevelBadgeColor = (level: number) => {
  if (level >= 50) return 'bg-[#FFD700] text-black';
  if (level >= 20) return 'bg-gray-400 text-white';
  return 'bg-[#2ADB75] text-white';
};
