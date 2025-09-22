import React from 'react';

/**
 * LoadingState component for activity statistics
 * Shows skeleton placeholders with shimmer effect
 */
const LoadingState: React.FC = () => {
  return (
    <div className="bg-sidebar w-[370px] min-h-[280px]  m-2 rounded-2xl p-6 animate-pulse">
      <div className="space-y-6">
        {/* First activity skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-600 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-600 rounded w-32"></div>
              <div className="h-4 bg-gray-600 rounded w-48"></div>
            </div>
          </div>
        </div>

        {/* Second activity skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-600 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-600 rounded w-28"></div>
              <div className="h-4 bg-gray-600 rounded w-44"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
