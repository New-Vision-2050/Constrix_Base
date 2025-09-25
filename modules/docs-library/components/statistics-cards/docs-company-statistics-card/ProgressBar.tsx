import React from 'react';
import { ProgressBarProps } from './types';

/**
 * ProgressBar component for visualizing progress with gradient colors
 * Displays a horizontal bar with orange-to-blue gradient based on percentage
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  className = '' 
}) => {
  // Ensure percentage is within valid range
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className={`w-full bg-[#FDB528] rounded-full h-2 ${className}`}>
      <div
        className="h-2 rounded-full bg-[#666CFF] transition-all duration-300 ease-in-out"
        style={{ width: `${normalizedPercentage}%` }}
        role="progressbar"
        aria-valuenow={normalizedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${normalizedPercentage}%`}
      />
    </div>
  );
};

export default ProgressBar;
