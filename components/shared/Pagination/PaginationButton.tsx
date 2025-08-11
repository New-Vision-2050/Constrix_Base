/**
 * PaginationButton Component
 * Reusable button for pagination navigation
 */
import React from 'react';
import { PaginationButtonProps } from './types';

const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled = false,
  children,
  className = '',
  ariaLabel,
}) => {
  // Base button styles with conditional disabled state
  const baseClasses = 
    'flex items-center justify-center w-10 h-10 rounded-full transition-all';
  
  const activeClasses = !disabled 
    ? 'hover:bg-pink-500/20 text-pink-500 cursor-pointer' 
    : 'text-gray-400 cursor-not-allowed opacity-50';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${activeClasses} ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};

export default PaginationButton;
