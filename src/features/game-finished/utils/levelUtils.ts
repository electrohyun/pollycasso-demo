export const getLevelStyles = (level: number) => {
  if (level <= 10) {
    return {
      badge: 'from-[#9EC2C7] to-[#3E938C]',
      star: 'text-[#9A9A9A]',
    };
  } else if (level <= 20) {
    return {
      badge: 'from-[#5BDEEC] to-[#005B53]',
      star: 'text-[#9A9A9A]',
    };
  } else {
    return {
      badge: 'from-[#8C1000] to-[#FF5555]',
      star: 'text-[#A5302C]',
    };
  }
};
