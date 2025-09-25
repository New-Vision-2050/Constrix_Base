import React from 'react';
import { CircularProgressProps } from './types';

/**
 * CircularProgress component for displaying progress in a circular format
 * Creates an animated SVG circle with customizable color and size
 */
const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  color,
  size = 80,
  strokeWidth = 6,
  icon
}) => {
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      
      {/* Percentage text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-lg">
          {icon && (
              <div className={`text-[${color}]`}>
                {icon}
              </div>
            )}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
