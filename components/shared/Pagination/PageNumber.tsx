/**
 * PageNumber Component
 * Represents a single page number in the pagination
 */
import React from 'react';
import { PageNumberProps } from './types';

const PageNumber: React.FC<PageNumberProps> = ({
  page,
  isActive,
  onClick,
}) => {
  // Define styles based on active state
  const baseClasses = 
    'flex items-center justify-center w-10 h-10 rounded-sm transition-all';
  
  const stateClasses = isActive
    ? 'bg-pink-500 text-white'
    : 'hover:bg-pink-500/20 text-gray-300 dark:text-gray-200';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Page ${page}`}
      type="button"
    >
      {page}
    </button>
  );
};

export default PageNumber;
