
import React from 'react';
import { motion } from "framer-motion";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showLoader?: boolean;
  loadingText?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  columns = 5, 
  rows = 5,
  showLoader = false,
  loadingText = "Loading data..."
}) => {
  // Add gradient shimmer effect with Tailwind CSS
  const shimmerStyles = {
    backgroundImage: 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.1) 20%, transparent 40%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite linear',
  };

  if (showLoader) {
    return (
      <div className="flex items-center justify-center py-12 w-full">
        <div className="text-center">
          <div className="inline-block border-t-4 border-primary w-8 h-8 rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full overflow-hidden rounded-lg border border-border bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={`header-${i}`} className="p-3">
                  <div 
                    className="h-6 w-24 rounded bg-secondary/80" 
                    style={shimmerStyles}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr 
                key={`row-${rowIdx}`} 
                className="border-b border-border last:border-0 odd:bg-background even:bg-secondary/30"
              >
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={`cell-${rowIdx}-${colIdx}`} className="p-3">
                    <div 
                      className="h-5 rounded bg-secondary/60" 
                      style={{ 
                        width: `${Math.max(50, Math.floor(Math.random() * 120))}px`,
                        ...shimmerStyles,
                        animationDelay: `${(rowIdx * columns + colIdx) * 50}ms`
                      }} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border flex justify-between items-center">
        <div className="h-8 w-24 rounded bg-secondary/70" style={shimmerStyles} />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={`page-${i}`} 
              className="h-8 w-8 rounded bg-secondary/70" 
              style={{
                ...shimmerStyles,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TableSkeleton;
