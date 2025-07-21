import React from 'react';
import '../tailwind-keyframes.css';
import { useTheme } from 'next-themes';

const DeterminantSkeleton: React.FC = () => {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const skeletonBg = isDarkMode ? 'bg-[#1A103C]/40' : 'bg-gray-100';
  const skeletonBorder = isDarkMode ? 'border-[#2A1B3D]/40' : 'border-gray-200';
  const skeletonHighlight = isDarkMode ? 'bg-[#2A1B3D]/40' : 'bg-gray-200';
  const skeletonShimmer = isDarkMode ? 'via-[#2A1B3D]/30' : 'via-gray-100';
  return (
    <div 
      className={`${skeletonBg} border ${skeletonBorder} rounded-lg p-4 h-[200px] shadow-md overflow-hidden relative`}
    >
      {/* Title skeleton */}
      <div className={`h-6 w-3/4 ${skeletonHighlight} rounded mb-4 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${skeletonShimmer} to-transparent animate-[shimmer_1.5s_infinite]`}></div>
      </div>
      
      {/* Status skeleton */}
      <div className={`h-5 w-1/2 ${skeletonHighlight} rounded mb-3 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${skeletonShimmer} to-transparent animate-[shimmer_1.5s_infinite]`}></div>
      </div>
      
      {/* Icons and info */}
      <div className="flex justify-between mt-6">
        <div className={`h-8 w-8 ${skeletonHighlight} rounded-full relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${skeletonShimmer} to-transparent animate-[shimmer_1.5s_infinite]`}></div>
        </div>
        <div className={`h-4 w-1/3 ${skeletonHighlight} rounded relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${skeletonShimmer} to-transparent animate-[shimmer_1.5s_infinite]`}></div>
        </div>
      </div>
      
      {/* Lines */}
      <div className="mt-4 space-y-3">
        <div className={`h-3 w-full ${skeletonHighlight} rounded relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${skeletonShimmer} to-transparent animate-[shimmer_1.5s_infinite]`}></div>
        </div>
        <div className={`h-3 w-4/5 ${skeletonHighlight} rounded relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${skeletonShimmer} to-transparent animate-[shimmer_1.5s_infinite]`}></div>
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
