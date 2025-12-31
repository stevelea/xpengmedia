import React from 'react';

interface PlatformIconProps {
  icon: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  icon,
  name,
  size = 'md',
  className = '',
}) => {
  // Tailles RÉDUITES pour mobile Z50S Pro (grille 5 colonnes)
  const sizeClasses = {
    sm: 'w-11 h-11 min-w-[2.75rem] min-h-[2.75rem]',  // 44px - Compact mobile
    md: 'w-13 h-13 min-w-[3.25rem] min-h-[3.25rem]',  // 52px - Normal
    lg: 'w-16 h-16 min-w-[4rem] min-h-[4rem]',        // 64px - Grand
  };
  
  // Taille d'emoji réduite pour mobile
  const emojiSize = {
    sm: 'text-[1.375rem]', // 22px - Compact
    md: 'text-[1.625rem]', // 26px
    lg: 'text-[1.875rem]', // 30px
  };

  // Taille d'image pour logos réels - réduite mobile
  const imageSize = {
    sm: 'w-8 h-8',   // 32px - Compact mobile
    md: 'w-10 h-10', // 40px
    lg: 'w-12 h-12', // 48px
  };

  // Détecter si c'est une URL (logo) ou un emoji
  const isUrl =
    icon.startsWith('http') ||
    icon.startsWith('/') ||
    icon.startsWith('data:') ||
    icon.startsWith('icons/');

  return (
    <div
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-xl
        bg-white/80
        dark:bg-white/10
        backdrop-blur-sm
        border border-slate-200/70 dark:border-slate-700/50
        shadow-sm
        transition-all duration-200
        group-hover:scale-105
        group-hover:shadow-lg
        group-hover:border-slate-300 dark:group-hover:border-slate-600
        ${className}
      `}
      aria-hidden="true"
    >
      {isUrl ? (
        // Logo réel EN COULEUR avec fond transparent
        <img 
          src={icon} 
          alt={name || 'Service logo'} 
          className={`
            ${imageSize[size]} 
            object-contain 
            transition-all 
            duration-200
            p-0.5
          `}
          style={{
            filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15))',
            imageRendering: 'crisp-edges',
          }}
          loading="lazy"
          onError={(e) => {
            // Fallback : si l'image ne charge pas, afficher un emoji par défaut
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">📱</span>';
          }}
        />
      ) : (
        // Emoji (comportement actuel)
        <span className={`flex items-center justify-center leading-none ${emojiSize[size]}`}>
          {icon}
        </span>
      )}
    </div>
  );
};
