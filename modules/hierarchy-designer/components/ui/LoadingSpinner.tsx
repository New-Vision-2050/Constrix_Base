import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

/**
 * Loading spinner component
 * 
 * @param props Component props
 * @returns React component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3b82f6',
  className = '',
}) => {
  // Size mapping
  const sizeMap = {
    small: {
      width: '1.5rem',
      height: '1.5rem',
      borderWidth: '2px',
    },
    medium: {
      width: '2.5rem',
      height: '2.5rem',
      borderWidth: '3px',
    },
    large: {
      width: '3.5rem',
      height: '3.5rem',
      borderWidth: '4px',
    },
  };

  const { width, height, borderWidth } = sizeMap[size];

  return (
    <div 
      className={`loading-spinner-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 10,
      }}
    >
      <div
        className="loading-spinner"
        style={{
          width,
          height,
          borderRadius: '50%',
          border: `${borderWidth} solid rgba(0, 0, 0, 0.1)`,
          borderTopColor: color,
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;