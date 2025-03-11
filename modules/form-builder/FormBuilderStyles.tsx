
import React from 'react';

const FormBuilderStyles: React.FC = () => {
  return (
    <style>
      {`
        /* Improved toast positioning */
        [data-radix-toast-viewport] {
          z-index: 50 !important;
          right: auto !important;
          left: 1rem !important;
          top: 1rem !important;
          pointer-events: auto !important;
        }
        
        [data-radix-toast-root] {
          pointer-events: auto !important;
        }
        
        [data-radix-toast-swipe-end] {
          --radix-toast-swipe-end-x: -100%;
        }
        
        [data-radix-toast-swipe-move] {
          --radix-toast-swipe-move-x: var(--radix-toast-swipe-move-x);
        }
        
        /* Ensure error messages have higher z-index than toasts */
        .text-destructive {
          z-index: 100 !important;
          position: relative !important;
        }
        
        /* Make form validation errors more prominent */
        [data-state="error"] {
          border-color: hsl(var(--destructive)) !important;
          box-shadow: 0 0 0 1px hsl(var(--destructive)) !important;
        }
        
        /* Ensure error messages are very visible */
        p.text-destructive {
          font-weight: 500 !important;
          margin-top: 0.25rem !important;
          font-size: 0.875rem !important;
        }
      `}
    </style>
  );
};

export default FormBuilderStyles;
