import React from "react";

interface NoDataFoundProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * A reusable component to display when no data is available
 */
export default function NoDataFound({
  title = "No data found",
  description = "We couldn't find any data matching your criteria.",
  icon,
}: NoDataFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 p-8 rounded-lg bg-[#140F35]/40">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {/* Icon or default document icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2A1B3D] shadow-lg text-pink-500">
          {icon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="M9 15h6" />
            </svg>
          )}
        </div>
        
        {/* Text content */}
        <div className="mt-2 space-y-1">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
