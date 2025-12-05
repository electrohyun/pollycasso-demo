import { motion } from 'framer-motion';
import { Spinner as SpinnerIcon } from '@/assets';
import { cn } from '@/shared/lib/cn';

interface SpinnerProps {
  message?: string;
  overlay?: boolean;
  transparent?: boolean;
}

export const Spinner = ({
  message,
  overlay = true,
  transparent = false,
}: SpinnerProps) => {
  const layoutClassName = overlay
    ? cn(
        'absolute inset-0 z-50 h-full w-full',
        transparent ? '' : 'bg-white/80 backdrop-blur-[2px]',
      )
    : 'w-full py-10';

  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center',
        layoutClassName,
      )}
    >
      <motion.img
        src={SpinnerIcon}
        alt="Loading Spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-24 h-24 rounded-full object-contain"
      />

      {message && (
        <p className="mt-4 font-ssrm font-bold text-lg animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
