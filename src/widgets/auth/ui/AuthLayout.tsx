import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-start items-center w-[690px] min-h-[650px] rounded-lg bg-white/30">
        {children}
      </div>
    </div>
  );
};
