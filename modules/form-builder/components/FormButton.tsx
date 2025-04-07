import React from 'react';
import { cn } from '@/lib/utils';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  dir?: 'rtl' | 'ltr';
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconPosition = 'left',
  fullWidth,
  className,
  disabled,
  dir = 'rtl',
  ...props
}) => {
  return (
    <button
      className={cn(
        'form-button',
        `variant-${variant}`,
        `size-${size}`,
        loading && 'loading',
        fullWidth && 'full-width',
        className
      )}
      disabled={disabled || loading}
      dir={dir}
      {...props}
    >
      {loading ? (
        <span className="loading-spinner" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="button-icon left">{icon}</span>
          )}
          <span className="button-text">{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="button-icon right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// Styles matching the Figma design
const styles = `
.form-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-family: Inter;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.form-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.form-button.size-sm {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
}

.form-button.size-md {
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
}

.form-button.size-lg {
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
}

/* Variants */
.form-button.variant-primary {
  background: #F42588;
  color: #FFFFFF;
}

.form-button.variant-primary:hover {
  background: #D91E75;
}

.form-button.variant-primary:active {
  background: #BF1A67;
}

.form-button.variant-secondary {
  background: rgba(244, 37, 136, 0.1);
  color: #F42588;
}

.form-button.variant-secondary:hover {
  background: rgba(244, 37, 136, 0.15);
}

.form-button.variant-secondary:active {
  background: rgba(244, 37, 136, 0.2);
}

.form-button.variant-outline {
  background: transparent;
  border: 1px solid #F42588;
  color: #F42588;
}

.form-button.variant-outline:hover {
  background: rgba(244, 37, 136, 0.1);
}

.form-button.variant-outline:active {
  background: rgba(244, 37, 136, 0.15);
}

.form-button.variant-ghost {
  background: transparent;
  color: rgba(234, 234, 255, 0.87);
}

.form-button.variant-ghost:hover {
  background: rgba(234, 234, 255, 0.1);
}

.form-button.variant-ghost:active {
  background: rgba(234, 234, 255, 0.15);
}

/* Full width */
.form-button.full-width {
  width: 100%;
}

/* Loading state */
.form-button.loading {
  color: transparent;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Icon positioning */
.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-icon.left {
  margin-right: 8px;
}

.button-icon.right {
  margin-left: 8px;
}

/* RTL support */
[dir="rtl"] .button-icon.left {
  margin-right: 0;
  margin-left: 8px;
}

[dir="rtl"] .button-icon.right {
  margin-left: 0;
  margin-right: 8px;
}
`; 