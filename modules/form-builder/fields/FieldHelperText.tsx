
import React from 'react';
import { cn } from '@/lib/utils';

interface FieldHelperTextProps {
  error?: string;
  touched?: boolean;
  helperText?: string;
}

const FieldHelperText: React.FC<FieldHelperTextProps> = ({ error, touched, helperText }) => {
  const showError = error && touched;
  
  if (!showError && !helperText) return null;
  
  return (
    <div className={cn(
      "text-xs mt-1 z-30 relative", 
      showError ? "text-destructive font-medium" : "text-muted-foreground"
    )}>
      {showError ? error : helperText}
    </div>
  );
};

export default FieldHelperText;
