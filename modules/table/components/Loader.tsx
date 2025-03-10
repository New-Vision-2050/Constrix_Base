
import React from 'react';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'minimal';
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  variant = 'default',
  text,
  className,
}) => {
  const sizeMap = {
    sm: { icon: 16, textSize: 'text-xs' },
    md: { icon: 24, textSize: 'text-sm' },
    lg: { icon: 32, textSize: 'text-base' },
    xl: { icon: 48, textSize: 'text-lg' },
  };

  const variantStyles = {
    default: 'bg-white/80 backdrop-blur-sm border border-border shadow-sm',
    primary: 'bg-primary/10 backdrop-blur-sm border border-primary/20 shadow-sm',
    secondary: 'bg-secondary/80 backdrop-blur-sm border border-border shadow-sm',
    minimal: 'bg-transparent'
  };

  return (
    <motion.div 
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg gap-3",
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 
        size={sizeMap[size].icon} 
        className={cn(
          "text-primary animate-spin",
          variant === 'primary' ? 'text-primary' : 'text-primary/80'
        )} 
      />
      
      {text && (
        <motion.p 
          className={cn(
            sizeMap[size].textSize, 
            "text-muted-foreground font-medium"
          )}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Loader;
