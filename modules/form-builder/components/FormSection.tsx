import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  error?: string;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  expanded = true,
  onToggle,
  error,
  className,
  dir = 'rtl',
}) => {
  return (
    <div 
      className={cn('form-section', error && 'has-error', className)}
      dir={dir}
    >
      <div 
        className={cn('section-header', onToggle && 'collapsible')}
        onClick={onToggle}
      >
        <div className="header-content">
          {icon && <span className="section-icon">{icon}</span>}
          <div className="header-text">
            <h3 className="section-title">{title}</h3>
            {description && (
              <p className="section-description">{description}</p>
            )}
          </div>
        </div>
        
        {onToggle && (
          <button 
            type="button"
            className={cn('expand-button', expanded && 'expanded')}
            aria-label={expanded ? 'Collapse section' : 'Expand section'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9L12 16L5 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      
      {expanded && (
        <div className="section-content">
          {children}
        </div>
      )}
      
      {error && (
        <div className="section-error">
          {error}
        </div>
      )}
    </div>
  );
};

// Styles matching the Figma design
const styles = `
.form-section {
  background: rgba(24, 0, 58, 0.73);
  border: 1px solid rgba(234, 242, 255, 0.22);
  border-radius: 6px;
  overflow: hidden;
}

.form-section.has-error {
  border-color: #F42588;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  min-height: 64px;
}

.section-header.collapsible {
  cursor: pointer;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #F42588;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-family: Inter;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.278em;
  color: rgba(255, 255, 255, 0.87);
  margin: 0;
}

.section-description {
  font-family: Inter;
  font-size: 14px;
  line-height: 1.5em;
  color: rgba(234, 234, 255, 0.5);
  margin: 0;
}

.expand-button {
  background: none;
  border: none;
  padding: 8px;
  color: rgba(234, 234, 255, 0.87);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.expand-button.expanded {
  transform: rotate(180deg);
}

.section-content {
  padding: 24px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.section-error {
  padding: 8px 32px;
  color: #F42588;
  font-size: 14px;
  background: rgba(244, 37, 136, 0.1);
}

[dir="rtl"] .section-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .header-content {
  flex-direction: row-reverse;
}

[dir="rtl"] .header-text {
  text-align: right;
}
`; 