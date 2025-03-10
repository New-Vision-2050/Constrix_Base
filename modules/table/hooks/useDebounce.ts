
import React, { useCallback, useRef, useEffect } from 'react';

/**
 * A hook that returns a debounced version of the provided function.
 * The debounced function will only be called after the specified delay has passed
 * without the function being called again.
 *
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the provided function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  const timeoutRef = useRef<number | null>(null);
  const fnRef = useRef<T>(fn);

  // Update the function ref when the function changes
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Return a memoized callback that won't change on re-renders
  return useCallback(
    (...args :any[]) => {
      // Clear existing timeout
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current || 0);
      }

      // Set new timeout
      timeoutRef.current = window.setTimeout(() => {
        // Call the latest version of the function
        fnRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay] // Only recreate if delay changes
  );
}

/**
 * A hook that returns a debounced version of the provided value.
 * The debounced value will only update after the specified delay has passed
 * without the value changing.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
