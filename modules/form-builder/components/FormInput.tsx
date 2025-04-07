import React from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: boolean;
  dir?: 'rtl' | 'ltr';
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({
    type = 'text',
    size = 'md',
    icon,
    iconPosition = 'left',
    error,
    className,
    dir = 'rtl',
    ...props
  }, ref) => {
    return (
      <div 
        className={cn(
          'form-input-wrapper',
          `size-${size}`,
          error && 'has-error',
          icon && `has-icon-${iconPosition}`,
          className
        )}
        dir={dir}
      >
        {icon && iconPosition === 'left' && (
          <span className="input-icon left">{icon}</span>
        )}
        
        <input
          ref={ref}
          type={type}
          className="form-input"
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <span className="input-icon right">{icon}</span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// Styles matching the Figma design
const styles = `
.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(24, 0, 58, 0.73);
  border: 1px solid rgba(234, 242, 255, 0.22);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.form-input-wrapper:focus-within {
  border-color: #F42588;
}

.form-input-wrapper.has-error {
  border-color: #F42588;
}

/* Sizes */
.form-input-wrapper.size-sm {
  height: 32px;
}

.form-input-wrapper.size-md {
  height: 40px;
}

.form-input-wrapper.size-lg {
  height: 48px;
}

/* Input field */
.form-input {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  background: transparent;
  border: none;
  outline: none;
  font-family: Inter;
  font-size: 14px;
  line-height: 1.5em;
  color: rgba(234, 234, 255, 0.87);
}

.form-input::placeholder {
  color: rgba(234, 234, 255, 0.5);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Icon styles */
.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  color: rgba(234, 234, 255, 0.5);
  flex-shrink: 0;
}

.has-icon-left .form-input {
  padding-left: 40px;
}

.has-icon-right .form-input {
  padding-right: 40px;
}

/* Size-specific padding adjustments */
.size-sm .form-input {
  padding: 0 12px;
}

.size-sm.has-icon-left .form-input {
  padding-left: 32px;
}

.size-sm.has-icon-right .form-input {
  padding-right: 32px;
}

.size-sm .input-icon {
  width: 32px;
}

.size-lg .form-input {
  padding: 0 20px;
  font-size: 16px;
}

.size-lg.has-icon-left .form-input {
  padding-left: 48px;
}

.size-lg.has-icon-right .form-input {
  padding-right: 48px;
}

.size-lg .input-icon {
  width: 48px;
}

/* RTL support */
[dir="rtl"] .has-icon-left .form-input {
  padding-left: 16px;
  padding-right: 40px;
}

[dir="rtl"] .has-icon-right .form-input {
  padding-right: 16px;
  padding-left: 40px;
}

[dir="rtl"].size-sm .has-icon-left .form-input {
  padding-left: 12px;
  padding-right: 32px;
}

[dir="rtl"].size-sm .has-icon-right .form-input {
  padding-right: 12px;
  padding-left: 32px;
}

[dir="rtl"].size-lg .has-icon-left .form-input {
  padding-left: 20px;
  padding-right: 48px;
}

[dir="rtl"].size-lg .has-icon-right .form-input {
  padding-right: 20px;
  padding-left: 48px;
}

/* Number input specific styles */
.form-input[type="number"] {
  -moz-appearance: textfield;
}

.form-input[type="number"]::-webkit-outer-spin-button,
.form-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Search input specific styles */
.form-input[type="search"]::-webkit-search-decoration,
.form-input[type="search"]::-webkit-search-cancel-button,
.form-input[type="search"]::-webkit-search-results-button,
.form-input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
`; 