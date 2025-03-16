
import { useState, useEffect, useRef } from 'react';

interface UseDropdownStateProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export function useDropdownState({ initialValue, onChange }: UseDropdownStateProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const isInitialRender = useRef(true);
  const previousValueRef = useRef(initialValue);
  const onChangeRef = useRef(onChange);

  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync local state with parent state when it changes
  useEffect(() => {
    // Always update local value when initialValue changes from parent
    if (initialValue !== previousValueRef.current) {
      setLocalValue(initialValue);
      previousValueRef.current = initialValue;
    }
  }, [initialValue]);

  // Skip the initial render to prevent double firing
  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  const handleSelect = (value: string) => {
    // Only update if value actually changed to prevent loops
    if (value !== localValue) {
      setLocalValue(value);
      previousValueRef.current = value;
      onChangeRef.current(value);
    }
  };

  return {
    localValue,
    handleSelect
  };
}
