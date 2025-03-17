import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface FieldHelperTextProps {
  error?: string | React.ReactNode;
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

  return (
    <div className={cn("mt-1 text-sm", className)}>
      {error && touched ? (
        <div className="text-destructive">
          {typeof error === 'string' ? <p>{error}</p> : error}
        </div>
      ) : helperText ? (
        <p className="text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
};

export default memo(FieldHelperText);