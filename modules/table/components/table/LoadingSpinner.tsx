
import React from 'react';
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  text?: string;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
  position?: 'inline' | 'overlay';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "Loading data...",
  isLoading = true,
  size = 'medium',
  position = 'inline'
}) => {
  // Only render if isLoading is true
  if (!isLoading) return null;
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  return (
    <motion.div 
      className="flex items-center justify-center py-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className={`inline-block border-t-4 border-primary rounded-full animate-spin mb-2 ${sizeClasses[size]}`}></div>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
    </motion.div>
  );
};

export default React.memo(LoadingSpinner);
