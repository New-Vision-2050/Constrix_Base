import React from "react";
import LoadingSpinner from "@/components/ui/loadding-dots";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

/**
 * A reusable loading state component with spinner and optional text
 */
export default function LoadingState({
  title = "Loading data",
  description = "Please wait while we fetch your data...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 p-8 rounded-lg bg-[#140F35]/40">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {/* Spinner with backdrop effect */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2A1B3D] shadow-lg">
          <LoadingSpinner variant="blue" />
        </div>
        
        {/* Loading text */}
        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
