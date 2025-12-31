import React from 'react';
import { motion } from 'framer-motion';
import { LinkIcon } from '@heroicons/react/24/outline';

interface AddUrlButtonProps {
  onClick: () => void;
  label?: string;
}

export const AddUrlButton: React.FC<AddUrlButtonProps> = ({ onClick, label = 'URL' }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex flex-col items-center gap-0.5 rounded-lg border border-dashed border-purple-500/40 bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-1.5 shadow-sm backdrop-blur-xl transition-all hover:border-purple-500 hover:bg-purple-500/10 hover:shadow-md dark:border-purple-500/30 dark:hover:border-purple-500 landscape:gap-1 landscape:p-2 md:gap-2 md:rounded-2xl md:p-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 transition-all group-hover:shadow-purple-500/50">
        <LinkIcon className="h-6 w-6 text-white" strokeWidth={3} />
      </div>
      <span className="text-[8px] font-semibold text-center text-purple-600 dark:text-purple-400 line-clamp-2 landscape:text-[9px] md:text-xs">
        {label}
      </span>
    </motion.button>
  );
};
