import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Error message component
 * 
 * @param props Component props
 * @returns React component
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  onRetry,
  className = '',
}) => {
  return (
    <div 
      className={`error-message-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 10,
      }}
    >
      <div
        className="error-message"
        style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '90%',
          width: '400px',
          textAlign: 'center',
          border: '1px solid #f87171',
        }}
      >
        <h3 
          style={{
            color: '#ef4444',
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h3>
        
        <p 
          style={{
            color: '#4b5563',
            marginBottom: onRetry ? '1.25rem' : 0,
          }}
        >
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              marginTop: '1rem',
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;