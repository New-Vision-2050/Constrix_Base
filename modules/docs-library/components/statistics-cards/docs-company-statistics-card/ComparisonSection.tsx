import React from 'react';
import ProgressBar from './ProgressBar';
import { ComparisonData } from './types';

/**
 * Props for ComparisonSection component
 */
interface ComparisonSectionProps {
  /** Comparison data to display */
  data: ComparisonData;
  /** Custom className */
  className?: string;
}

/**
 * ComparisonSection component for displaying comparison between two values
 * Shows left vs right values with labels and a progress bar
 */
const ComparisonSection: React.FC<ComparisonSectionProps> = ({ 
  data, 
  className = '' 
}) => {
  const { leftValue, leftLabel, rightValue, rightLabel, unit } = data;
  const totalValue = leftValue + rightValue;
  const rightPercentage = totalValue > 0 ? (rightValue / totalValue) * 100 : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Values comparison with VS indicator */}
      <div className="flex items-center justify-between  text-dark dark:text-white">
        {/* Left value section */}
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{leftLabel}</div>
          <div className="text-3xl font-bold">{leftValue}</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">{unit}</div>
        </div>

        {/* VS indicator with decorative lines */}
        <div className="flex flex-col items-center">
          {/* Top decorative line */}
          <div className="w-px h-8 bg-gray-700 mb-2"></div>
          
          {/* VS circle */}
          <div className="bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-gray-300 text-sm font-medium">VS</span>
          </div>
          
          {/* Bottom decorative line */}
          <div className="w-px h-8 bg-gray-700 mt-2"></div>
        </div>

        {/* Right value section */}
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{rightLabel}</div>
          <div className="text-3xl font-bold">{rightValue}</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">{unit}</div>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar percentage={rightPercentage} />
    </div>
  );
};

export default ComparisonSection;
