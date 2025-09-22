import React from 'react';

/**
 * Props for ErrorState component
 */
interface ErrorStateProps {
  /** Error message to display */
  message: string;
  /** Optional retry callback */
  onRetry?: () => void;
}

/**
 * ErrorState component for displaying error messages with retry option
 * Shows error icon, message and optional retry button
 */
const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-sidebar w-[370px] min-h-[330px]  m-2 rounded-2xl p-6 text-center">
      {/* Error icon */}
      <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>

      {/* Error message */}
      <p className="text-red-300 mb-4 text-sm">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors duration-200"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorState;
