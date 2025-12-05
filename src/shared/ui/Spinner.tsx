import { motion } from 'framer-motion';
import { Spinner as SpinnerIcon } from '@/assets';
import { cn } from '@/shared/lib/cn';

interface SpinnerProps {
  message?: string;
  overlay?: boolean;
  fixed?: boolean;
  transparent?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export const Spinner = ({
  message,
  overlay = true,
  fixed = false,
  transparent = false,
  size = 'xl',
  className,
}: SpinnerProps) => {
  let positionClass = '';

  if (fixed) {
    positionClass = 'fixed inset-0 z-[9999]';
  } else if (overlay) {
    positionClass = 'absolute inset-0 z-50';
  } else {
    positionClass = 'w-full py-10';
  }

  const bgClass =
    (fixed || overlay) && !transparent ? 'bg-white/80 backdrop-blur-[2px]' : '';

  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center',
        positionClass,
        bgClass,
        className,
      )}
    >
      <motion.img
        src={SpinnerIcon}
        alt="Loading Spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={cn('rounded-full object-contain', sizeClasses[size])}
      />

      {message && (
        <p className="mt-4 font-ssrm font-bold text-lg animate-pulse text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
