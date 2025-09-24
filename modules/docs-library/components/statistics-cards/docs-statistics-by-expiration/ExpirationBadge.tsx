import React from 'react';
import { ExpirationBadgeProps } from './types';

/**
 * ExpirationBadge component for displaying expiration status
 * Shows colored badge with text indicating expiration status
 */
const ExpirationBadge: React.FC<ExpirationBadgeProps> = ({
  text,
  variant = 'primary'
}) => {
  // Define variant styles
  const variantStyles = {
    primary: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        border backdrop-blur-sm
        ${variantStyles[variant]}
      `}
    >
      {text}
    </span>
  );
};

export default ExpirationBadge;
