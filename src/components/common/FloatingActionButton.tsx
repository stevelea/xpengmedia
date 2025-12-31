import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  tooltip?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon = <FiPlus className="w-6 h-6" />,
  tooltip 
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        onClick={onClick}
        className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={tooltip}
        title={tooltip}
      >
        {icon}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
