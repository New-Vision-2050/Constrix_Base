import React from 'react';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  type?:"text" | "number";
}

/**
 * A reusable text input field component that can be used across the application
 */
export default function TextInputField({
  label,
  value,
  onChange,
  placeholder = '',
  name,
  required = false,
  disabled = false,
  error,
  className = '',
  dir = 'rtl',
  type = "text",
}: TextInputFieldProps) {
  const id = name || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label 
        htmlFor={id} 
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-red-500 mr-1 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        dir={dir}
        className={`
          w-full px-3 py-2 rounded-md border 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-input focus:border-primary'}
          ${disabled ? 'bg-muted text-muted-foreground' : 'bg-transparent'}
          focus:outline-none focus:ring-2 focus:ring-offset-0
        `}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
