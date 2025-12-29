import React, { ReactNode } from 'react';

interface PageBackgroundProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'orange';
}

export const PageBackground: React.FC<PageBackgroundProps> = ({
  children,
  className = "",
  glowColor = 'blue'
}) => {
  return (
    <div className={`relative min-h-full w-full overflow-hidden bg-forge-950 text-forge-text transition-colors duration-300 ${className}`}>
      {/* Ambient Glows - Fixed positioning to stay in background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Top Center Glow */}
        <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[100px] transition-all duration-500
          ${glowColor === 'orange' ? 'bg-orange-500/10 dark:bg-orange-600/20' : 'bg-blue-500/10 dark:bg-blue-600/20'}`}
        />

        {/* Bottom Left Glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[120px]" />

        {/* Top Right Glow */}
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[400px] rounded-full bg-cyan-500/10 dark:bg-cyan-600/10 blur-[100px]" />
      </div>

      {/* Content Layer - Z-index ensures clickable */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
