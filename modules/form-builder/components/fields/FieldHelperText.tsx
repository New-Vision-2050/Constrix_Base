import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface FieldHelperTextProps {
  error?: string;
  touched?: boolean;
  helperText?: string;
  className?: string;
}

const FieldHelperText: React.FC<FieldHelperTextProps> = ({
  error,
  touched,
  helperText,
  className,
}) => {
  if (!error && !helperText) {
    return null;
  }
console.log(helperText)
  return (
    <div className={cn("mt-1 text-sm", className)}>
      {error && touched ? (
        <p className="text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-muted-foreground">{helperText}</p>
      ) : error ? (<p className="text-destructive">{error}</p>)
        : null}
    </div>
  );
};

export default memo(FieldHelperText);
