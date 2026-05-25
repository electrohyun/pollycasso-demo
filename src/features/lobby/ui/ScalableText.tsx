import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib';

interface ScalableTextProps {
  children: ReactNode;
  className?: string;
  minScale?: number;
}

export const ScalableText = ({
  children,
  className = '',
  minScale = 0.68,
}: ScalableTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState<number>(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !textRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;

      const newScale =
        containerWidth < textWidth ? containerWidth / textWidth : 1;

      setScale(Math.max(minScale, Math.min(1, newScale)));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    document.fonts?.ready.then(updateScale);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, minScale]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-full flex items-center overflow-hidden',
        className,
      )}
    >
      <span
        ref={textRef}
        className="origin-left whitespace-nowrap block w-max leading-none"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </span>
    </div>
  );
};
