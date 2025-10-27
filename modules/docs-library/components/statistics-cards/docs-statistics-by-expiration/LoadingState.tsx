import React from 'react';

/**
 * LoadingState component for expiration statistics
 * Shows skeleton placeholders with shimmer effect
 */
const LoadingState: React.FC = () => {
  return (
    <div className="bg-sidebar w-[370px] min-h-[330px] m-2 rounded-2xl p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-600 rounded w-48"></div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-600 rounded w-8"></div>
          <div className="h-4 bg-gray-600 rounded w-16"></div>
        </div>
      </div>

      {/* Badge skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-600 rounded-full w-20"></div>
      </div>

      {/* Document items skeleton */}
      <div className="space-y-4">
        {[1, 2].map((index) => (
          <div key={index} className="flex items-center justify-between py-3 border-l-4 border-gray-600 pl-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-24"></div>
                <div className="h-3 bg-gray-600 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
