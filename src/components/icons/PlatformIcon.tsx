import React from 'react';

interface PlatformIconProps {
  icon: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  icon,
  size = 'md',
  className = '',
}) => {
  // Tailles uniformes pour tous les contextes
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-xl
        bg-gradient-to-br from-cyan-50 to-blue-50
        dark:from-slate-800 dark:to-slate-700
        border-2 border-cyan-200/50 dark:border-cyan-500/30
        shadow-sm
        transition-all duration-200
        group-hover:scale-105
        group-hover:shadow-md
        group-hover:border-cyan-300 dark:group-hover:border-cyan-400
        ${className}
      `}
      aria-hidden="true"
    >
      <span className="flex items-center justify-center leading-none">
        {icon}
      </span>
    </div>
  );
};
