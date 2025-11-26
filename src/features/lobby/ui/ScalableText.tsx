import { useRef, useState, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';

interface ScalableTextProps {
  children: ReactNode;
  className?: string;
}

const ScalableText = ({ children, className = '' }: ScalableTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState<number>(1);

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;

      const newScale =
        containerWidth < textWidth ? containerWidth / textWidth : 1;
      setScale(newScale);
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center overflow-hidden ${className}`}
    >
      <span
        ref={textRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'left center',
          whiteSpace: 'nowrap',
          display: 'block',
          width: 'max-content',
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default ScalableText;
