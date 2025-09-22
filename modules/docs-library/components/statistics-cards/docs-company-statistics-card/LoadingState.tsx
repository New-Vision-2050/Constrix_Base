import React from 'react';

/**
 * LoadingState component for displaying beautiful loading animation
 * Shows skeleton placeholders with shimmer effect
 */
const LoadingState: React.FC = () => {
  return (
    <div className="bg-sidebar w-[370px] min-h-[280px]  m-2 rounded-2xl p-6 animate-pulse">
      {/* Header with icon and title skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-600 rounded w-32"></div>
        <div className="w-12 h-12 bg-gray-600 rounded-xl"></div>
      </div>

      {/* Main value skeleton */}
      <div className="text-right mb-2">
        <div className="h-12 bg-gray-600 rounded w-20 ml-auto mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-16 ml-auto"></div>
      </div>

      {/* Secondary value skeleton */}
      <div className="mb-6">
        <div className="h-6 bg-gray-600 rounded-full w-24"></div>
      </div>

      {/* Comparison section skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center space-y-2">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
            <div className="h-8 bg-gray-600 rounded w-12"></div>
            <div className="h-3 bg-gray-600 rounded w-8"></div>
          </div>
          <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
          <div className="text-center space-y-2">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
            <div className="h-8 bg-gray-600 rounded w-12"></div>
            <div className="h-3 bg-gray-600 rounded w-8"></div>
          </div>
        </div>
        <div className="h-2 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingState;
