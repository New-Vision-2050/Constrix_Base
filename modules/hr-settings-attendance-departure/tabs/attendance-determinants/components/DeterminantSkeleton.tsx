import React from 'react';
import '../tailwind-keyframes.css';

const DeterminantSkeleton: React.FC = () => {
  return (
    <div 
      className="bg-[#1A103C]/40 border border-[#2A1B3D]/40 rounded-lg p-4 h-[200px] shadow-md overflow-hidden relative"
    >
      {/* Title skeleton */}
      <div className="h-6 w-3/4 bg-[#2A1B3D]/40 rounded mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A1B3D]/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
      </div>
      
      {/* Status skeleton */}
      <div className="h-5 w-1/2 bg-[#2A1B3D]/40 rounded mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A1B3D]/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
      </div>
      
      {/* Icons and info */}
      <div className="flex justify-between mt-6">
        <div className="h-8 w-8 bg-[#2A1B3D]/40 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A1B3D]/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
        <div className="h-4 w-1/3 bg-[#2A1B3D]/40 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A1B3D]/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>
      
      {/* Lines */}
      <div className="mt-4 space-y-3">
        <div className="h-3 w-full bg-[#2A1B3D]/40 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A1B3D]/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
        <div className="h-3 w-4/5 bg-[#2A1B3D]/40 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A1B3D]/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

// SkeletonGrid component to render multiple skeletons
export const DeterminantSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <DeterminantSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
};

export default DeterminantSkeleton;
