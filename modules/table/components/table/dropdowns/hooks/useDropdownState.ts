import { useState, useEffect, useRef } from 'react';

interface UseDropdownStateProps<T extends string | string[]> {
  initialValue: T;
  onChange: (value: T) => void;
  isMulti?: boolean;
}

export function useDropdownState<T extends string | string[]>({
  initialValue,
  onChange,
  isMulti = false
}: UseDropdownStateProps<T>) {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const isInitialRender = useRef(true);
  const previousValueRef = useRef(initialValue);
  const onChangeRef = useRef(onChange);

  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync local state with parent state when it changes
  useEffect(() => {
    // For arrays, we need to check if the arrays are different
    const isDifferent = isMulti
      ? JSON.stringify(initialValue) !== JSON.stringify(previousValueRef.current)
      : initialValue != previousValueRef.current;

    // Always update local value when initialValue changes from parent
    if (isDifferent) {
      setLocalValue(initialValue);
      previousValueRef.current = initialValue;
    }
  }, [initialValue, isMulti]);

  // Skip the initial render to prevent double firing
  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  const handleSelect = (value: any) => {
    if (isMulti) {
      // For multi-select, value could be an array of strings
      const newValue = value as string[];
      const currentValue = localValue as string[];
      
      // Only update if arrays are different
      if (JSON.stringify(newValue) !== JSON.stringify(currentValue)) {
        setLocalValue(newValue as T);
        previousValueRef.current = newValue as T;
        onChangeRef.current(newValue as T);
      }
    } else {
      // For single select, value is a string
      const newValue = value as string;
      const currentValue = localValue as string;
      
      // Only update if value actually changed to prevent loops
      if (newValue != currentValue) {
        setLocalValue(newValue as T);
        previousValueRef.current = newValue as T;
        onChangeRef.current(newValue as T);
      }
    }
  };

  return {
    localValue,
    handleSelect
  };
}
