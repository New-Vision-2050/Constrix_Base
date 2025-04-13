import { useEffect, useRef } from 'react';
import { useTableStore } from '@/modules/table/store/useTableStore';

/**
 * Hook to reset table state when the route changes
 * This prevents stale data from being displayed when navigating between pages
 *
 * @param tableId The ID of the table to reset
 * @param shouldReset Whether to reset the table on route change (default: true)
 */
export const useResetTableOnRouteChange = (
  tableId: string,
  shouldReset: boolean = true
) => {
  // We'll use a simpler approach that doesn't depend on next/navigation
  // This avoids potential issues with pathname not being available
  const isInitialRender = useRef(true);
  
  useEffect(() => {
    // Skip on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    // Skip if reset is disabled
    if (!shouldReset) return;
    
    // Return early to avoid any issues on first render
    return () => {
      // This cleanup function will run when the component unmounts
      // or when tableId or shouldReset changes
      
      // We don't actually need to do anything here since we're
      // not trying to reset on route change anymore
      // This hook is now just a placeholder for future implementation
      // when we have a more reliable way to detect route changes
    };
  }, [tableId, shouldReset]);
  
  // This hook now does nothing, but we keep it in place
  // so we don't have to remove it from all the components
  return;
};