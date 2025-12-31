import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddServiceButtonProps {
  onClick: () => void;
  label?: string;
}

export const AddServiceButton: React.FC<AddServiceButtonProps> = ({ onClick, label = 'Ajouter' }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex flex-col items-center gap-0.5 rounded-lg border border-dashed border-cyan-500/40 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-1.5 shadow-sm backdrop-blur-xl transition-all hover:border-cyan-500 hover:bg-cyan-500/10 hover:shadow-md dark:border-cyan-500/30 dark:hover:border-cyan-500 landscape:gap-1 landscape:p-2 md:gap-2 md:rounded-2xl md:p-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 transition-all group-hover:shadow-cyan-500/50">
        <PlusIcon className="h-6 w-6 text-white" strokeWidth={3} />
      </div>
      <span className="text-[8px] font-semibold text-center text-cyan-600 dark:text-cyan-400 line-clamp-2 landscape:text-[9px] md:text-xs">
        {label}
      </span>
    </motion.button>
  );
};
