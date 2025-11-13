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
  // Tailles uniformes pour tous les contextes - RÉDUITES pour mobile
  const sizeClasses = {
    sm: 'w-8 h-8 min-w-[2rem] min-h-[2rem]',      // 32px - COMPACT mobile
    md: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]', // 40px - Normal
    lg: 'w-12 h-12 min-w-[3rem] min-h-[3rem]',    // 48px - Grand
  };
  
  // Taille d'emoji fixe pour tous les contextes
  const emojiSize = {
    sm: 'text-[1rem]',    // 16px - Plus petit
    md: 'text-[1.25rem]', // 20px
    lg: 'text-[1.5rem]',  // 24px
  };

  // Taille d'image pour logos réels (avec padding pour cohérence)
  const imageSize = {
    sm: 'w-6 h-6',   // 24px - RÉDUIT pour mobile
    md: 'w-8 h-8',   // 32px
    lg: 'w-10 h-10', // 40px
  };

  // Détecter si c'est une URL (logo) ou un emoji
  const isUrl = icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:');

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
