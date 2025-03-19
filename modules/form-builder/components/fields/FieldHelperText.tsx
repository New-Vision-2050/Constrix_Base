import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { isString } from '@tsparticles/engine';

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
        typeof error === 'string' ? (
          <p className="text-destructive">{error}</p>
        ) : (
          error
        )
      ) : helperText ? (
        <p className="text-muted-foreground">{helperText}</p>
      ) : error ? (
        typeof error === 'string' ? (
          <p className="text-destructive">{error}</p>
        ) : (
          error
        )
      ) : null}
    </div>
  );
};

export default memo(FieldHelperText);
