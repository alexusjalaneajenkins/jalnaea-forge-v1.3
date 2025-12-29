import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hoverEffect = false
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/70 dark:bg-white/5 
        backdrop-blur-xl 
        border border-forge-200 dark:border-white/10 
        shadow-xl shadow-forge-900/5 dark:shadow-2xl dark:shadow-black/50
        rounded-2xl
        transition-all duration-300
        ${hoverEffect ? 'hover:scale-[1.01] hover:shadow-cyan-500/10 dark:hover:bg-white/10 dark:hover:border-white/20' : ''}
        ${className}
      `}
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
